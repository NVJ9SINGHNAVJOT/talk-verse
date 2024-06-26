export const validFiles = {
  image: ["image/jpeg", "image/jpg", "image/png"],
  pdf: "application/pdf",
  video: ["video/mp4", "video/webm", "video/ogg"],
  audio: ["audio/mp3", "audio/mpeg", "audio/wav"],
};

export const maxFileSize = 5 * 1024 * 1024;

export const errMessage = process.env.ERROR_MESSAGE;

export const categories = [
  "Technology",
  "Lifestyle",
  "Article",
  "Research",
  "Nature",
  "Music",
  "Sports",
  "Health",
  "Finance",
  "Art",
  "History",
  "Literature",
  "Science",
  "Business",
  "Other",
];
