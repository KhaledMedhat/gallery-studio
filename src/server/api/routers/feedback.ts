import { feedbacks } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const feedbackRouter = createTRPCRouter({
  allFeedbacks: publicProcedure
    .input(
      z.object({
        page: z.number().int().positive(),
        limit: z.number().int().positive(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, limit } = input;
      const offset = (page - 1) * limit;
      const feedbacks = await ctx.db.query.feedbacks.findMany({
        limit: input.limit,
        offset,
        with: {
          user: true,
        },
        orderBy: (feedbacks, { desc }) => [desc(feedbacks.createdAt)],
      });
      const totalCount = await ctx.db.query.feedbacks.findMany();
      const totalPages = Math.ceil(totalCount.length / limit);
      return {
        feedbacks,
        totalPages,
        currentPage: page,
      };
    }),
  postFeedback: protectedProcedure
    .input(z.object({ content: z.string() }))
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
