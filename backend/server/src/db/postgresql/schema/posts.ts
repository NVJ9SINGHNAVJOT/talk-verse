import { relations, sql } from "drizzle-orm";
import { pgTable, integer, serial, timestamp, varchar, boolean } from "drizzle-orm/pg-core";
import { comments } from "@/db/postgresql/schema/comments";
import { users } from "@/db/postgresql/schema/users";
import { saves } from "@/db/postgresql/schema/saves";
import { likes } from "@/db/postgresql/schema/likes";

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  isPostDeleted: boolean("is_post_deleted").notNull().default(false),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  category: varchar("category", { length: 255 }).notNull(),
  title: varchar("title", { length: 100 }),
  mediaUrls: varchar("media_urls", { length: 255 })
    .array()
    .notNull()
    .default(sql`ARRAY[]::varchar[]`),
  tags: varchar("tags", { length: 255 })
    .array()
    .notNull()
    .default(sql`ARRAY[]::varchar[]`),
  content: varchar("content")
    .array()
    .notNull()
    .default(sql`ARRAY[]::varchar[]`),
  likesCount: integer("likes_count").notNull().default(0),
  commentsCount: integer("comments_count").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const postsRelations = relations(posts, ({ one, many }) => ({
  user: one(users, { fields: [posts.userId], references: [users.id] }),
  likes: many(likes),
  comment: many(comments),
  save: many(saves),
}));
