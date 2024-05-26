import { relations } from "drizzle-orm";
import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { post } from "@/db/postgresql/schema/post";
import { integer } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
    // reference from mongodb
    refId: varchar("ref_id").notNull(),
    userName: varchar("user_name").notNull(),
    imageUrl: varchar("image_url"),

    id: serial("id").primaryKey(),
    followingCount: integer("following_count").notNull().default(0),
    followersCount: integer("followers_count").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const usersRelations = relations(user, ({ many }) => ({
    post: many(post),
}));