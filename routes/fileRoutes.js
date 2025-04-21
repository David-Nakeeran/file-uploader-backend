import express from "express";
import { upload } from "../middleware/multer.js";
import {
  fileUpload,
  fileMove,
  fileDelete,
  getFiles,
} from "../controllers/fileController.js";
import { authenticateToken } from "../auth/auth.js";

const router = express.Router();

// Routes
// Get all files from folder
router.get("/:id", authenticateToken, getFiles);
// Upload file
router.post("/", authenticateToken, upload.single("file"), fileUpload);

// Move file route
router.post("/:id", authenticateToken, fileMove);

// Delete file
router.delete("/:id", authenticateToken, fileDelete);

export default router;
