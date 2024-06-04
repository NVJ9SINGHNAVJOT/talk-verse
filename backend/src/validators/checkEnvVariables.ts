import { logger } from "@/logger/logger";

export function checkEnvVariables() {
  if (
    !process.env["ENVIRONMENT"] ||
    !process.env["SERVER_KEY"] ||
    !process.env["PORT"] ||
    !process.env["MAIL_HOST"] ||
    !process.env["MAIL_USER"] ||
    !process.env["MAIL_PASS"] ||
    !process.env["JWT_SECRET"] ||
    !process.env["TOKEN_NAME"] ||
    !process.env["FOLDER_NAME"] ||
    !process.env["CLOUD_NAME"] ||
    !process.env["API_KEY"] ||
    !process.env["API_SECRET"] ||
    !process.env["MONGO_INITDB_DATABASE"] ||
    !process.env["MONGO_INITDB_ROOT_USERNAME"] ||
    !process.env["MONGO_INITDB_ROOT_PASSWORD"] ||
    !process.env["MONGODB_URL"] ||
    !process.env["POSTGRES_HOST"] ||
    !process.env["POSTGRES_USER"] ||
    !process.env["POSTGRES_PASSWORD"] ||
    !process.env["POSTGRES_DB"]
  ) {
    logger.error("error in environment variables");
    process.exit();
  }
}
