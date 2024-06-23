import { relations, sql } from "drizzle-orm";
import { pgTable, integer, serial, timestamp, varchar, boolean } from "drizzle-orm/pg-core";
import { comment } from "@/db/postgresql/schema/comment";
import { user } from "@/db/postgresql/schema/user";
import { save } from "@/db/postgresql/schema/save";
import { likes } from "@/db/postgresql/schema/likes";

export const post = pgTable("post", {
  id: serial("id").primaryKey(),
  isPostDeleted: boolean("is_post_deleted").notNull().default(false),
  userId: integer("user_id")
    .notNull()
    .references(() => user.id),
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

export const postsRelations = relations(post, ({ one, many }) => ({
  user: one(user, { fields: [post.userId], references: [user.id] }),
  likes: many(likes),
  comment: many(comment),
  save: many(save),
}));
