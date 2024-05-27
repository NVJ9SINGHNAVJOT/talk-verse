import { relations } from "drizzle-orm";
import { pgTable, integer, serial, timestamp } from "drizzle-orm/pg-core";
import { post } from "@/db/postgresql/schema/post";
import { user } from "@/db/postgresql/schema/user";

export const likes = pgTable("likes", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => user.id),
    postId: integer("post_id").references(() => post.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const commentsRelations = relations(likes, ({ one }) => ({
    user: one(user, { fields: [likes.userId], references: [user.id] }),
    post: one(post, { fields: [likes.postId], references: [post.id] }),
}));