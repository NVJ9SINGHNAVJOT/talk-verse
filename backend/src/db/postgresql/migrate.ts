import { Pool } from 'pg';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
import { configDotenv } from "dotenv";
import { logger, loggerConfig } from '@/logger/logger';
configDotenv();
loggerConfig(process.env.ENVIRONMENT as string);

async function migratePostgreSQL() {
    try {
        const pool = new Pool({
            host: process.env.POSTGRESQL_HOST,
            port: parseInt(process.env.POSTGRESQL_PORT as string),
            user: process.env.POSTGRESQL_USER,
            password: process.env.POSTGRESQL_PASSWORD,
            database: process.env.POSTGRESQL_DATABASE_NAME,
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

migratePostgreSQL();