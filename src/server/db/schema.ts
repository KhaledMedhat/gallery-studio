import { createId } from "@paralleldrive/cuid2";
import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTableCreator,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
  json,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `gallery-studio_${name}`);

export const otp = createTable("otp", {
  otp: varchar("otp", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
export const files = createTable("image", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  url: varchar("url", { length: 255 }).notNull(),
  createdById: varchar("created_by", { length: 255 })
    .notNull()
    .references(() => users.id),
  caption: varchar("caption", { length: 255 }),
  tags: json("tags").$type<string[]>().default([]),
  fileKey: varchar("image_key", { length: 255 }),
  fileType: varchar("file_type", { length: 255 }),
  galleryId: integer("gallery_id")
    .notNull()
    .references(() => galleries.id),
  albumId: integer("album_id").references(() => albums.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const galleries = createTable("gallery", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 })
    .notNull()
    .$defaultFn(() => createId()),
  createdById: varchar("created_by", { length: 255 })
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const albums = createTable("album", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  galleryId: integer("gallery_id")
    .notNull()
    .references(() => galleries.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const users = createTable("user", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  bio: varchar("bio", { length: 255 }).default(""),
  password: varchar("password", { length: 255 }),
  provider: varchar("provider", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: timestamp("email_verified", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }).default(""),
  createdAt: timestamp("created_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const accounts = createTable(
  "account",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_user_id_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("session_token", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_user_id_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

export const usersRelations = relations(users, ({ many, one }) => ({
  accounts: many(accounts),
  gallery: one(galleries, {
    fields: [users.id],
    references: [galleries.createdById],
  }),
}));

export const galleriesRelations = relations(galleries, ({ one, many }) => ({
  user: one(users, { fields: [galleries.createdById], references: [users.id] }),
  albums: many(albums),
  images: many(files),
}));

export const albumsRelations = relations(albums, ({ one, many }) => ({
  gallery: one(galleries, {
    fields: [albums.galleryId],
    references: [galleries.id],
  }),
  images: many(files),
}));

export const filesRelations = relations(files, ({ one }) => ({
  gallery: one(galleries, {
    fields: [files.galleryId],
    references: [galleries.id],
  }),
  album: one(albums, { fields: [files.albumId], references: [albums.id] }),
}));
