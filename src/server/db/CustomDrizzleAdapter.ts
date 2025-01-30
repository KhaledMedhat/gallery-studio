import {
  type Adapter,
  type AdapterUser,
  type AdapterAccount,
  type AdapterSession,
  type VerificationToken,
} from "next-auth/adapters";
import { db } from "~/server/db";
import {
  accounts,
  galleries,
  sessions,
  users,
  verificationTokens,
} from "~/server/db/schema";
import { eq, and } from "drizzle-orm";

export const customDrizzleAdapter: Adapter = {
  async createUser(user: Omit<AdapterUser, "id">): Promise<AdapterUser> {
    const id = crypto.randomUUID();
    const [firstName, lastName] = user.name?.split(" ") ?? ["", ""];
    const username = user.email?.split("@")[0] ?? "";

    await db.insert(users).values({
      id,
      email: user.email ?? "",
      name: username,
      firstName,
      lastName,
      emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
      profileImage: user.image ? { imageUrl: user.image, imageKey: "" } : null,
      createdAt: new Date(),
      updatedAt: new Date(),
      socialUrls: [],
      followers: [],
      followings: [],
      coverImage: null,
    });
    await db.insert(galleries).values({
      createdById: id ?? "",
    });
    return {
      id,
      email: user.email ?? "",
      name: username,
      image: user.image ?? null,
      emailVerified: user.emailVerified ?? null,
    };
  },

  async getUser(id: string): Promise<AdapterUser | null> {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.profileImage?.imageUrl ?? null,
      emailVerified: user.emailVerified,
    };
  },

  async getUserByEmail(email: string): Promise<AdapterUser | null> {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.profileImage?.imageUrl ?? null,
      emailVerified: user.emailVerified,
    };
  },

  async getUserByAccount({
    providerAccountId,
    provider,
  }: {
    providerAccountId: string;
    provider: string;
  }): Promise<AdapterUser | null> {
    const account = await db.query.accounts.findFirst({
      where: and(
        eq(accounts.providerAccountId, providerAccountId),
        eq(accounts.provider, provider),
      ),
    });

    if (!account) return null;

    return this.getUser?.(account.userId) ?? null;
  },

  async updateUser(
    user: Partial<AdapterUser> & { id: string },
  ): Promise<AdapterUser> {
    const updatedUser = await db
      .update(users)
      .set({
        email: user.email ?? undefined,
        name: user.name ?? undefined,
        profileImage: user.image
          ? { imageUrl: user.image, imageKey: "" }
          : undefined,
        emailVerified: user.emailVerified
          ? new Date(user.emailVerified)
          : undefined,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id))
      .returning();

    if (!updatedUser[0]) throw new Error("User not found");

    return {
      id: updatedUser[0].id,
      email: updatedUser[0].email,
      name: updatedUser[0].name,
      image: updatedUser[0].profileImage?.imageUrl ?? null,
      emailVerified: updatedUser[0].emailVerified,
    };
  },

  async deleteUser(userId: string): Promise<void> {
    await db.delete(users).where(eq(users.id, userId));
  },

  async linkAccount(account: AdapterAccount): Promise<void> {
    await db.insert(accounts).values(account);
    await db
      .update(users)
      .set({ provider: account.provider })
      .where(eq(users.id, account.userId));
  },

  async unlinkAccount({
    providerAccountId,
    provider,
  }: {
    providerAccountId: string;
    provider: string;
  }): Promise<void> {
    await db
      .delete(accounts)
      .where(
        and(
          eq(accounts.providerAccountId, providerAccountId),
          eq(accounts.provider, provider),
        ),
      );
  },

  async createSession(session: AdapterSession): Promise<AdapterSession> {
    await db.insert(sessions).values(session);
    return session;
  },

  async getSessionAndUser(
    sessionToken: string,
  ): Promise<{ session: AdapterSession; user: AdapterUser } | null> {
    const session = await db.query.sessions.findFirst({
      where: eq(sessions.sessionToken, sessionToken),
    });

    if (!session) return null;

    const user = await customDrizzleAdapter.getUser?.(session.userId);
    if (!user) return null;

    return {
      session: {
        sessionToken: session.sessionToken,
        userId: session.userId,
        expires: session.expires,
      },
      user,
    };
  },

  async updateSession({
    sessionToken,
    expires,
  }: Partial<AdapterSession> & {
    sessionToken: string;
  }): Promise<AdapterSession | null> {
    const updatedSession = await db
      .update(sessions)
      .set({ expires })
      .where(eq(sessions.sessionToken, sessionToken))
      .returning();

    return updatedSession[0] ?? null;
  },

  async deleteSession(sessionToken: string): Promise<void> {
    await db.delete(sessions).where(eq(sessions.sessionToken, sessionToken));
  },

  async createVerificationToken(
    verificationToken: VerificationToken,
  ): Promise<VerificationToken> {
    await db.insert(verificationTokens).values(verificationToken);
    return verificationToken;
  },

  async useVerificationToken({
    identifier,
    token,
  }: {
    identifier: string;
    token: string;
  }): Promise<VerificationToken | null> {
    const verificationToken = await db.query.verificationTokens.findFirst({
      where: and(
        eq(verificationTokens.identifier, identifier),
        eq(verificationTokens.token, token),
      ),
    });

    if (!verificationToken) return null;

    await db
      .delete(verificationTokens)
      .where(
        and(
          eq(verificationTokens.identifier, identifier),
          eq(verificationTokens.token, token),
        ),
      );

    return verificationToken;
  },
};
