import { logger } from '@/logger/logger';
import { v2 as cloudinary } from 'cloudinary';

export const cloudinaryConnect = (): void => {
    try {
        cloudinary.config({
            cloud_name: `${process.env['CLOUD_NAME']}`,
            api_key: `${process.env['API_KEY']}`,
            api_secret: `${process.env['API_SECRET']}`,
            secure: true
        });
    } catch (error) {
        logger.error('error while connection cloudinary', { error: error });
        process.exit();
    }
};

