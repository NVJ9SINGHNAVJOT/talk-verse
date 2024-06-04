import type { Config } from "drizzle-kit";
import 'dotenv/config';
import { configDotenv } from "dotenv";
configDotenv();

export default {
    schema: "./src/db/postgresql/schema/*",
    out: "./src/db/postgresql/migrations",
    driver: 'pg',
    dbCredentials: {
        host: `${process.env['POSTGRES_HOST']}`,
        user: `${process.env['POSTGRES_USER']}`,
        password: `${process.env['POSTGRES_PASSWORD']}`,
        database: `${process.env['POSTGRES_DB']}`,
    },
    verbose: true,
    strict: true,
} satisfies Config;