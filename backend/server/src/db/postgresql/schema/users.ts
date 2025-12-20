import { relations } from "drizzle-orm";
import { char, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { integer } from "drizzle-orm/pg-core";
import { posts } from "@/db/postgresql/schema/posts";
import { stories } from "@/db/postgresql/schema/stories";
import { comments } from "@/db/postgresql/schema/comments";
import { follows } from "@/db/postgresql/schema/follows";
import { likes } from "@/db/postgresql/schema/likes";
import { saves } from "@/db/postgresql/schema/saves";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),

  // reference from mongodb
  refId: char("ref_id", { length: 24 }).notNull().unique(),
  firstName: varchar("first_name", { length: 15 }).notNull(),
  lastName: varchar("last_name", { length: 15 }).notNull(),
  userName: varchar("user_name", { length: 15 }).notNull().unique(),
  imageUrl: varchar("image_url", { length: 255 }),

  followingCount: integer("following_count").notNull().default(0),
  followersCount: integer("followers_count").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  post: many(posts),
  story: many(stories),
  comment: many(comments),
  follow: many(follows),
  likes: many(likes),
  save: many(saves),
}));
