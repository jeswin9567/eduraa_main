const multer = require("multer");
const cloudinary = require("./cloudinaryConfig");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "teachers",
    allowed_formats: ["pdf", "jpeg", "mp4", "avi", "mkv", "mov"], // Fixed format string
    resource_type: "auto", // Added to handle both images and videos
    access_mode: "public",
  },
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  }
});

module.exports = upload;
