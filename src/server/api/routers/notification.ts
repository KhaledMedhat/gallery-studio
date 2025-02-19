import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { eq } from "drizzle-orm";
import { notifications } from "~/server/db/schema";

export const notificationRouter = createTRPCRouter({
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
