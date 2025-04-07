import express from "express";
import {
  folderGet,
  // folderGetById,
  folderPost,
  folderPut,
  folderDelete,
} from "../controllers/folderController.js";
import { authenticateToken } from "../auth/auth.js";

const router = express.Router();

// Routes
router.get("/", folderGet);
// router.get("/:id", folderGetById);
router.put("/:id", folderPut);

// Create folder
router.post("/", authenticateToken, folderPost);

router.delete("/", folderDelete);

export default router;
