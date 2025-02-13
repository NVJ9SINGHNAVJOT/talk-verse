import { configDotenv } from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { logger } from "@/logger/logger";
import { user, usersRelations } from "@/db/postgresql/schema/user";
import { post, postsRelations } from "@/db/postgresql/schema/post";
import { likes, likessRelations } from "@/db/postgresql/schema/likes";
import { comment, commentsRelations } from "@/db/postgresql/schema/comment";
import { story, storysRelations } from "@/db/postgresql/schema/story";
import { follow, followsRelations } from "@/db/postgresql/schema/follow";
import { save, savesRelations } from "@/db/postgresql/schema/save";
import { request, requestsRelations } from "@/db/postgresql/schema/request";
import { query } from "@/db/postgresql/schema/query";
import { review, reviewsRelations } from "@/db/postgresql/schema/review";
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
    user,
    usersRelations,
    post,
    postsRelations,
    likes,
    likessRelations,
    story,
    storysRelations,
    comment,
    commentsRelations,
    follow,
    followsRelations,
    save,
    savesRelations,
    request,
    requestsRelations,
    query,
    review,
    reviewsRelations,
  },
});
