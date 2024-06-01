import { relations } from "drizzle-orm";
import { pgTable, integer, serial, timestamp, unique } from "drizzle-orm/pg-core";
import { post } from "@/db/postgresql/schema/post";
import { user } from "@/db/postgresql/schema/user";

export const save = pgTable("save", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull().references(() => user.id),
    postId: integer("post_id").notNull().references(() => post.id),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (save) => ({
    saveUserIdPostIdUnique: unique("save_user_id_post_id_unique").on(save.userId, save.postId)
}));

export const savessRelations = relations(save, ({ one }) => ({
    user: one(user, { fields: [save.userId], references: [user.id] }),
    post: one(post, { fields: [save.postId], references: [post.id] }),
}));