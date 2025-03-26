import express from "express";
import { registerPost, loginPost } from "../controllers/authController.js";

const router = express.Router();

// Routes
// Post Register new user
router.post("/register", registerPost);

// Post login user
router.post("/login", loginPost);
