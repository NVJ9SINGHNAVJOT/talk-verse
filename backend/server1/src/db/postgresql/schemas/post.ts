import { relations } from "drizzle-orm";
import { pgTable, integer, serial, timestamp, text } from "drizzle-orm/pg-core";
import { comment } from "@/db/postgresql/schemas/comment";
import { user } from "@/db/postgresql/schemas/user";

export const post = pgTable("post", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    content: text("content").notNull(),
    userId: integer("user_id")
        .notNull()
        .references(() => user.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});


export const postsRelations = relations(post, ({ one, many }) => ({
    use: one(user, { fields: [post.userId], references: [user.id] }),
    comment: many(comment),
}));