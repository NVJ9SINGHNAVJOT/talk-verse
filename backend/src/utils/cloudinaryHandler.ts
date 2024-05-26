import { logger } from '@/logger/logger';
import { v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import fs from 'fs';

export const uploadToCloudinary = async (file: Express.Multer.File): Promise<string | null> => {
    try {
        const secureUrl = await new Promise<string>((resolve, reject) => {
            cloudinary.uploader.upload(
                file.path,
                {
                    folder: process.env.FOLDER_NAME as string,
                    resource_type: "auto",
                    chunk_size: 2000000,
                    timeout: 10000
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

        fs.unlink(file.path, (unlinkError) => {
            if (unlinkError) {
                logger.error('error deleting file from uploadStorage', { error: unlinkError });
            }
        });
        return secureUrl;
    } catch (error) {
        logger.error('error while uploading file to cloudinary', error);
        if (fs.existsSync(file.path)) {
            fs.unlink(file.path, (unlinkError) => {
                if (unlinkError) {
                    logger.error('error deleting file from uploadStorage', { error: unlinkError });
                }
            });
        }
        return null;
    }
};

export const deleteFromCloudinay = async (publicId: string) => {
    try {
        cloudinary.api.delete_resources([publicId]);
    } catch (error) {
        logger.error('error while deleting file from cloudinary', { publicId: publicId, error: error });
    }
};