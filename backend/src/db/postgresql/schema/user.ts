
import { relations } from "drizzle-orm";
import { pgTable, serial, timestamp, text } from "drizzle-orm/pg-core";
import { post } from "@/db/postgresql/schema/post";

export const user = pgTable("user", {
    // reference from mongodb
    refId: text("ref_id").notNull(),
    userName: text("user_name").notNull(),
    imageUrl: text("image_url"),

    id: serial("id").primaryKey(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const usersRelations = relations(user, ({ many }) => ({
    post: many(post),
}));