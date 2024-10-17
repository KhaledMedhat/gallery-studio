import { galleries, files } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { eq, inArray } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const fileRouter = createTRPCRouter({
  getFiles: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Unauthorized",
      });
    }
    const foundedFile = await ctx.db.query.files.findMany({
      where: eq(files.createdById, ctx.user?.id),
    });

    if (!foundedFile) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "You don't have any images yet",
      });
    }

    return foundedFile;
  }),

  addFile: protectedProcedure
    .input(
      z.object({
        url: z.string(),
        fileKey: z.string(),
        fileType: z.string(),
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

      const [newFile] = await ctx.db
        .insert(files)
        .values({
          url: input.url,
          fileKey: input.fileKey,
          fileType: input.fileType,
          caption: input.caption,
          tags: input.tags,
          createdById: ctx.user.id,
          galleryId: gallery.id,
        })
        .returning();

      return newFile;
    }),

  getFileById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized",
        });
      }
      const foundedFile = await ctx.db.query.files.findFirst({
        where: eq(files.id, input.id),
      });
      if (!foundedFile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Image not found",
        });
      }
      return foundedFile;
    }),

  deleteFile: protectedProcedure
    .input(z.object({ id: z.array(z.string()) }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized",
        });
      }
      await ctx.db.delete(files).where(inArray(files.id, input.id));
    }),
});
