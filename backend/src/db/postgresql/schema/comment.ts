import { relations } from "drizzle-orm";
import { pgTable, integer, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { post } from "@/db/postgresql/schema/post";
import { user } from "@/db/postgresql/schema/user";

export const comment = pgTable("comment", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => user.id),
    postId: integer("post_id").references(() => post.id),
    text: varchar("text").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const commentsRelations = relations(comment, ({ one }) => ({
    user: one(user, { fields: [comment.userId], references: [user.id] }),
    post: one(post, { fields: [comment.postId], references: [post.id] }),
}));