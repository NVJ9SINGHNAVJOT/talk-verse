import { v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import fs from 'fs';

const uploadToCloudinary = async (file: Express.Multer.File): Promise<string | null> => {
    try {
        const secureUrl = await new Promise<string>((resolve, reject) => {
            cloudinary.uploader.upload(
                file.path,
                {
                    folder: process.env.FOLDER_NAME,
                    resource_type: "auto"
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
        fs.unlinkSync(file.path);
        return secureUrl;

    } catch (error) {
        if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }
        return null;
    }
};

export default uploadToCloudinary;
