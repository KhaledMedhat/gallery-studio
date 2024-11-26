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
  pgEnum,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */

export const privacyEnum = pgEnum("privacy", ["private", "public"]);

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
  filePrivacy: privacyEnum("privacy").default("private"),
  likes: integer("file_likes").notNull().default(0),
  comments: integer("file_comments").notNull().default(0),
  likesInfo: json("likes_info")
    .$type<{ liked: boolean; userId: string }[]>()
    .default([]),
  galleryId: integer("gallery_id")
    .notNull()
    .references(() => galleries.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const comments = createTable("comments", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  fileId: varchar("file_id", { length: 255 })
    .notNull()
    .references(() => files.id), // Link to the file
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id), // Link to the user who commented
  content: text("content").notNull(), // Comment text
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const albumFiles = createTable(
  "album_files",
  {
    albumId: integer("album_id")
      .notNull()
      .references(() => albums.id, { onDelete: "cascade" }),
    fileId: varchar("file_id", { length: 255 })
      .notNull()
      .references(() => files.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    compoundKey: primaryKey(table.albumId, table.fileId), // Composite primary key
  }),
);
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
  name: varchar("name", { length: 255 }).notNull().unique(),
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
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  name: varchar("name", { length: 255 }).notNull().unique(),
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

export const feedbacks = createTable("feedback", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id),
  feedback: text("feedback").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
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
  feedbacks: many(feedbacks),
  accounts: many(accounts),
  comments: many(comments),
  gallery: one(galleries, {
    fields: [users.id],
    references: [galleries.createdById],
  }),
}));

export const feedbacksRelations = relations(feedbacks, ({ one }) => ({
  user: one(users, { fields: [feedbacks.userId], references: [users.id] }),
}));
export const galleriesRelations = relations(galleries, ({ one, many }) => ({
  user: one(users, { fields: [galleries.createdById], references: [users.id] }),
  albums: many(albums),
  images: many(files),
}));

export const filesRelations = relations(files, ({ one, many }) => ({
  user: one(users, { fields: [files.createdById], references: [users.id] }),
  gallery: many(galleries), // Direct relation to gallery
  albumFiles: many(albumFiles), // Link to the join table albumFiles
  commentsInfo: many(comments),
}));

export const albumsRelations = relations(albums, ({ many }) => ({
  gallery: many(galleries), // Direct relation to gallery
  albumFiles: many(albumFiles), // Link to the join table albumFiles
}));

export const albumFilesRelations = relations(albumFiles, ({ one }) => ({
  file: one(files), // Direct relation to files
  album: one(albums), // Direct relation to albums
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  file: one(files, { fields: [comments.fileId], references: [files.id] }),
  user: one(users, { fields: [comments.userId], references: [users.id] }),
}));
