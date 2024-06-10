import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const query = pgTable("query", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name").notNull(),
  emailId: varchar("email_id").notNull(),
  queryText: varchar("query_text").array().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
