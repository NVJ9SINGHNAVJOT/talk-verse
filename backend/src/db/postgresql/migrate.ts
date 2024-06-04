import { Pool } from 'pg';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
import { configDotenv } from "dotenv";
import { logger, loggerConfig } from '@/logger/logger';
configDotenv();
loggerConfig(`${process.env['ENVIRONMENT']}`);

export async function migratePostgreSQL() {
    try {
        const pool = new Pool({
            host: `${process.env['POSTGRES_HOST']}`,
            user: `${process.env['POSTGRES_USER']}`,
            password: `${process.env['POSTGRES_PASSWORD']}`,
            database: `${process.env['POSTGRES_DB']}`,
        });
        const db: NodePgDatabase = drizzle(pool);

        logger.info('Running migrations...');
        await migrate(db, { migrationsFolder: 'src/db/postgresql/migrations' });

        await pool.end();
        logger.info('All migrations have been done, exiting...');

    } catch (error) {
        logger.error('error while postgresql migration', { error: error });
    }
}