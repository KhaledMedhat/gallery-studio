import { z } from "zod";
import { accounts, galleries, otp, sessions, users } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { randomBytes } from "crypto";
import { db } from "~/server/db";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { Send } from "~/app/api/send/route";
import { hashPassword, generateOTP } from "~/utils/utils";

export const userRouter = createTRPCRouter({
  sendingOTP: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const generatedOTP = generateOTP();
      const existedEmail = await ctx.db.query.users.findFirst({
        where: eq(users.email, input.email),
      });
      if (existedEmail) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email already exists",
        });
      }
      const OTP = await Send(input.name, generatedOTP, input.email);
      if (OTP) {
        await ctx.db.insert(otp).values({
          otp: generatedOTP,
          email: input.email,
        });
      }
    }),
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().min(1),
        password: z.string().min(1),
        otp: z.string().length(6),
        image: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const hashedPassword = hashPassword(input.password);
      try {
        const storedOTP = await ctx.db.query.otp.findFirst({
          where: eq(otp.email, input.email),
        });
        if (!storedOTP) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "No OTP found to this email.",
          });
        }
        if (storedOTP.otp !== input.otp) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "OTP is not valid",
          });
        } else {
          await ctx.db.delete(otp).where(eq(otp.email, input.email));
          const [user] = await ctx.db
            .insert(users)
            .values({
              email: input.email,
              password: hashedPassword,
              image: input.image,
              name: input.name,
            })
            .returning();
          if (user) {
            await ctx.db
              .insert(galleries)
              .values({
                createdById: user?.id,
              })
              .returning();
          }
          return user;
        }
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Something went wrong ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
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
      const existingSession = await ctx.db.query.sessions.findFirst({
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
    if(!ctx.user) {
      return null
    }
    return ctx.user;
  }),

  getProvidedUserRoute: protectedProcedure.query(async ({ ctx }) => {
      const existedUserAccount = await ctx.db.query.accounts.findFirst({
        where: eq(accounts.userId, ctx.user?.id ?? ""),
      })
      if(existedUserAccount) {
        return existedUserAccount
      }
      return null
  }),
});
