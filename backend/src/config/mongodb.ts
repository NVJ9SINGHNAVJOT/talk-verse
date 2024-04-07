import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export const mongodbdatabaseConnect = (): void => {
    mongoose.connect(process.env.MONGODB_URL as string)
        .then(() => console.log('DB Connected Successfully'))
        .catch((error) => {
            console.log('DB Connection Failed');
            console.error(error);
            process.exit(1);
        });
};
