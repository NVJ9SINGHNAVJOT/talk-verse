import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { configDotenv } from "dotenv";
import * as schema from "@/db/postgresql/schema";
configDotenv();

if (
    !process.env.POSTGRESQL_HOST ||
    !process.env.POSTGRESQL_PORT ||
    !process.env.POSTGRESQL_USER ||
    !process.env.POSTGRESQL_PASSWORD ||
    !process.env.POSTGRESQL_DATABASE_NAME) {
    console.log("postgresql connection failed");
}
const pool = new Pool({
    host: process.env.POSTGRESQL_HOST,
    port: parseInt(process.env.POSTGRESQL_PORT as string),
    user: process.env.POSTGRESQL_USER,
    password: process.env.POSTGRESQL_PASSWORD,
    database: process.env.POSTGRESQL_DATABASE_NAME,
});

console.log("postgresql database connected");

export const db = drizzle(pool, { schema });





