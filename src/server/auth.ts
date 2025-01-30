import { eq } from "drizzle-orm";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { env } from "~/env";
import { db } from "~/server/db";
import { sessions, users } from "~/server/db/schema";
import { customDrizzleAdapter } from "./db/CustomDrizzleAdapter";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: async ({ session, user }) => {
      const dbSession = await db.query.sessions.findFirst({
        where: eq(sessions.userId, user.id),
      });
      if (!dbSession) {
        await db.insert(sessions).values({
          sessionToken: crypto.randomUUID(),
          userId: user.id,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        });
      }
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
        },
      };
    },
    async signIn({ user }) {
      // Check if the user exists in your database
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, user.email ?? ""),
      });

      if (existingUser?.provider === "email") {
        // Update the provider if it's not set
        return "/sign-in?error=true";
      }

      // User exists, continue with sign in
      return true;
    },
  },
  events: {
    signOut: async ({ session }) => {
      await db.delete(users).where(eq(users.id, session.user.id));
    },
  },

  adapter: customDrizzleAdapter,

  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    // TwitterProvider({
    //   clientId: env.TWITTER_CLIENT_ID,
    //   clientSecret: env.TWITTER_CLIENT_SECRET,
    //   version: "2.0",
    // }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
