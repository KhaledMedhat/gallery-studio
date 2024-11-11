import { comments, files } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const commentRouter = createTRPCRouter({
  postComment: protectedProcedure
    .input(z.object({ id: z.string(), content: z.string() }))
    .mutation(async ({ input, ctx }) => {
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
        await ctx.db.insert(comments).values({
          content: input.content,
          userId: ctx.user.id,
          fileId: input.id,
          createdAt: new Date(),
        });
        await ctx.db
          .update(files)
          .set({
            comments: foundedFile?.comments + 1,
          })
          .where(eq(files.id, input.id));
      }
    }),
});
