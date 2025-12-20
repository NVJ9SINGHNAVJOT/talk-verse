import { relations } from "drizzle-orm";
import { pgTable, integer, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { posts } from "@/db/postgresql/schema/posts";
import { users } from "@/db/postgresql/schema/users";

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  postId: integer("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  commentText: varchar("comment_text", { length: 200 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const commentsRelations = relations(comments, ({ one }) => ({
  user: one(users, { fields: [comments.userId], references: [users.id] }),
  post: one(posts, { fields: [comments.postId], references: [posts.id] }),
}));
