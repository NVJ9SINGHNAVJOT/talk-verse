import { relations } from "drizzle-orm";
import { pgTable, integer, serial, timestamp, unique } from "drizzle-orm/pg-core";
import { user } from "@/db/postgresql/schema/user";

export const request = pgTable(
  "request",
  {
    id: serial("id").primaryKey(),
    fromId: integer("from_id")
      .notNull()
      .references(() => user.id),
    toId: integer("to_id")
      .notNull()
      .references(() => user.id),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (request) => ({
    requestFromIdToIdUnique: unique("request_from_id_to_id_unique").on(request.fromId, request.toId),
  })
);

export const requestsRelations = relations(request, ({ one }) => ({
  from: one(user, { fields: [request.fromId], references: [user.id] }),
  to: one(user, { fields: [request.toId], references: [user.id] }),
}));
