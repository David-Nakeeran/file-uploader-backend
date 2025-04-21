import express from "express";
import {
  folderGetAll,
  folderPost,
  folderPut,
  folderDelete,
  folderGetFiles,
} from "../controllers/folderController.js";
import { authenticateToken } from "../auth/auth.js";
import { validateFolderName } from "../middleware/validators.js";
import handleValidationErrors from "../middleware/handleValidationErrors.js";

const router = express.Router();

// Routes
router.get("/", authenticateToken, folderGetAll);

// Get all files from folder
router.get("/:id", authenticateToken, folderGetFiles);

// Update folder
router.put("/:id", folderPut);

// Create folder
router.post(
  "/",
  authenticateToken,
  validateFolderName,
  handleValidationErrors,
  folderPost
);

router.put("/:id", authenticateToken, folderPut);

router.delete("/:id", authenticateToken, folderDelete);

export default router;
