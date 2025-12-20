import { configDotenv } from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { logger } from "@/logger/logger";
import { users, usersRelations } from "@/db/postgresql/schema/users";
import { posts, postsRelations } from "@/db/postgresql/schema/posts";
import { likes, likesRelations } from "@/db/postgresql/schema/likes";
import { comments, commentsRelations } from "@/db/postgresql/schema/comments";
import { stories, storiesRelations } from "@/db/postgresql/schema/stories";
import { follows, followsRelations } from "@/db/postgresql/schema/follows";
import { saves, savesRelations } from "@/db/postgresql/schema/saves";
import { requests, requestsRelations } from "@/db/postgresql/schema/requests";
import { queries } from "@/db/postgresql/schema/queries";
import { reviews, reviewsRelations } from "@/db/postgresql/schema/reviews";
import { getErrorDetails } from "@/logger/error";

configDotenv();

export const pool = new Pool({
  host: `${process.env["POSTGRES_HOST"]}`,
  user: `${process.env["POSTGRES_USER"]}`,
  database: `${process.env["POSTGRES_DB"]}`,
  password: `${process.env["POSTGRES_PASSWORD"]}`,
  /* INFO: only use for live connections */
  // ssl: { rejectUnauthorized: false },
});

export async function postgresqlDatabaseConnect() {
  try {
    await pool.connect();
    logger.info("postgresql database connected");
  } catch (error) {
    logger.error("error while connecting postgresql database", { error: getErrorDetails(error) });
    await pool.end();
    process.exit();
  }
}

export async function postgresqlDatabaseDisconnect() {
  await pool.end();
  logger.info("postgresql database disconnected");
}

export const db = drizzle(pool, {
  schema: {
    users,
    usersRelations,
    posts,
    postsRelations,
    likes,
    likesRelations,
    stories,
    storiesRelations,
    comments,
    commentsRelations,
    follows,
    followsRelations,
    saves,
    savesRelations,
    requests,
    requestsRelations,
    queries,
    reviews,
    reviewsRelations,
  },
});
