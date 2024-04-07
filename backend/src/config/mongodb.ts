import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';

export const mongodbdatabaseConnect = (): void => {
    mongoose.connect(process.env.MONGODB_URL as string)
        .then(() => console.log('DB Connected Successfully'))
        .catch((error) => {
            console.log('DB Connection Failed');
            console.error(error);
            process.exit(1);
        });
};
