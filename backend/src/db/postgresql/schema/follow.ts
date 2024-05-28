import { relations } from "drizzle-orm";
import { pgTable, integer, serial, timestamp } from "drizzle-orm/pg-core";
import { user } from "@/db/postgresql/schema/user";

export const follow = pgTable("follow", {
    id: serial("id").primaryKey(),
    followerId: integer("follower_id")
        .notNull()
        .references(() => user.id),
    followingId: integer("following_id")
        .notNull()
        .references(() => user.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const followsRelations = relations(follow, ({ one }) => ({
    user: one(user, { fields: [follow.followerId, follow.followingId], references: [user.id, user.id] }),
}));