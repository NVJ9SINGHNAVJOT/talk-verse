import { logger } from "@/logger/logger";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { deleteFiles } from "@/utils/deleteFile";

export const uploadToCloudinary = async (file: Express.Multer.File): Promise<string | null> => {
  try {
    const secureUrl = await cloudinary.uploader.upload(file.path, {
      folder: `${process.env["FOLDER_NAME"]}`,
      resource_type: "auto",
      chunk_size: 2000000, // 2mb
    });

    fs.unlink(file.path, (unlinkError) => {
      if (unlinkError) {
        logger.error("error deleting file from uploadStorage", { error: unlinkError });
      }
    });

    return secureUrl.secure_url;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logger.error("error while uploading file to cloudinary", error.message);
    if (fs.existsSync(file.path)) {
      fs.unlink(file.path, (unlinkError) => {
        if (unlinkError) {
          logger.error("error deleting file from uploadStorage", { error: unlinkError });
        }
      });
    }
    return null;
  }
};

export const uploadMultiplesToCloudinary = async (files: Express.Multer.File[]): Promise<string[]> => {
  try {
    const uploadPromises = files.map((file) => uploadToCloudinary(file));

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (files) {
      deleteFiles(files);
    }
    logger.error("error uploading multiple files to cloudinary", error.message);
    return [];
  }
};

export const deleteFromCloudinay = async (cloudinaryUrl: string) => {
  try {
    const publicId = `${process.env["FOLDER_NAME"]}` + "/" + cloudinaryUrl.split("/").pop()?.split(".")[0];
    /* 
      NOTE: below method is used in production, as it delete file from cloudinary but not from cloudinary cache.
      so, if link is in use by user's browser then file will be displayed, as file can be still accessed by link till it is 
      present in cloundinary cache.
      await is not used as response is not required.
    */
    /* NOTE: commented only for development purpose, remove comment in production */
    cloudinary.uploader.destroy(publicId);

    /* 
      NOTE: below method is note used in production, as it delete file from cloudinary cache as well.
      so, if link is in use by user's browser then file will not be displayed.
      await is not used as response is not required.
    */
    /* NOTE: commented only for production purpose, remove comment in development */
    // cloudinary.api.delete_resources([publicId]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logger.error("error while deleting file from cloudinary", { cloudinaryUrl: cloudinaryUrl, error: error });
  }
};
