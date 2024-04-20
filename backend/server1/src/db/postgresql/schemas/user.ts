
import { relations } from "drizzle-orm";
import { pgTable, integer, serial, timestamp, text } from "drizzle-orm/pg-core";
import { post } from "@/db/postgresql/schemas/post";

export const user = pgTable("user", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    number: integer("number"),
    imageUrl: text("image_url"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const usersRelations = relations(user, ({ many }) => ({
    post: many(post),
}));