import { and, eq, or } from "drizzle-orm";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

import { env } from "~/env";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import { customDrizzleAdapter } from "./db/CustomDrizzleAdapter";
import type { User } from "~/types/types";
import { hashPassword } from "~/utils/utils";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: User & DefaultSession["user"];
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    session: async ({ session, token }) => {
      const dbUser = await db.query.users.findFirst({
        where: eq(users.id, token.id as string),
        with: {
          gallery: true,
        },
      });

      if (dbUser) {
        session.user = { ...session.user, ...dbUser };
      }

      return session;
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async signIn({ credentials }) {
      if (credentials) {
        const existingUser = await db.query.users.findFirst({
          where: eq(users.email, credentials.email as string),
        });

        if (existingUser) {
          return true;
        }
      }
      return false;
    },
  },

  adapter: customDrizzleAdapter,
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const user = await db.query.users.findFirst({
          where: eq(users.email, credentials.email),
        });

        if (!user) {
          throw new Error("Account not found.");
        }
        if (user?.password !== hashPassword(credentials.password)) {
          throw new Error("Invalid password.");
        }
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.profileImage?.imageUrl,
        };
      },
    }),
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
