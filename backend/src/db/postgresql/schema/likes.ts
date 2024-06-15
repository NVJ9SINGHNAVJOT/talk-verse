import { relations } from "drizzle-orm";
import { pgTable, integer, serial, timestamp, unique } from "drizzle-orm/pg-core";
import { post } from "@/db/postgresql/schema/post";
import { user } from "@/db/postgresql/schema/user";

export const likes = pgTable(
  "likes",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => user.id),
    postId: integer("post_id")
      .notNull()
      .references(() => post.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (likes) => ({
    likesUserIdPostIdUnique: unique("likes_user_id_post_id_unique").on(likes.userId, likes.postId),
  })
);

export const likessRelations = relations(likes, ({ one }) => ({
  user: one(user, { fields: [likes.userId], references: [user.id] }),
  post: one(post, { fields: [likes.postId], references: [post.id] }),
}));
