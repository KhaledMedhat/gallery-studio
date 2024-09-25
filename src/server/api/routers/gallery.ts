import { galleries } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const galleryRouter = createTRPCRouter({
  getUserGallery: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existingGallery = await ctx.db.query.galleries.findFirst({
        where: eq(galleries.createdById, input.id),
      });

      if (existingGallery) {
        return existingGallery;
      }
      const [newGallery] = await ctx.db
        .insert(galleries)
        .values({
          createdById: input.id,
        })
        .returning();

      return newGallery;
    }),
});
