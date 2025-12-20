import { relations } from "drizzle-orm";
import { pgTable, integer, serial, timestamp, unique } from "drizzle-orm/pg-core";
import { users } from "@/db/postgresql/schema/users";

export const follows = pgTable(
  "follows",
  {
    id: serial("id").primaryKey(),
    followerId: integer("follower_id")
      .notNull()
      .references(() => users.id),
    followingId: integer("following_id")
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (follow) => ({
    followFollowerIdFollowingIdUnique: unique("follow_follower_id_following_id_unique").on(
      follow.followerId,
      follow.followingId
    ),
  })
);

export const followsRelations = relations(follows, ({ one }) => ({
  follower: one(users, { fields: [follows.followerId], references: [users.id] }),
  following: one(users, { fields: [follows.followingId], references: [users.id] }),
}));
