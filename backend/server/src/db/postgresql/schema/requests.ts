import { relations } from "drizzle-orm";
import { pgTable, integer, serial, timestamp, unique } from "drizzle-orm/pg-core";
import { users } from "@/db/postgresql/schema/users";

export const requests = pgTable(
  "requests",
  {
    id: serial("id").primaryKey(),
    fromId: integer("from_id")
      .notNull()
      .references(() => users.id),
    toId: integer("to_id")
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (request) => ({
    requestFromIdToIdUnique: unique("request_from_id_to_id_unique").on(request.fromId, request.toId),
  })
);

export const requestsRelations = relations(requests, ({ one }) => ({
  from: one(users, { fields: [requests.fromId], references: [users.id] }),
  to: one(users, { fields: [requests.toId], references: [users.id] }),
}));
