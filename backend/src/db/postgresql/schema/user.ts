import { relations } from "drizzle-orm";
import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { integer } from "drizzle-orm/pg-core";
import { post } from "@/db/postgresql/schema/post";
import { story } from "@/db/postgresql/schema/story";
import { comment } from "@/db/postgresql/schema/comment";
import { follow } from "@/db/postgresql/schema/follow";
import { likes } from "@/db/postgresql/schema/likes";
import { save } from "@/db/postgresql/schema/save";

export const user = pgTable("user", {
    id: serial("id").primaryKey(),

    // reference from mongodb
    refId: varchar("ref_id").notNull(),
    userName: varchar("user_name").notNull(),
    imageUrl: varchar("image_url"),

    followingCount: integer("following_count").notNull().default(0),
    followersCount: integer("followers_count").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const usersRelations = relations(user, ({ many }) => ({
    post: many(post),
    story: many(story),
    comment: many(comment),
    follow: many(follow),
    likes: many(likes),
    save: many(save)
}));