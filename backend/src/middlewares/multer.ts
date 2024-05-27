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

const multerUpload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // Set the limit to 5 MB (5 * 1024 * 1024 bytes)
  },
});

const imageFile = multerUpload.single("imageFile");
const fileMessg = multerUpload.single("fileMessg");
const storyFile = multerUpload.single("storyFile");
const blogFiles = multerUpload.array("blogFiles");

export { imageFile, fileMessg, storyFile, blogFiles };