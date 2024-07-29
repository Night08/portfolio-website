import multer from "multer";
import path from "path";
import fs from "fs";

// Set storage engine
const storage = multer.diskStorage({
  destination: "./uploads/", // Temporary storage folder
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, // Limit file size to 10MB
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
}).fields([
  { name: "thumbnailImg", maxCount: 1 },
  { name: "screenshots", maxCount: 30 },
]);

// Check file type
function checkFileType(
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif|jfif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Error: Images Only!"));
  }
}

// Function to delete files
function deleteFiles(
  files: Express.Multer.File[],
  callback: (err: NodeJS.ErrnoException | null) => void
) {
  let i = files.length;
  files.forEach((file) => {
    fs.unlink(file.path, (err) => {
      i--;
      if (err) {
        callback(err);
        return;
      } else if (i <= 0) {
        callback(null);
      }
    });
  });
}

export { upload, deleteFiles };
