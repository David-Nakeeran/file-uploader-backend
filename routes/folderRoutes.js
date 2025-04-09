import express from "express";
import {
  folderGetAll,
  // folderGetById,
  folderPost,
  folderPut,
  folderDelete,
} from "../controllers/folderController.js";
import { authenticateToken } from "../auth/auth.js";
import { validateFolderName } from "../middleware/validators.js";
import handleValidationErrors from "../middleware/handleValidationErrors.js";

const router = express.Router();

// Routes
router.get("/", authenticateToken, folderGetAll);
// router.get("/:id", folderGetById);
router.put("/:id", folderPut);

// Create folder
router.post(
  "/",
  authenticateToken,
  validateFolderName,
  handleValidationErrors,
  folderPost
);

router.delete("/:id", authenticateToken, folderDelete);

export default router;
