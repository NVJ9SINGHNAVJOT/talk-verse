import { pgTable, serial, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { user } from "@/db/postgresql/schema/user";
import { relations } from "drizzle-orm";

export const review = pgTable("review", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => user.id),
  reviewText: varchar("review_text", { length: 150 }).notNull(),
  approved: boolean("approved").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const reviewsRelations = relations(review, ({ one }) => ({
  user: one(user, { fields: [review.userId], references: [user.id] }),
}));
