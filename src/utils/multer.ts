// src/multerConfig.ts
import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
import path from "path";

// Define storage engine with custom destination & filename logic
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    // Check file type and set destination accordingly
    if (file.mimetype.startsWith("image/")) {
      cb(null, "src/utils/uploads/images"); // Folder for images
    } else {
      cb(null, "src/utils/uploads/files");  // Folder for non-image files
    }
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    // Create a unique filename with original extension
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

// (Optional) File filter to allow specific file types
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  // For example, allow images and PDFs only (modify as needed)
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type!"));
  }
};

// Initialize multer with defined storage (and fileFilter if needed)
const upload = multer({ storage, fileFilter });

export default upload;
