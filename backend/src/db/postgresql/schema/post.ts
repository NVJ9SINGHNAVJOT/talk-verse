import { relations } from "drizzle-orm";
import { pgTable, integer, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { comment } from "@/db/postgresql/schema/comment";
import { user } from "@/db/postgresql/schema/user";

export const post = pgTable("post", {
    id: serial("id").primaryKey(),
    mediaUrls: varchar("media_urls").notNull().array(),
    title: varchar("title"),
    tags: varchar("tags").array(),
    content: varchar("content").array(),
    likes: integer("likes").notNull().default(0),
    userId: integer("user_id")
        .notNull()
        .references(() => user.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const postsRelations = relations(post, ({ one, many }) => ({
    user: one(user, { fields: [post.userId], references: [user.id] }),
    comment: many(comment),
}));