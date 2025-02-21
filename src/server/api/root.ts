import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "~/server/api/routers/user";
import { fileRouter } from "~/server/api/routers/file";
import { albumRouter } from "~/server/api/routers/album";
import { commentRouter } from "~/server/api/routers/comment";
import { feedbackRouter } from "~/server/api/routers/feedback";
import { notificationRouter } from "~/server/api/routers/notification";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  file: fileRouter,
  album: albumRouter,
  comment: commentRouter,
  feedback: feedbackRouter,
  notification: notificationRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
