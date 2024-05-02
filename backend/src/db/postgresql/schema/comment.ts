import { relations } from "drizzle-orm";
import { pgTable, integer, text, serial, timestamp } from "drizzle-orm/pg-core";
import { post } from "@/db/postgresql/schema/post";
import { user } from "@/db/postgresql/schema/user";

export const comment = pgTable("comment", {
    id: serial("id").primaryKey(),
    postId: integer("post_id").references(() => post.id),
    userId: integer("user_id").references(() => user.id),
    text: text("text").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const commentsRelations = relations(comment, ({ one }) => ({
    post: one(post, { fields: [comment.postId], references: [post.id] }),
    user: one(user, { fields: [comment.userId], references: [user.id] }),
}));