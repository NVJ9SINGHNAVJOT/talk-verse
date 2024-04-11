import mongoose from 'mongoose';
import { configDotenv } from 'dotenv';

configDotenv();

const clientOptions: mongoose.ConnectOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

export async function mongodbdatabaseConnect() {
    try {
        const mongodb_url: string | undefined = process.env.MONGODB_URL;
        if (mongodb_url === undefined) {
            console.log("mongodb connection failed");
            return;
        }
        // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
        await mongoose.connect(mongodb_url, clientOptions);
        await mongoose.connection.db.admin().command({ ping: 1 });
        console.log("mongodb database connected");
    } finally {
        // Ensures that the client will close when you finish/error
        await mongoose.disconnect();
    }
}
