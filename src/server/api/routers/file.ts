import { galleries, files, albums, albumFiles } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import { eq, inArray } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const fileRouter = createTRPCRouter({
  unlikeFile: protectedProcedure
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
      if (foundedFile) {
        await ctx.db
          .update(files)
          .set({
            likesInfo: foundedFile.likesInfo?.filter(
              (like) => like.userId !== ctx.user?.id,
            ),
          })
          .where(eq(files.id, input.id));
        await ctx.db
          .update(files)
          .set({
            likes: foundedFile.likes - 1,
          })
          .where(eq(files.id, input.id));
      }
    }),

  likeFile: protectedProcedure
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

      if (foundedFile) {
        await ctx.db
          .update(files)
          .set({
            likesInfo: [{ liked: true, userId: ctx.user?.id }],
          })
          .where(eq(files.id, input.id));
        await ctx.db
          .update(files)
          .set({
            likes: foundedFile.likes + 1,
          })
          .where(eq(files.id, input.id));
      }
    }),

  getShowcaseFiles: protectedProcedure.query(async ({ ctx }) => {
    if(!ctx.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You need to be logged in to access this.",
      });
    }
    const showcaseFiles = await ctx.db.query.files.findMany({
      where: eq(files.filePrivacy, "public"),
      with: {
        user: true,
        commentsInfo: {
          with: {
            user: true,
          },
        },
      },
    });
    return showcaseFiles;
  }),

  getFiles: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Unauthorized",
      });
    }
    const foundedFile = await ctx.db.query.files.findMany({
      where: eq(files.createdById, ctx.user?.id),
      orderBy: (files, { desc }) => [desc(files.createdAt)],
    });

    return foundedFile;
  }),

  addFile: protectedProcedure
    .input(
      z.object({
        url: z.string(),
        fileKey: z.string(),
        fileType: z.string(),
        filePrivacy: z.enum(["private", "public"]),
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
          filePrivacy: input.filePrivacy,
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
    .query(async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized",
        });
      }
      const foundedFile = await ctx.db.query.files.findFirst({
        where: eq(files.id, input.id),
        with: {
          user: true,
          commentsInfo: {
            with: {
              user: true,
            },
          },
        },
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

  updateFile: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        caption: z.string(),
        tags: z.array(z.string()).optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized",
        });
      }

      const updatedFile = await ctx.db
        .update(files)
        .set({
          caption: input.caption,
          tags: input.tags,
        })
        .where(eq(files.id, input.id))
        .returning();

      return updatedFile;
    }),

  getAlbumFiles: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized",
        });
      }
      const existingFiles = await ctx.db.query.albumFiles.findMany({
        where: eq(albumFiles.albumId, input.id),
      });

      if (existingFiles) {
        const oldFiles = existingFiles.map((fileId) => fileId.fileId);
        const albumFiles = await ctx.db.query.files.findMany({
          where: inArray(files.id, oldFiles),
        });
        return albumFiles;
      }
    }),

  addToExistedAlbum: protectedProcedure
    .input(
      z.object({
        id: z.array(z.string()),
        albumTitle: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized",
        });
      }
      const existingAlbum = await ctx.db.query.albums.findFirst({
        where: eq(albums.name, input.albumTitle),
      });
      if (!existingAlbum) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Album with title "${input.albumTitle}" not found.`,
        });
      }
      const albumFileValues = input.id.map((fileId) => ({
        albumId: existingAlbum.id,
        fileId,
      }));
      return await ctx.db.insert(albumFiles).values(albumFileValues);
    }),
});
