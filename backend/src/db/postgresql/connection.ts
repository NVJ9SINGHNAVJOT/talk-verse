import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { logger } from "@/logger/logger";
import { user, usersRelations } from "@/db/postgresql/schema/user";
import { post, postsRelations } from "@/db/postgresql/schema/post";
import { likes, likessRelations } from "@/db/postgresql/schema/likes";
import { comment, commentsRelations } from "@/db/postgresql/schema/comment";
import { story, storysRelations } from "@/db/postgresql/schema/story";
import { follow, followsRelations } from "@/db/postgresql/schema/follow";
import { save, savessRelations } from "@/db/postgresql/schema/save";
import { configDotenv } from "dotenv";

configDotenv();

const pool = new Pool({
    host: process.env.POSTGRESQL_HOST,
    port: parseInt(process.env.POSTGRESQL_PORT),
    user: process.env.POSTGRESQL_USER,
    password: process.env.POSTGRESQL_PASSWORD,
    database: process.env.POSTGRESQL_DATABASE_NAME,
});

export async function postgresqlDatabaseConnect() {
    try {
        await pool.connect();
        logger.info("postgresql database connected");
    } catch (error) {
        logger.error('error while connecting postgresql database', { error: error });
        await pool.end();
        process.exit();
    }
}

export const db = drizzle(pool, {
    schema: {
        user, usersRelations,
        post, postsRelations,
        likes, likessRelations,
        story, storysRelations,
        comment, commentsRelations,
        follow, followsRelations,
        save, savessRelations
    }
});
