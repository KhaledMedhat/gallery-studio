import { comments, feedbacks, files } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const feedbackRouter = createTRPCRouter({
  allFeedbacks: publicProcedure.query(async ({ ctx }) => {
    const feedbacks = await ctx.db.query.feedbacks.findMany();
    return feedbacks;
  }),
  postFeedback: protectedProcedure
    .input(z.object({ id: z.string(), content: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized",
        });
      }
      await ctx.db.insert(feedbacks).values({
        feedback: input.content,
        userId: ctx.user.id,
        createdAt: new Date(),
      });
    }),
});
