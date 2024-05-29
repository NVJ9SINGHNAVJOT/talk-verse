import { logger } from '@/logger/logger';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { deleteFiles } from '@/utils/deleteFile';

export const uploadToCloudinary = async (file: Express.Multer.File): Promise<string | null> => {
    try {
        const secureUrl = await cloudinary.uploader.upload(
            file.path,
            {
                folder: process.env['FOLDER_NAME'] as string,
                resource_type: "auto",
                chunk_size: 2000000, // 2mb
            }
        );

        fs.unlink(file.path, (unlinkError) => {
            if (unlinkError) {
                logger.error('error deleting file from uploadStorage', { error: unlinkError });
            }
        });

        return secureUrl.secure_url;
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

export const uploadMultiplesToCloudinary = async (files: Express.Multer.File[]): Promise<string[]> => {
    try {
        const uploadPromises = files.map((file) =>
            uploadToCloudinary(file)
        );

        const secUrls = await Promise.all(uploadPromises);

        const confirmUrls: string[] = [];

        secUrls.forEach((url) => {
            if (url !== null) {
                confirmUrls.push(url);
            }
        });

        if (!secUrls || secUrls.length < 1) {
            return [];
        }

        return confirmUrls;
    } catch (error) {
        if (files) {
            deleteFiles(files);
        }
        logger.error("error uploading multiple files to cloudinary", error);
        return [];
    }
};

export const deleteFromCloudinay = async (publicId: string) => {
    try {
        cloudinary.api.delete_resources([publicId]);
    } catch (error) {
        logger.error('error while deleting file from cloudinary', { publicId: publicId, error: error });
    }
};