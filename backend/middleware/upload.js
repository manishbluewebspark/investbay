import multer from "multer";
import path from "path";
import fs from "fs";

// base folders
const uploadDir = path.resolve("uploads");
const imageDir = path.join(uploadDir, "images");
const videoDir = path.join(uploadDir, "videos");

// create folders if not exist
[uploadDir, imageDir, videoDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "uplodedImage") {
      cb(null, imageDir);
    } 
    else if (file.fieldname === "videoFile") {
      cb(null, videoDir);
    } 
    else {
      cb(new Error("Invalid field name"), null);
    }
  },

  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// file filter
const fileFilter = (req, file, cb) => {
  if (
    file.fieldname === "uplodedImage" &&
    file.mimetype.startsWith("image")
  ) {
    cb(null, true);
  } 
  else if (
    file.fieldname === "videoFile" &&
    file.mimetype.startsWith("video")
  ) {
    cb(null, true);
  } 
  else {
    cb(new Error("Invalid file type"), false);
  }
};

// multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB (video support)
  }
});

export default upload;
