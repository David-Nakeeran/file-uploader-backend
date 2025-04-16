import multer from "multer";
import path from "path";

// path.extname() gets the file extension, e.g. ".png" from "image.png".
// .substring(1) removes the dot, so ".png" becomes "png".
// const ext = path.extname(file.originalname).substring(1);

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const blocked = [".zip", ".rar", ".7z", ".pdf", ".gz"];
    if (blocked.includes(ext)) {
      return cb(new Error("This file type is not allowed"), false);
    }
    console.log("File accepted");
    cb(null, true);
  },
});
