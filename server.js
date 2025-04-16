import dotenv from "dotenv";
dotenv.config();
import express from "express";
import errorHandler from "./middleware/errorHandler.js";
import folderRoutes from "./routes/folderRoutes.js";
import authRouter from "./routes/authRouter.js";
import fileRoutes from "./routes/fileRoutes.js";
import { deleteExpiredUser } from "./services/userService.js";
import passport from "./auth/passportConfig.js";
import cookieParser from "cookie-parser";
import { fileUpload } from "./controllers/fileController.js";

const port = process.env.PORT || 8000;

const app = express();

// Initialize passport
app.use(passport.initialize());

await deleteExpiredUser();
console.log("Cleanup: Expired unverified users removed");

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

// Routes
// Public
app.use("/api/auth", authRouter);
app.use("/api/folders", folderRoutes);
app.use("/api/uploads", fileRoutes);

// Protected
// app.use("/files", filesRouter);

// Error
app.use(errorHandler);

app.listen(port, () => console.log(`Server is running on port: ${port}`));
