import { logger } from '@/logger/logger';
import { v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import fs from 'fs';

const uploadToCloudinary = async (file: Express.Multer.File): Promise<string | null> => {
    try {
        const secureUrl = await new Promise<string>((resolve, reject) => {
            cloudinary.uploader.upload(
                file.path,
                {
                    folder: process.env.FOLDER_NAME,
                    resource_type: "auto",
                    chunk_size: 2000000
                },
                (err: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
                    if (err) {
                        reject(err);
                    }
                    if (!result) {
                        reject(new Error('Cloudinary upload result is undefined'));
                    }
                    resolve(result?.secure_url as string);
                }
            );
        });
        await fs.promises.unlink(file.path);
        return secureUrl;

    } catch (error) {
        logger.error('error while uploading file to cloudinary', error);
        if (fs.existsSync(file.path)) {
            await fs.promises.unlink(file.path);
        }
        return null;
    }
};

export default uploadToCloudinary;
