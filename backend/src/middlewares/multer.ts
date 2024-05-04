import multer from "multer";
import fs from 'fs';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const uploadDir = 'tempStorage'; // Specify the directory name
    fs.mkdirSync(uploadDir, { recursive: true }); // Create the directory if it doesn't exist
    cb(null, uploadDir);
  },
});

const multerUploadImage = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // Set the limit to 5 MB (10 * 1024 * 1024 bytes)
  },
});

const multerUploadVideo = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 10, // Set the limit to 10 MB (10 * 1024 * 1024 bytes)
  },
});

const imageFile = multerUploadImage.single("imageFile");
const videoFile = multerUploadVideo.single("videoFile");

export { imageFile, videoFile };