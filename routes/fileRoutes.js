import express from "express";
import { upload } from "../middleware/multer.js";
import { fileUpload, fileMove } from "../controllers/fileController.js";
import { authenticateToken } from "../auth/auth.js";

const router = express.Router();

// Routes
router.post("/", authenticateToken, upload.single("file"), fileUpload);

// Move file route
router.post("/:id", authenticateToken, fileMove);

export default router;
