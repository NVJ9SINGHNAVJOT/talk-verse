import multer, { FileFilterCallback } from "multer";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { Request } from "express";

// create uploadStorage directory if not exist
fs.mkdirSync("uploadStorage", { recursive: true });

// only valid files will be allowed by multer
const validFiles = {
  image: ["image/jpeg", "image/jpg", "image/png"],
  pdf: "application/pdf",
  video: ["video/mp4", "video/webm", "video/ogg"],
  audio: ["audio/mp3", "audio/mpeg", "audio/wav"],
};

// storage configuration for multer
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "uploadStorage");
  },
  filename: function (_req, file, cb) {
    cb(null, file.fieldname + "-" + uuidv4() + path.extname(file.originalname));
  },
});

// filter for file or files
const filterImageVideo = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (validFiles.image.includes(file.mimetype) || validFiles.video.includes(file.mimetype)) {
    cb(null, true); // accept file
  } else {
    cb(null, false); // reject file
    return cb(new Error("Only .jpeg, .jpg, .png, .mp4, .webm and .ogg format allowed!"));
  }
};
const filterImage = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (validFiles.image.includes(file.mimetype)) {
    cb(null, true); // accept file
  } else {
    cb(null, false); // reject file
    return cb(new Error("Only .jpeg, .jpg and .png format allowed!"));
  }
};
const filesFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (
    validFiles.image.includes(file.mimetype) ||
    validFiles.pdf.includes(file.mimetype) ||
    validFiles.video.includes(file.mimetype) ||
    validFiles.audio.includes(file.mimetype)
  ) {
    cb(null, true); // accept file
  } else {
    cb(null, false); // reject file
    return cb(new Error("Only .jpeg, .jpg, .png, .pdf, .mp4, .webm, .ogg, .mp3, .mpeg, and .wav format allowed!"));
  }
};

// limits for multer
const singleFileLimit = {
  fileSize: 1024 * 1024 * 5, // limit to 5 MB (5 * 1024 * 1024 bytes)
};
const mutlipleFilesLimit = {
  fileSize: 1024 * 1024 * 5, // individual file size limit to 5 MB
  files: 5, // maximum number of files to 5
};

// multer uploads
const multerUploadImageVideo = multer({
  storage: storage,
  limits: singleFileLimit,
  fileFilter: filterImageVideo,
});
const multerUploadMultipleFiles = multer({
  storage: storage,
  limits: singleFileLimit,
  fileFilter: filesFilter,
});
const multerUploadImage = multer({
  storage: storage,
  limits: singleFileLimit,
  fileFilter: filterImage,
});
const multerUploadMultipleImageVideo = multer({
  storage: storage,
  limits: mutlipleFilesLimit,
  fileFilter: filterImageVideo,
});

// multer configuration for file or files in request
const imageFile = multerUploadImage.single("imageFile");
const fileMessg = multerUploadMultipleFiles.single("fileMessg");
const storyFile = multerUploadImageVideo.single("storyFile");
const postFiles = multerUploadMultipleImageVideo.array("postFiles");

export { imageFile, fileMessg, storyFile, postFiles };
