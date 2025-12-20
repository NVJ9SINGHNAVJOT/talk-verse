import { pgTable, serial, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { users } from "@/db/postgresql/schema/users";
import { relations } from "drizzle-orm";

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  reviewText: varchar("review_text", { length: 150 }).notNull(),
  approved: boolean("approved").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(users, { fields: [reviews.userId], references: [users.id] }),
}));
