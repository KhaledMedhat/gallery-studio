import { galleries } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { eq } from "drizzle-orm";

export const galleryRouter = createTRPCRouter({
  getProvidedUserAccountGallery: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const existingGallery = await ctx.db.query.galleries.findFirst({
        where: eq(galleries.createdById, input.id),
      });

      if (existingGallery) {
        return existingGallery;
      }
    }),
});
