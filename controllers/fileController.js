import asyncHandler from "express-async-handler";
import { getFolderById } from "../services/folderService.js";
import { streamUpload } from "../services/cloudinaryService.js";

export const fileUpload = asyncHandler(async (req, res, next) => {
  const folderId = parseInt(req.body.id);
  const file = req.file;
  const fileName = req.file.originalname.substring(
    0,
    req.file.originalname.indexOf(".")
  );
  const publicId = `${fileName}-${Date.now()}`;

  const folder = await getFolderById(folderId);

  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const result = await streamUpload(file.buffer, folder.folderPath, publicId);
  // cloudinary.uploader
  //   .upload_stream(
  //     { resource_type: "auto", folder: folder.folderPath, public_id: publicId },
  //     (error, result) => {
  //       console.log(result);
  //       if (error) {
  //         return res
  //           .status(500)
  //           .json({ message: "Error uploading file", error });
  //       }
  //       res.status(200).json({
  //         success: true,
  //         file: result, // Cloudinary response with file info
  //       });
  //     }
  //   )
  //   .end(file.buffer);
  return res.status(200).json({
    success: true,
    result,
  });
});
