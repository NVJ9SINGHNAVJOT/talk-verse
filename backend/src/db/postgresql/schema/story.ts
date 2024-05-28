import { relations } from "drizzle-orm";
import { integer, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { user } from "@/db/postgresql/schema/user";

export const story = pgTable("story", {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
        .notNull()
        .references(() => user.id),
    storyUrl: varchar("story_url").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const storysRelations = relations(story, ({ one }) => ({
    user: one(user, { fields: [story.userId], references: [user.id] }),
}));