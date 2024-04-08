import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export const mongodbdatabaseConnect = (): void => {
    const mongodb_url: string | undefined = process.env.MONGODB_URL;
    if (mongodb_url === undefined) {
        console.log("DB connection failed");
        return;
    }
    mongoose.connect(mongodb_url)
        .then(() => console.log('DB Connected Successfully'))
        .catch((error) => {
            console.log('DB Connection Failed');
            console.error(error);
            process.exit(1);
        });
};
