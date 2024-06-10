import multer from "multer";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

fs.mkdirSync("uploadStorage", { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "uploadStorage");
  },
  filename: function (_req, file, cb) {
    cb(null, file.fieldname + "-" + uuidv4() + path.extname(file.originalname));
  },
});

const multerUpload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // limit to 5 MB (5 * 1024 * 1024 bytes)
  },
});

const multerUploadMultipleFiles = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // individual file size limit to 5 MB
    files: 5, // maximum number of files to 5
  },
});

const imageFile = multerUpload.single("imageFile");
const fileMessg = multerUpload.single("fileMessg");
const storyFile = multerUpload.single("storyFile");
const postFiles = multerUploadMultipleFiles.array("postFiles");

export { imageFile, fileMessg, storyFile, postFiles };
