import { comments, files } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

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
