import { logger } from '@/logger/logger';
import { envVar } from '@/validators/checkEnvVariables';
import { v2 as cloudinary } from 'cloudinary';

export const cloudinaryConnect = (): void => {
    try {
        cloudinary.config({
            cloud_name: envVar.CLOUD_NAME,
            api_key: envVar.API_KEY,
            api_secret: envVar.API_SECRET,
            secure: true
        });
    } catch (error) {
        logger.error('error while connection cloudinary', { error: error });
        process.exit();
    }
};

