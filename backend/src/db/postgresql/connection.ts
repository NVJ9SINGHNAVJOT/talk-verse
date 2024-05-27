import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { logger } from "@/logger/logger";
import * as user from "@/db/postgresql/schema/user";
import * as post from "@/db/postgresql/schema/post";
import * as comment from "@/db/postgresql/schema/comment";
import * as follow from "@/db/postgresql/schema/follow";
import * as likes from "@/db/postgresql/schema/likes";
import * as save from "@/db/postgresql/schema/save";
import * as story from "@/db/postgresql/schema/story";

if (
    !process.env.POSTGRESQL_HOST ||
    !process.env.POSTGRESQL_PORT ||
    !process.env.POSTGRESQL_USER ||
    !process.env.POSTGRESQL_PASSWORD ||
    !process.env.POSTGRESQL_DATABASE_NAME) {
    logger.info("postgresql connection failed");
}
const pool = new Pool({
    host: process.env.POSTGRESQL_HOST,
    port: parseInt(process.env.POSTGRESQL_PORT as string),
    user: process.env.POSTGRESQL_USER,
    password: process.env.POSTGRESQL_PASSWORD,
    database: process.env.POSTGRESQL_DATABASE_NAME,
});

logger.info("postgresql database connected");

export const db = drizzle(pool, { schema: { ...user, ...post, ...likes, ...follow, ...story, ...save, ...comment } });