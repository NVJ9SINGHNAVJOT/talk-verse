import type { Config } from "drizzle-kit";
import 'dotenv/config';
import { configDotenv } from "dotenv";
configDotenv();

export default {
    schema: "./src/db/postgresql/schema/*",
    out: "./src/db/postgresql/migrations",
    driver: 'pg',
    dbCredentials: {
        host: process.env["POSTGRESQL_HOST"] as string,
        port: parseInt(process.env["POSTGRESQL_PORT"] as string),
        user: process.env["POSTGRESQL_USER"] as string,
        password: process.env["POSTGRESQL_PASSWORD"] as string,
        database: process.env["POSTGRESQL_DATABASE_NAME"] as string,
    },
    verbose: true,
    strict: true,
} satisfies Config;