import mongoose from "mongoose";
import { logger } from "@/logger/logger";
import { getErrorDetails } from "@/logger/error";

const clientOptions: mongoose.ConnectOptions = { serverApi: { version: "1", strict: true, deprecationErrors: true } };

export async function mongodbDatabaseConnect() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(`${process.env["MONGODB_URL"]}`, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    logger.info("mongodb database connected");
  } catch (error) {
    // Ensures that the client will close when error
    logger.error("mongodb connection failed", { error: getErrorDetails(error) });
    await mongoose.disconnect();
    process.exit();
  }
}

export async function mongodbDatabaseDisconnect() {
  await mongoose.disconnect();
  logger.info("mongodb database disconnected");
}
