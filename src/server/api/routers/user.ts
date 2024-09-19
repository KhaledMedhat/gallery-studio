import { z } from "zod";
import { sessions, users } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { hashPassword } from "~/utils/hashPassword";
import { randomBytes } from "crypto";
import { db } from "~/server/db";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { setSessionCookie } from "~/utils/setSessionCookie";
import { setCookie } from "cookies-next";
import { cookies } from "next/headers";

export const userRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().min(1),
        password: z.string().min(1),
        image: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const hashedPassword = hashPassword(input.password);

      try {
        const [user] = await ctx.db
          .insert(users)
          .values({
            email: input.email,
            password: hashedPassword,
            image: input.image,
            name: input.name,
          })
          .returning();
        return user;
      } catch (error: unknown) {
        if (
          error instanceof Error &&
          "code" in error &&
          error.code === "23505"
        ) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Email already exists",
          });
        }
        throw error;
      }
    }),

  login: publicProcedure
    .input(z.object({ email: z.string().min(1), password: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const hashedPassword = hashPassword(input.password);
      const cookieStore = cookies();
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.email, input.email),
      });

      if (!user || user.password !== hashedPassword) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }
      const existingSession = await db.query.sessions.findFirst({
        where: eq(sessions.userId, user.id),
        orderBy: (sessions, { desc }) => [desc(sessions.expires)],
      });

      if (existingSession && existingSession.expires > new Date()) {
        cookieStore.set("sessionToken", existingSession.sessionToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // Use secure cookie in production
          expires: existingSession.expires,
        });
        return { user, sessionToken: existingSession.sessionToken };
      }
      const sessionToken = randomBytes(32).toString("hex");
      const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

      await db.insert(sessions).values({
        sessionToken,
        userId: user.id,
        expires,
      });
      const session = {
        user: { id: user.id, name: user.name, email: user.email },
        expires: expires.toISOString(),
      };


      cookieStore.set("sessionToken", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Use secure cookie in production
        expires,
      });

      return { session, sessionToken };
    }),

  getUser: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session || !ctx.session.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "No session found.",
      });
    }
    const user = await ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.session.user.id),
    });
    if (!user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid or expired session",
      });
    }

    return user;
  }),
});
