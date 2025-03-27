import asyncHandler from "express-async-handler";
import upload from "../middleware/multer.js";
import cloudinary from "../utils/cloudinaryConfig.js";

export const folderPost = asyncHandler(async (req, res, next) => {
  const { folderName } = req.body;

  const result = await cloudinary.api.create_folder(`uploads/${folderName}`);
  //   const result = await cloudinary.uploader.create_folder(
  //     `uploads/${folderName}`
  //   );
  console.log(result);
  if (!result) {
    throw new CustomError("Could not create folder", 500);
  }

  res.json({
    success: true,
    message: "Folder created successfully",
    folder: result,
  });
});
