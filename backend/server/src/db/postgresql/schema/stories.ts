import { relations } from "drizzle-orm";
import { integer, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { users } from "@/db/postgresql/schema/users";

export const stories = pgTable("stories", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  storyUrl: varchar("story_url", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const storiesRelations = relations(stories, ({ one }) => ({
  user: one(users, { fields: [stories.userId], references: [users.id] }),
}));
