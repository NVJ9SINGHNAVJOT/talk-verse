import { relations } from "drizzle-orm";
import { pgTable, integer, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { comment } from "@/db/postgresql/schema/comment";
import { user } from "@/db/postgresql/schema/user";
import { save } from "@/db/postgresql/schema/save";
import { likes } from "@/db/postgresql/schema/likes";

export const post = pgTable("post", {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
        .notNull()
        .references(() => user.id),
    mediaUrls: varchar("media_urls").notNull().array(),
    category: varchar("category", {
        enum: ["Technology",
            "Lifestyle",
            "Blog",
            "Nature",
            "Music",
            "Sports",
            "Health",
            "Finance",
            "Art",
            "History",
            "Literature",
            "Science",
            "Business",
            "Other",]
    }).notNull(),
    tags: varchar("tags").array(),
    content: varchar("content").array(),
    likesCount: integer("likes_count").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const postsRelations = relations(post, ({ one, many }) => ({
    user: one(user, { fields: [post.userId], references: [user.id] }),
    likes: many(likes),
    comment: many(comment),
    save: many(save)
}));