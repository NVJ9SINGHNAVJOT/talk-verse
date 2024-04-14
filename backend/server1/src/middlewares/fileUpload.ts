import multer from "multer";

export const imageUpload = multer({
    dest: '../../tmp', // Temporary storage directory
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB for images
    },
});

export const videoUpload = multer({
    dest: '../../tmp', // Temporary storage directory
    limits: {
        fileSize: 50 * 1024 * 1024, // 50 MB for videos
    },
});