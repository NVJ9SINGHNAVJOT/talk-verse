import { relations } from "drizzle-orm";
import { pgTable, integer, serial, timestamp, unique } from "drizzle-orm/pg-core";
import { user } from "@/db/postgresql/schema/user";

export const follow = pgTable("follow", {
    id: serial("id").primaryKey(),
    followerId: integer("follower_id")
        .notNull()
        .references(() => user.id),
    followingId: integer("following_id")
        .notNull()
        .references(() => user.id),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (follow) => ({
    followFollowerIdFollowingIdUnique: unique("follow_follower_id_following_id_unique").on(follow.followerId, follow.followingId)
}));

export const followsRelations = relations(follow, ({ one }) => ({
    follower: one(user, { fields: [follow.followerId], references: [user.id] }),
    following: one(user, { fields: [follow.followingId], references: [user.id] })
}));