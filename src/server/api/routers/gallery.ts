import { galleries } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

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

  getGallerySlug: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const existingGallery = await ctx.db.query.galleries.findFirst({
        where: eq(galleries.id, input.id),
      });

      if (!existingGallery) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Gallery not found",
        });
      }
      return existingGallery.slug;
    }),
});
