// import multer from "multer";
// import path from "path";
// import fs from "fs";

// // base folders
// const uploadDir = path.resolve("uploads");
// const imageDir = path.join(uploadDir, "images");
// const videoDir = path.join(uploadDir, "videos");

// // create folders if not exist
// [uploadDir, imageDir, videoDir].forEach(dir => {
//   if (!fs.existsSync(dir)) {
//     fs.mkdirSync(dir, { recursive: true });
//   }
// });

// // storage config
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     if (file.fieldname === "uplodedImage") {
//       cb(null, imageDir);
//     } 
//     else if (file.fieldname === "videoFile") {
//       cb(null, videoDir);
//     } 
//     else {
//       cb(new Error("Invalid field name"), null);
//     }
//   },

//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   }
// });

// // file filter
// const fileFilter = (req, file, cb) => {
//   if (
//     file.fieldname === "uplodedImage" &&
//     file.mimetype.startsWith("image")
//   ) {
//     cb(null, true);
//   } 
//   else if (
//     file.fieldname === "videoFile" &&
//     file.mimetype.startsWith("video")
//   ) {
//     cb(null, true);
//   } 
//   else {
//     cb(new Error("Invalid file type"), false);
//   }
// };

// // multer instance
// const upload = multer({
//   storage,
//   fileFilter,
//   limits: {
//     fileSize: 100 * 1024 * 1024 // 100MB (video support)
//   }
// });

// export default upload;


// ------------------------------------------------------------------------------------------------------------------


// import multer from "multer";
// import path from "path";

// // Create memory storage for S3
// const storage = multer.memoryStorage();

// // File filter
// const fileFilter = (req, file, cb) => {
//   if (
//     file.fieldname === "uplodedImage" &&
//     file.mimetype.startsWith("image")
//   ) {
//     cb(null, true);
//   } 
//   else if (
//     file.fieldname === "videoFile" &&
//     file.mimetype.startsWith("video")
//   ) {
//     cb(null, true);
//   } 
//   else {
//     cb(new Error("Invalid file type"), false);
//   }
// };

// // Multer instance
// const upload = multer({
//   storage,
//   fileFilter,
//   limits: {
//     fileSize: 100 * 1024 * 1024 // 100MB
//   }
// });

// export default upload;



// -----------------------------------------------------------------------


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
    "documents" 
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
