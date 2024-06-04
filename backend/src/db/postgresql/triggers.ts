import { sql } from 'drizzle-orm';
import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
import { configDotenv } from "dotenv";
import { Pool } from 'pg';
import { logger, loggerConfig } from '@/logger/logger';
configDotenv();
loggerConfig(process.env['ENVIRONMENT'] as string);

const tables = ["user", "story", "save", "post", "likes", "follow", "comment"];

// Function to create the trigger function 
export async function setupPostgreSQLTriggers() {
    try {
        const pool = new Pool({
            host: `${process.env['POSTGRES_HOST']}`,
            user: `${process.env['POSTGRES_USER']}`,
            password: `${process.env['POSTGRES_PASSWORD']}`,
            database: `${process.env['POSTGRES_DB']}`,
        });
        const db: NodePgDatabase = drizzle(pool);

        logger.info('setting up triggers...');
        // Create the function to update the updatedAt column if it doesn't exist
        await db.execute(sql.raw(`
            CREATE OR REPLACE FUNCTION update_updated_at_column()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = NOW();
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `));

        // Loop through each table and create a trigger
        for (const table of tables) {
            await db.execute(sql.raw(`
                CREATE OR REPLACE TRIGGER update_${table}_updated_at
                BEFORE UPDATE ON "${table}"
                FOR EACH ROW
                EXECUTE FUNCTION update_updated_at_column();
            `));
        }

        logger.info('triggers setup complete, exiting...');
        await pool.end();

    } catch (error) {
        logger.error('triggers failed for postgresql', { error: error });
    }
}