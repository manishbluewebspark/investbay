import multer from "multer";

// S3 ke liye memory storage



const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    // Images
    // "image/jpeg",
    // "image/jpg",
    // "image/png",

    // Images
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
    
    // Videos
    "video/mp4",
    "video/mpeg",
    "video/quicktime",
    "video/x-msvideo",
    "video/x-matroska",
    "video/webm",
    
    // Documents
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

    // video
    // "video/mp4"
  ];

  // Allowed field names
  const allowedFields = [
    "profileImage",
    "panFile",
    "sebiFile",
    "professionalDocument",
    "videoFile",
    "uplodedImage",
    "documents" ,
     'signature' ,
     "images", 
      "videos",
    "newsImages",
    "news_images" 
  ];

  if (!allowedFields.includes(file.fieldname)) {
    return cb(new Error(`Invalid field name: ${file.fieldname}`), false);
  }

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(
      new Error(`Invalid file type: ${file.mimetype}`),
      false
    );
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});

export default upload;
