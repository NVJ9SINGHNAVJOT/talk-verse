import { sql } from "drizzle-orm";
import { NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
import { logger } from "@/logger/logger";
import { pool } from "@/db/postgresql/connection";

const tables = ["user", "story", "save", "post", "likes", "follow", "comment", "request", "query", "review"];

// Function to create the trigger function
export async function setupPostgreSQLTriggers() {
  try {
    const db: NodePgDatabase = drizzle(pool);

    logger.info("setting up triggers...");
    // Create the function to update the updatedAt column if it doesn't exist
    await db.execute(
      sql.raw(`
            CREATE OR REPLACE FUNCTION update_updated_at_column()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = NOW();
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `)
    );

    // Loop through each table and create a trigger
    for (const table of tables) {
      await db.execute(
        sql.raw(`
                CREATE OR REPLACE TRIGGER update_${table}_updated_at
                BEFORE UPDATE ON "${table}"
                FOR EACH ROW
                EXECUTE FUNCTION update_updated_at_column();
            `)
      );
    }

    logger.info("triggers setup complete, exiting...");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logger.error("triggers failed for postgresql", { error: error.message });
    await pool.end();
    process.exit();
  }
}
