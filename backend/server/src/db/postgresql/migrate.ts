import { migrate } from "drizzle-orm/node-postgres/migrator";
import { NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
import { logger } from "@/logger/logger";
import { pool } from "@/db/postgresql/connection";
import { getErrorDetails } from "@/logger/error";

export async function migratePostgreSQL() {
  try {
    const db: NodePgDatabase = drizzle(pool);

    logger.info("Running migrations...");
    await migrate(db, { migrationsFolder: "src/db/postgresql/migrations" });

    logger.info("All migrations have been done, exiting...");
  } catch (error) {
    logger.error("error while postgresql migration", { error: getErrorDetails(error) });
    await pool.end();
    process.exit();
  }
}
