import multer from "multer";
import path from "path";

const upload = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (
      ext !== ".jpg" &&
      ext !== ".jpeg" &&
      ext !== ".png" &&
      ext !== ".webp" &&
      ext !== ".pdf" &&
      ext !== ".mp4"
    ) {
      cb(new Error("Unsupported file type!"), false);
      return;
    }
    cb(null, true);
  },
});

export default upload;
