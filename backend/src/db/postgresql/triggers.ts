import { sql } from 'drizzle-orm';
import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
import { configDotenv } from "dotenv";
import { Pool } from 'pg';
configDotenv();

const tables = ["user", "story", "save", "post", "likes", "follow", "comment"];

// Function to create the trigger function 
async function setupPostgreSQLTriggers() {
    try {
        const pool = new Pool({
            host: process.env.POSTGRESQL_HOST,
            port: parseInt(process.env.POSTGRESQL_PORT as string),
            user: process.env.POSTGRESQL_USER,
            password: process.env.POSTGRESQL_PASSWORD,
            database: process.env.POSTGRESQL_DATABASE_NAME,
        });
        const db: NodePgDatabase = drizzle(pool);

        console.log('setting up triggers...');
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

        console.log('triggers setup complete, exiting...');
        await pool.end();

    } catch (error) {
        console.log('triggers failed for postgresql', error);
    }
}

setupPostgreSQLTriggers();