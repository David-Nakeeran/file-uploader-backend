import express from "express";
import { upload } from "../middleware/multer.js";
import {
  folderGetAll,
  folderPost,
  folderPut,
  folderDelete,
  folderGetFiles,
} from "../controllers/folderController.js";
import {
  fileUpload,
  fileMove,
  fileDelete,
} from "../controllers/fileController.js";
import { authenticateToken } from "../auth/auth.js";
import { validateFolderName } from "../middleware/validators.js";
import handleValidationErrors from "../middleware/handleValidationErrors.js";

const router = express.Router();

// Routes
router.get("/", authenticateToken, folderGetAll);

// Get all files from folder
router.get("/:id", authenticateToken, folderGetFiles);

// Update folder
router.put("/:id", authenticateToken, folderPut);

// Create folder
router.post(
  "/",
  authenticateToken,
  validateFolderName,
  handleValidationErrors,
  folderPost
);

// Delete folder
router.delete("/:id", authenticateToken, folderDelete);

// Uploads
// Upload file
router.post(
  "/:id/uploads",
  authenticateToken,
  upload.single("file"),
  fileUpload
);

// Move file route
router.post("/:id/uploads/:fileId", authenticateToken, fileMove);

// Delete file
router.delete("/:id/uploads/:fileId", authenticateToken, fileDelete);

export default router;
