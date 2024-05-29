import { Pool } from 'pg';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
import { configDotenv } from "dotenv";
configDotenv();

async function migratePostgreSQL() {
    try {
        const pool = new Pool({
            host: process.env['POSTGRESQL_HOST'],
            port: parseInt(process.env['POSTGRESQL_PORT'] as string),
            user: process.env['POSTGRESQL_USER'],
            password: process.env['POSTGRESQL_PASSWORD'],
            database: process.env['POSTGRESQL_DATABASE_NAME'],
        });
        const db: NodePgDatabase = drizzle(pool);

        console.log('Running migrations...');
        await migrate(db, { migrationsFolder: 'src/db/postgresql/migrations' });

        console.log('All migrations have been done, exiting...');
        await pool.end();

    } catch (error) {
        console.log('error while postgresql migration', error);
    }
}

migratePostgreSQL();