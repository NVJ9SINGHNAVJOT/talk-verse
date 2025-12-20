import { relations } from "drizzle-orm";
import { pgTable, integer, serial, timestamp, unique } from "drizzle-orm/pg-core";
import { posts } from "@/db/postgresql/schema/posts";
import { users } from "@/db/postgresql/schema/users";

export const saves = pgTable(
  "saves",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    postId: integer("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (save) => ({
    saveUserIdPostIdUnique: unique("save_user_id_post_id_unique").on(save.userId, save.postId),
  })
);

export const savesRelations = relations(saves, ({ one }) => ({
  user: one(users, { fields: [saves.userId], references: [users.id] }),
  post: one(posts, { fields: [saves.postId], references: [posts.id] }),
}));
