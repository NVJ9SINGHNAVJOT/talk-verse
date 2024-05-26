import { relations } from "drizzle-orm";
import { pgTable, integer, serial, timestamp } from "drizzle-orm/pg-core";
import { post } from "@/db/postgresql/schema/post";
import { user } from "@/db/postgresql/schema/user";

export const save = pgTable("save", {
    id: serial("id").primaryKey(),
    postId: integer("post_id").references(() => post.id),
    userId: integer("user_id").references(() => user.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const commentsRelations = relations(save, ({ one }) => ({
    post: one(post, { fields: [save.postId], references: [post.id] }),
    user: one(user, { fields: [save.userId], references: [user.id] }),
}));