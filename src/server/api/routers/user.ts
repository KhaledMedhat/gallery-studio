import { z } from "zod";
import {
  accounts,
  files,
  galleries,
  otp,
  sessions,
  tags,
  users,
} from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { randomBytes } from "crypto";
import { db } from "~/server/db";
import { TRPCError } from "@trpc/server";
import { and, eq, inArray, like } from "drizzle-orm";
import { cookies } from "next/headers";
import { Send, SendResetPasswordLink } from "~/app/api/send/route";
import { hashPassword, generateOTP } from "~/utils/utils";
import CryptoJS from "crypto-js";
export const userRouter = createTRPCRouter({
  resetPassword: publicProcedure
    .input(z.object({ id: z.string().min(1), password: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const bytes = CryptoJS.AES.decrypt(
        input.id,
        process.env.NEXT_PUBLIC_ENCRYPTION_SECRET_KEY!,
      );
      const decryptedId = bytes.toString(CryptoJS.enc.Utf8);
      await ctx.db
        .update(users)
        .set({ password: hashPassword(input.password) })
        .where(eq(users.id, decryptedId));
    }),
  sendResetPasswordLink: publicProcedure
    .input(
      z.object({
        email: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.email, input.email),
      });
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invalid email",
        });
      }
      if (user.provider !== "email") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: `Your account is linked to ${user.provider} account. Please login with ${user.provider}`,
        });
      }
      const encryptedId = CryptoJS.AES.encrypt(
        user.id,
        process.env.NEXT_PUBLIC_ENCRYPTION_SECRET_KEY!,
      ).toString();
      const fullName = user.firstName + " " + user.lastName;
      await SendResetPasswordLink(fullName, encryptedId, input.email);
    }),
  deleteOtp: publicProcedure
    .input(z.object({ email: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(otp).where(eq(otp.email, input.email));
    }),
  verifyEmail: publicProcedure
    .input(
      z.object({
        email: z.string().min(1).toLowerCase(),
        username: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existedEmail = await ctx.db.query.users.findFirst({
        where: eq(users.email, input.email),
      });
      const existedUsername = await ctx.db.query.users.findFirst({
        where: eq(users.name, input.username),
      });
      if (existedEmail) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email already exists",
        });
      }
      if (existedUsername) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Username already exists",
        });
      }
      return true;
    }),
  sendingOTP: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const generatedOTP = generateOTP();
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
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.string().min(1).toLowerCase(),
        password: z.string().min(1),
        username: z.string().min(1),
        otp: z.string().length(6),
        image: z
          .object({ imageUrl: z.string(), imageKey: z.string() })
          .optional(),
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
              email: input.email.toLocaleLowerCase(),
              password: hashedPassword,
              name: input.username,
              provider: "email",
              profileImage: input.image ?? { imageUrl: "", imageKey: "" },
              firstName: input.firstName,
              lastName: input.lastName,
              createdAt: new Date(),
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
          message: `Something went wrong ${error instanceof Error ? error.message : "Unknown error"}`,
        });
      }
    }),

  login: publicProcedure
    .input(
      z.object({
        email: z.string().min(1).toLowerCase(),
        password: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const foundedUser = await ctx.db.query.users.findFirst({
        where: eq(users.email, input.email),
      });
      if (!foundedUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Email not found",
        });
      }
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
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          name: user.name,
          email: user.email,
        },
        expires: expires.toISOString(),
      };

      cookieStore.set("sessionToken", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Use secure cookie in production
        expires,
      });
      const gallery = await ctx.db.query.galleries.findFirst({
        where: eq(galleries.createdById, user.id),
      });
      if (gallery) {
        return { session, sessionToken, gallery };
      }
      return { session, sessionToken };
    }),

  getUser: publicProcedure.query(async ({ ctx }) => {
    const existedUser = await ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.user?.id ?? ""),
      with: {
        gallery: true,
      },
    });
    return existedUser;
  }),

  getUserByUsername: protectedProcedure
    .input(
      z.object({
        username: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const existedUser = await ctx.db.query.users.findFirst({
        where: eq(users.name, input.username),
        with: {
          files: {
            with: {
              user: true,
              commentsInfo: {
                with: {
                  user: true,
                },
              },
            },
          },
        },
      });
      if (!existedUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "user not found",
        });
      }
      return existedUser;
    }),

  getProvidedUserRoute: protectedProcedure.query(async ({ ctx }) => {
    const existedUserAccount = await ctx.db.query.accounts.findFirst({
      where: eq(accounts.userId, ctx.user?.id ?? ""),
    });
    if (existedUserAccount) {
      return existedUserAccount;
    }
    return null;
  }),

  getFileUser: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const file = await ctx.db.query.files.findFirst({
        where: eq(files.id, input.id),
      });
      if (!file) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "File not found",
        });
      }
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.id, file.createdById),
      });
      return user;
    }),

  updateUserProfile: protectedProcedure
    .input(
      z.object({
        image: z
          .object({ imageUrl: z.string(), imageKey: z.string() })
          .optional(),
        username: z.string().min(1).optional(),
        coverImage: z
          .object({ imageUrl: z.string(), imageKey: z.string() })
          .optional(),
        firstName: z.string().min(1).optional(),
        lastName: z.string().min(1).optional(),
        bio: z.string().optional(),
        socialUrls: z
          .array(z.object({ platformIcon: z.string(), url: z.string() }))
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action",
        });
      }
      await ctx.db
        .update(users)
        .set({
          profileImage: input.image,
          name: input.username,
          coverImage: input.coverImage,
          firstName: input.firstName,
          lastName: input.lastName,
          bio: input.bio,
          socialUrls: input.socialUrls,
        })
        .where(eq(users.id, ctx.user?.id));
    }),

  followUser: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized",
        });
      }
      const foundedUser = await ctx.db.query.users.findFirst({
        where: eq(users.id, input.id),
      });

      if (!foundedUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found.",
        });
      }
      const updateFollowingUsers = [
        ...(ctx.user?.followings ?? []),
        { followed: true, userId: foundedUser.id },
      ];

      const updateFollowersForTheFollowedUser = [
        ...(foundedUser.followers ?? []),
        { followed: true, userId: ctx.user.id },
      ];
      await ctx.db
        .update(users)
        .set({
          followings: updateFollowingUsers,
        })
        .where(eq(users.id, ctx.user.id));

      await ctx.db
        .update(users)
        .set({
          followers: updateFollowersForTheFollowedUser,
        })
        .where(eq(users.id, foundedUser.id));
    }),

  unfollowUser: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized",
        });
      }
      const foundedUser = await ctx.db.query.users.findFirst({
        where: eq(users.id, input.id),
      });
      if (!foundedUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found.",
        });
      }
      await ctx.db
        .update(users)
        .set({
          followings: ctx.user?.followings?.filter(
            (follow) => follow.userId !== foundedUser.id,
          ),
        })
        .where(eq(users.id, ctx.user.id));
      await ctx.db
        .update(users)
        .set({
          followers: foundedUser?.followers?.filter(
            (follow) => follow.userId !== ctx.user?.id,
          ),
        })
        .where(eq(users.id, foundedUser.id));
    }),
    
  getFollowingUsersInMentionSearch: protectedProcedure
    .input(z.object({ search: z.string().trim() }))
    .mutation(async ({ ctx, input }) => {
      const existedUserFollowings =
        ctx.user?.followings?.map((following) => following.userId) ?? [];
      const foundedUsers = await ctx.db.query.users.findMany({
        where: and(
          inArray(users.id, existedUserFollowings),
          like(users.name, `%${input.search}%`),
        ),
      });

      if (!foundedUsers) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }
      return foundedUsers;
    }),

  usersSearch: protectedProcedure
    .input(z.object({ search: z.string().trim() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized",
        });
      }
      const foundedUsers = await ctx.db.query.users.findMany({
        where: like(users.name, `${input.search}%`),
        with: {
          files: {
            with: {
              user: true,
              commentsInfo: {
                with: {
                  user: true,
                },
              },
            },
          },
        },
      });
      const foundedTag = await ctx.db.query.tags.findMany({
        where: like(tags.tagName, `%${input.search}%`),
      });
      if (!foundedUsers || !foundedTag) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }
      return { foundedUsers, foundedTag };
    }),
});
