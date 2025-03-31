import dotenv from "dotenv";
dotenv.config();
import express from "express";
import errorHandler from "./middleware/errorHandler.js";
import folderRoutes from "./routes/folderRoutes.js";
import authRouter from "./routes/authRouter.js";

const port = process.env.PORT || 8000;

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
// Public
app.use("/api/auth", authRouter);
app.use("/api/folders", folderRoutes);

// Protected
// app.use("/files", filesRouter);

// Error
app.use(errorHandler);

app.listen(port, () => console.log(`Server is running on port: ${port}`));
