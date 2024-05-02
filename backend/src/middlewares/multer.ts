import multer from "multer";
import fs from 'fs';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const uploadDir = 'temp'; // Specify the directory name
    fs.mkdirSync(uploadDir, { recursive: true }); // Create the directory if it doesn't exist
    cb(null, uploadDir);
  },
});

const multerUpload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

const imageFile = multerUpload.single("imageFile");

export { imageFile };