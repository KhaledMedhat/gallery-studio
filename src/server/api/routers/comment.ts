import { comments, files } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createCaller } from "../root";
import { NotificationTypeEnum } from "~/types/types";
import { extractUsernameAndText } from "~/utils/utils";

export const commentRouter = createTRPCRouter({
  unlikeComment: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized",
        });
      }
      const foundedComment = await ctx.db.query.comments.findFirst({
        where: eq(files.id, input.id),
      });
      if (foundedComment) {
        await ctx.db
          .update(comments)
          .set({
            likesInfo: foundedComment.likesInfo?.filter(
              (like) => like.userId !== ctx.user?.id,
            ),
          })
          .where(eq(comments.id, input.id));
      }
    }),

  likeComment: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized",
        });
      }
      const caller = createCaller(ctx);
      const foundedComment = await ctx.db.query.comments.findFirst({
        where: eq(files.id, input.id),
      });

      if (foundedComment) {
        const updatedLikesInfo = [
          ...(foundedComment.likesInfo ?? []),
          { liked: true, userId: ctx.user?.id },
        ];
        await ctx.db
          .update(comments)
          .set({
            likesInfo: updatedLikesInfo,
          })
          .where(eq(comments.id, input.id));

        await caller.notification.sendNotification({
          notificationType: NotificationTypeEnum.LIKE_COMMENT,
          fileId: foundedComment.fileId,
          commentId: foundedComment.id,
          notificationReceiverId: [foundedComment.userId],
          isRead: false,
          notificationContent: {
            sender: ctx.user.name,
            title: "liked your comment.",
            content: "",
          },
        });
      }
    }),

  postComment: protectedProcedure
    .input(z.object({ id: z.string(), content: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized",
        });
      }
      const foundedFile = await ctx.db.query.files.findFirst({
        where: eq(files.id, input.id),
      });
      const caller = createCaller(ctx);
      const isAMention = extractUsernameAndText(input.content).username;
      if (foundedFile) {
        await ctx.db.insert(comments).values({
          content: input.content,
          userId: ctx.user.id,
          fileId: input.id,
          createdAt: new Date(),
        });
        await ctx.db
          .update(files)
          .set({
            commentsCount: foundedFile?.commentsCount + 1,
          })
          .where(eq(files.id, input.id));
        await caller.notification.sendNotification({
          notificationType: isAMention
            ? NotificationTypeEnum.MENTION
            : NotificationTypeEnum.COMMENT,
          fileId: foundedFile.id,
          commentId: null,
          notificationReceiverId: [foundedFile?.createdById],
          isRead: false,
          notificationContent: {
            sender: ctx.user.name,
            title: isAMention
              ? "mentioned you in a comment."
              : "commented on your showcase.",
            content: input.content,
          },
        });
      }
    }),

  postReply: protectedProcedure
    .input(z.object({ id: z.string(), content: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized",
        });
      }
      const foundedComment = await ctx.db.query.comments.findFirst({
        where: eq(comments.id, input.id),
      });
      const caller = createCaller(ctx);
      const isAMention = extractUsernameAndText(input.content).username;

      if (!foundedComment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Comment not found",
        });
      }
      await ctx.db.insert(comments).values({
        content: input.content,
        userId: ctx.user.id,
        fileId: foundedComment.fileId,
        parentId: foundedComment.id,
        createdAt: new Date(),
        isReply: true,
      });
      await caller.notification.sendNotification({
        notificationType: isAMention
          ? NotificationTypeEnum.MENTION
          : NotificationTypeEnum.REPLY,
        fileId: foundedComment.fileId,
        commentId: foundedComment.id,
        notificationReceiverId: [foundedComment.userId],
        isRead: false,
        notificationContent: {
          sender: ctx.user.name,
          title: isAMention
            ? "mentioned you in a reply."
            : "replied to your comment.",
          content: input.content,
        },
      });
    }),

  updateComment: protectedProcedure
    .input(z.object({ id: z.string(), content: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized",
        });
      }
      const foundedComment = await ctx.db.query.comments.findFirst({
        where: eq(comments.id, input.id),
      });
      if (!foundedComment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Comment not found",
        });
      }
      await ctx.db
        .update(comments)
        .set({
          content: input.content,
        })
        .where(eq(comments.id, input.id));
    }),

  deleteComment: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized",
        });
      }
      const foundedComment = await ctx.db.query.comments.findFirst({
        where: eq(comments.id, input.id),
      });
      if (!foundedComment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Comment not found",
        });
      }
      const foundedFile = await ctx.db.query.files.findFirst({
        where: eq(files.id, foundedComment.fileId),
      });
      if (!foundedFile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Showcase not found",
        });
      }
      await ctx.db.delete(comments).where(eq(comments.id, input.id));
      await ctx.db
        .update(files)
        .set({
          commentsCount: foundedFile?.commentsCount - 1,
        })
        .where(eq(files.id, foundedComment.fileId));
    }),
});
