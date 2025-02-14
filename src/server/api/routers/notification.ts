import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { eq } from "drizzle-orm";
import { notifications } from "~/server/db/schema";
import { NotificationTypeEnum } from "~/types/types";

export const notificationRouter = createTRPCRouter({
  sendNotification: protectedProcedure
    .input(
      z.object({
        notificationType: z.nativeEnum(NotificationTypeEnum),
        fileId: z.string().nullable(),
        commentId: z.string().nullable(),
        notificationReceiverId: z.array(z.string()),
        isRead: z.boolean(),
        notificationContent: z.object({
          sender: z.string(),
          title: z.string(),
          content: z.string(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      for (const receiverId of input.notificationReceiverId) {
        if (receiverId === ctx.user?.id) {
          return null;
        }
        await ctx.db
          .insert(notifications)
          .values({
            notificationReceiverId: receiverId,
            senderId: ctx.user?.id ?? "",
            fileId: input.fileId,
            commentId: input.commentId,
            notificationType: input.notificationType,
            notificationContent: input.notificationContent,
            isRead: input.isRead,
          })
          .returning();
      }
    }),

  getNotifications: protectedProcedure.query(async ({ ctx }) => {
    const foundedNotifications = await ctx.db.query.notifications.findMany({
      where: eq(notifications.notificationReceiverId, ctx.user?.id ?? ""),
      with: {
        sender: true,
      },
      orderBy: (notifications, { desc }) => [desc(notifications.createdAt)],
    });
    return foundedNotifications;
  }),

  updateNotificationIsRead: protectedProcedure
    .input(z.object({ isRead: z.boolean(), notificationId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db
        .update(notifications)
        .set({ isRead: input.isRead })
        .where(eq(notifications.id, input.notificationId));
    }),
});
