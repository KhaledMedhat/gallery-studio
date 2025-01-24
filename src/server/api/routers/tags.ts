import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { eq } from "drizzle-orm";
import { tags } from "~/server/db/schema";

export const tagsRouter = createTRPCRouter({
  addTags: protectedProcedure
    .input(z.object({ tags: z.array(z.string()).optional() }))
    .mutation(async ({ ctx, input }) => {
      const addedTags = input.tags
        ? await Promise.all(
            input.tags.map(async (tag) => {
              const existedTag = await ctx.db.query.tags.findFirst({
                where: eq(tags.tagName, tag),
              });
              if (existedTag) {
                await ctx.db
                  .update(tags)
                  .set({ tagUsedCount: existedTag.tagUsedCount + 1 })
                  .where(eq(tags.tagName, tag));
              }
              await ctx.db
                .insert(tags)
                .values({ tagName: tag, tagUsedCount: 1 })
                .returning();
            }),
          )
        : [];
      return addedTags;
    }),

  getTags: protectedProcedure
    .input(z.object({ tagName: z.string() }))
    .query(async ({ ctx, input }) => {
      const foundedTags = await ctx.db.query.tags.findMany({
        where: eq(tags.tagName, input.tagName),
        orderBy: (tags, { desc }) => [desc(tags.tagUsedCount)],
      });
      return foundedTags;
    }),
});
