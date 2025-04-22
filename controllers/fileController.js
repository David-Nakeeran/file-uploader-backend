import asyncHandler from "express-async-handler";
import { getFolderById } from "../services/folderService.js";
import { streamUpload } from "../services/cloudinaryService.js";
import {
  createFile,
  getFileById,
  updateFile,
} from "../services/fileService.js";
import cloudinary from "../utils/cloudinaryConfig.js";

export const fileUpload = asyncHandler(async (req, res, next) => {
  const folderId = parseInt(req.params.id);
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
  const folderId = parseInt(req.body.id);
  const file = await getFileById(fileId);
  // get file filePath
  const oldPath = file.filePath;

  // get file fileName
  const fileName = file.fileName;

  // get folder by id
  const folder = await getFolderById(folderId);
  // get folder path
  const newFilePath = `${folder.folderPath}/${fileName}`;

  // Move into cloudinaryService
  const result = await cloudinary.uploader.rename(
    `${oldPath}`,
    `${newFilePath}`,
    {
      overwrite: true,
      invalidate: true,
    }
  );

  const fileMoved = await updateFile(
    fileId,
    result.public_id,
    result.secure_url,
    folderId
  );

  return res.status(200).json({
    success: true,
    message: "File moved successfully",
    fileMoved,
  });
});

export const fileDelete = asyncHandler(async (req, res, next) => {
  const fileId = parseInt(req.params.id);

  // get file by id
  const file = await getFileById(fileId);

  // get file asset id pass to cloudinary api

  const result = await cloudinary.uploader.destroy(file.filePath, {
    resource_type: file.resourceType,
  });

  return res.status(200).json({
    success: true,
    message: "File deleted successfully",
    result,
  });
});
