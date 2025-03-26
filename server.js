import express from "express";

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

app.listen(port, () => console.log(`Server is running on port: ${port}`));
