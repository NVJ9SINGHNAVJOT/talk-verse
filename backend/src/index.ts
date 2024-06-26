// initialization environment for server
import dotenv from "dotenv";
dotenv.config();

// setup server config
import { logger, loggerConfig } from "@/logger/logger";
import app from "@/app/app";
import { setupWebSocket } from "@/socket/index";
import setupChannels from "@/socket/setupChannels";
import { mongodbDatabaseConnect } from "@/db/mongodb/connection";
import { postgresqlDatabaseConnect } from "@/db/postgresql/connection";
import { checkEnvVariables } from "@/validators/checkEnvVariables";
import { migratePostgreSQL } from "@/db/postgresql/migrate";
import { setupPostgreSQLTriggers } from "@/db/postgresql/triggers";
import { cloudinaryConnect } from "@/config/cloudinary";

async function main() {
  // check environment variables
  checkEnvVariables();
  // setup logger
  loggerConfig(`${process.env["ENVIRONMENT"]}`);

  // connect databases
  await mongodbDatabaseConnect();
  await postgresqlDatabaseConnect();

  // postgresql migrations and triggers
  /* NOTE: commented only for development purpose, remove comment in production */
  await migratePostgreSQL();
  await setupPostgreSQLTriggers();

  // connect cloudinary
  cloudinaryConnect();

  // get port number
  const PORT = parseInt(`${process.env["PORT"]}`) || 5000;

  // setup server
  const httpServer = setupWebSocket(app);

  // setup channels for messages
  await setupChannels();

  httpServer.listen(PORT, () => {
    logger.info("server running...");
  });
}

main();
