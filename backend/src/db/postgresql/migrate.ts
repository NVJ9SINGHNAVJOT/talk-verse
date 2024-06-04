import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
import { logger, } from '@/logger/logger';
import { pool } from '@/db/postgresql/connection';

export async function migratePostgreSQL() {
    try {
        const pool = new Pool({
            host: `${process.env['POSTGRES_HOST']}`,
            user: `${process.env['POSTGRES_USER']}`,
            database: `${process.env['POSTGRES_DB']}`,
            password: `${process.env['POSTGRES_PASSWORD']}`,
        });
        const db: NodePgDatabase = drizzle(pool);

        logger.info('Running migrations...');
        await migrate(db, { migrationsFolder: 'src/db/postgresql/migrations' });

        logger.info('All migrations have been done, exiting...');
    } catch (error) {
        logger.error('error while postgresql migration', { error: error });
        await pool.end();
        process.exit();
    }
}
