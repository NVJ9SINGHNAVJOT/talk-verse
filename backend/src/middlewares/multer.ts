import multer from "multer";
import fs from 'fs';
import path from "path";
import { v4 as uuidv4 } from "uuid";

fs.mkdirSync('uploadStorage', { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, 'uploadStorage');
  },
  filename: function (_req, file, cb) {
    cb(null, file.fieldname + "-" + uuidv4() + path.extname(file.originalname));
  }
});

const multerUploadImage = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // Set the limit to 5 MB (10 * 1024 * 1024 bytes)
  },
});

const multerUploadVideo = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10, // Set the limit to 10 MB (10 * 1024 * 1024 bytes)
  },
});

const imageFile = multerUploadImage.single("imageFile");
const videoFile = multerUploadVideo.single("videoFile");

export { imageFile, videoFile };