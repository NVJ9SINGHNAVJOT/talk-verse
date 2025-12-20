import { relations } from "drizzle-orm";
import { pgTable, integer, serial, timestamp, unique } from "drizzle-orm/pg-core";
import { posts } from "@/db/postgresql/schema/posts";
import { users } from "@/db/postgresql/schema/users";

export const likes = pgTable(
  "likes",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    postId: integer("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (likes) => ({
    likesUserIdPostIdUnique: unique("likes_user_id_post_id_unique").on(likes.userId, likes.postId),
  })
);

export const likesRelations = relations(likes, ({ one }) => ({
  user: one(users, { fields: [likes.userId], references: [users.id] }),
  post: one(posts, { fields: [likes.postId], references: [posts.id] }),
}));
