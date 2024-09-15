// initialization environment for server
import dotenv from "dotenv";
dotenv.config();

// setup server config
import { logger, loggerConfig } from "@/logger/logger";
import app from "@/app/app";
import { setupWebSocket } from "@/socket/index";
import setupChannels from "@/socket/setupChannels";
import { mongodbDatabaseConnect, mongodbDatabaseDisconnect } from "@/db/mongodb/connection";
import { postgresqlDatabaseConnect, postgresqlDatabaseDisconnect } from "@/db/postgresql/connection";
import { checkEnvVariables } from "@/validators/checkEnvVariables";
import { migratePostgreSQL } from "@/db/postgresql/migrate";
import { setupPostgreSQLTriggers } from "@/db/postgresql/triggers";
import { cloudinaryConnect } from "@/config/cloudinary";
import { kafkaProducerDisconnect, kafkaProducerSetup } from "@/kafka/kafka";

async function handleExit() {
  await mongodbDatabaseDisconnect();
  await postgresqlDatabaseDisconnect();
  await kafkaProducerDisconnect();
}

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

  // setup channels for messages
  await setupChannels();

  // connect cloudinary
  cloudinaryConnect();

  // get port number
  const PORT = parseInt(`${process.env["PORT"]}`) || 5000;

  // setup server
  const httpServer = setupWebSocket(app);

  // setup kafka producer
  await kafkaProducerSetup();

  process.on("SIGINT", () => handleExit());
  process.on("SIGTERM", () => handleExit());

  httpServer.listen(PORT, () => {
    logger.info("server running...");
  });
}

main();
