import express from "express";
import { folderPost } from "../controllers/folderController.js";

const router = express.Router();

// Routes
router.post("/", folderPost);

export default router;
