import { galleries, images } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const imageRouter = createTRPCRouter({
  getImage: protectedProcedure
    .query(async ({ ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized",
        });
      }
      const foundedImages = await ctx.db.query.images.findMany({
        where: eq(images.createdById, ctx.user?.id),
      });

      if (!foundedImages) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "You don't have any images yet",
        });
      }

      return foundedImages;
    }),

  createImage: protectedProcedure
    .input(
      z.object({
        url: z.string(),
        imageKey: z.string(),
        caption: z.string(),
        tags: z.array(z.string()).optional(),
        gallerySlug: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized",
        });
      }
      const gallery = await ctx.db.query.galleries.findFirst({
        where: eq(galleries.slug, input.gallerySlug),
      });

      if (!gallery) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Gallery not found",
        });
      }
      
      const [newImage] = await ctx.db.insert(images).values({
        url: input.url,
        imageKey: input.imageKey,
        caption: input.caption,
        tags: input.tags,
        createdById: ctx.user.id,
        galleryId: gallery.id,
      }).returning();

      return newImage;
    }),

    getImageById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized",
        });
      }
      const foundedImage = await ctx.db.query.images.findFirst({
        where: eq(images.id, input.id),
      });
      if (!foundedImage) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Image not found",
        });
      }
      return foundedImage;
    }),
});
