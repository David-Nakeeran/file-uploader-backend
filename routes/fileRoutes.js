import express from "express";
import { upload } from "../middleware/multer.js";
import { fileUpload } from "../controllers/fileController.js";
import { authenticateToken } from "../auth/auth.js";

const router = express.Router();

// Routes
router.post("/", authenticateToken, upload.single("file"), fileUpload);

export default router;
