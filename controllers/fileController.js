import asyncHandler from "express-async-handler";
import { getFolderById } from "../services/folderService.js";
import { streamUpload } from "../services/cloudinaryService.js";
import { createFile, getFileById } from "../services/fileService.js";

export const fileUpload = asyncHandler(async (req, res, next) => {
  const folderId = parseInt(req.body.id);
  const userId = req.user;
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

  const fileUpload = await createFile(userId, folderId, result);
  return res.status(200).json({
    success: true,
    fileUpload,
  });
});

export const fileMove = asyncHandler(async (req, res, next) => {
  const fileId = parseInt(req.params.id);
  const file = getFileById(fileId);
  // get file filePath
  // get file fileName

  // get folder by id
  // get folder path

  // append fileName to folderPath - `uploads1/newfolder/fileName`

  // cloudinary.api.uploader.rename(oldfilePath, newfilepath)
});
