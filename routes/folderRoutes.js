import express from "express";
import {
  folderGet,
  // folderGetById,
  folderPost,
  folderPut,
  folderDelete,
} from "../controllers/folderController.js";

const router = express.Router();

// Routes
router.get("/", folderGet);
// router.get("/:id", folderGetById);
router.put("/:id", folderPut);
router.post("/", folderPost);
router.delete("/", folderDelete);

export default router;
