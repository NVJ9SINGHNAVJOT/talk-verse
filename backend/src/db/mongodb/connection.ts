import mongoose from "mongoose";
import { logger } from "@/logger/logger";

const clientOptions: mongoose.ConnectOptions = { serverApi: { version: "1", strict: true, deprecationErrors: true } };

export async function mongodbDatabaseConnect() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(`${process.env["MONGODB_URL"]}`, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    logger.info("mongodb database connected");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // Ensures that the client will close when error
    logger.error("mongodb connection failed", { error: error.message });
    await mongoose.disconnect();
    process.exit();
  }
}
