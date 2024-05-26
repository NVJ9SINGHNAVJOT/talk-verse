import { relations } from "drizzle-orm";
import { pgTable, integer, serial, timestamp } from "drizzle-orm/pg-core";
import { post } from "@/db/postgresql/schema/post";
import { user } from "@/db/postgresql/schema/user";

export const like = pgTable("like", {
    id: serial("id").primaryKey(),
    postId: integer("post_id").references(() => post.id),
    userId: integer("user_id").references(() => user.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const commentsRelations = relations(like, ({ one }) => ({
    post: one(post, { fields: [like.postId], references: [post.id] }),
    user: one(user, { fields: [like.userId], references: [user.id] }),
}));