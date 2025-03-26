import express from "express";
import errorHandler from "./middleware/errorHandler.js";

const port = process.env.PORT || 8000;

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
// Public
app.use("/", authRouter);

// Protected
// app.use("/files", filesRouter);

// Error
app.use(errorHandler);

app.listen(port, () => console.log(`Server is running on port: ${port}`));
