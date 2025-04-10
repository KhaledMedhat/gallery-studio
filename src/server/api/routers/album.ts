import { albumFiles, albums, galleries } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { eq, inArray } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const albumRouter = createTRPCRouter({
  getAlbums: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const gallery = await ctx.db.query.galleries.findFirst({
        where: eq(galleries.slug, input.id),
      });
      if (!gallery) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Gallery not found",
        });
      }
      const existingAlbums = await ctx.db.query.albums.findMany({
        where: eq(albums.galleryId, gallery.id),
        with: {
          albumFiles: true,
        },
      });

      if (existingAlbums) {
        return existingAlbums;
      }
    }),

  createAlbum: protectedProcedure
    .input(z.object({ title: z.string(), id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const gallery = await ctx.db.query.galleries.findFirst({
        where: eq(galleries.slug, input.id),
      });
      if (!gallery) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Gallery not found",
        });
      }
      const album = await ctx.db.insert(albums).values({
        name: input.title,
        galleryId: gallery.id,
      });
      return album;
    }),

  addingFilesToNonExistingAlbum: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        id: z.string(),
        filesId: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const gallery = await ctx.db.query.galleries.findFirst({
        where: eq(galleries.slug, input.id),
      });
      if (!gallery) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Gallery not found",
        });
      }
      const existingInAlbum = await ctx.db.query.albumFiles.findMany({
        where: inArray(albumFiles.fileId, input.filesId),
      });
      const [album] = await ctx.db
        .insert(albums)
        .values({
          name: input.title,
          galleryId: gallery.id,
        })
        .returning();

      if (album) {
        const albumFileValues = input.filesId.map((fileId) => ({
          albumId: album.id,
          fileId,
        }));
        if (existingInAlbum) {
          await ctx.db
            .update(albumFiles)
            .set({
              albumId: album?.id,
            })
            .where(
              inArray(
                albumFiles.fileId,
                existingInAlbum.map((file) => file.fileId),
              ),
            );
        } else {
          await ctx.db.insert(albumFiles).values(albumFileValues);
        }
      }
    }),

  deleteAlbum: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const existingAlbum = await ctx.db.query.albums.findFirst({
        where: eq(albums.id, input.id),
      });
      if (!existingAlbum) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Album not found",
        });
      }
      await ctx.db.delete(albums).where(eq(albums.id, input.id));
    }),

  updateAlbum: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existingAlbum = await ctx.db.query.albums.findFirst({
        where: eq(albums.name, input.title),
      });
      if (existingAlbum) {
        throw new TRPCError({
          code: "CONFLICT",
          message:
            "Album already exists, you cannot name it the same as an existing album",
        });
      }
      await ctx.db
        .update(albums)
        .set({
          name: input.title,
        })
        .where(eq(albums.id, input.id));
    }),

  addToAlbum: protectedProcedure
    .input(
      z.object({
        id: z.array(z.string()),
        albumId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(albumFiles).values(
        input.id.map((fileId) => ({
          albumId: input.albumId,
          fileId,
        })),
      );
    }),

  deleteFileFromAlbum: protectedProcedure
    .input(
      z.object({
        id: z.array(z.string()),
        albumId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(albumFiles)
        .where(inArray(albumFiles.fileId, input.id));
    }),

  getAlbumById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const existingAlbum = await ctx.db.query.albums.findFirst({
        where: eq(albums.id, input.id),
        with: {
          albumFiles: {
            with: {
              files: true,
            },
          },
        },
      });
      if (!existingAlbum) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Album not found",
        });
      }
      return existingAlbum;
    }),
});
