import mongoose from 'mongoose';
import { configDotenv } from 'dotenv';
import { logger } from '@/logger/logger';

configDotenv();

const clientOptions: mongoose.ConnectOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

export async function mongodbdatabaseConnect() {
    try {
        const mongodb_url: string | undefined = process.env.MONGODB_URL;
        if (mongodb_url === undefined) {
            logger.info("mongodb connection failed");
            return;
        }
        // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
        await mongoose.connect(mongodb_url, clientOptions);
        await mongoose.connection.db.admin().command({ ping: 1 });
        logger.info("mongodb database connected");
    } catch {
        // Ensures that the client will close when error
        logger.info("mongodb connection failed");
        await mongoose.disconnect();
    }
}