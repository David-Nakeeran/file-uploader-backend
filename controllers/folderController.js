import asyncHandler from "express-async-handler";
import upload from "../middleware/multer.js";
import cloudinary from "../utils/cloudinaryConfig.js";
import {
  allFolders,
  createFolder,
  deleteFolderById,
  getFolderById,
  updateFolderById,
} from "../services/folderService.js";
import { cloudinaryUpdateFolderName } from "../services/cloudinaryService.js";

export const folderGetAll = asyncHandler(async (req, res, next) => {
  const folders = await allFolders(req.user);

  if (!folders) {
    throw new CustomError(500, "Could not retrieve all folders");
  }
  res.status(200).json({
    success: true,
    message: "Retrieved all folders",
    folders,
  });
});

export const folderPost = asyncHandler(async (req, res, next) => {
  const { folderName } = req.body;

  const result = await cloudinary.api.create_folder(
    `uploads/${folderName.toLowerCase()}`
  );

  if (!result) {
    throw new CustomError(500, "Could not create folder");
  }

  const folder = await createFolder(result, req.user);

  res.status(201).json({
    success: true,
    message: "Folder created successfully",
    folder: folder,
  });
});

export const folderPut = asyncHandler(async (req, res, next) => {
  const folderId = parseInt(req.params.id);
  const { newFolderName } = req.body;

  // look up database to get correct record
  const folder = await getFolderById(folderId);

  // store file path as old filenamepath variable
  const currentFolderPath = folder.folderPath;

  const indexToCut = currentFolderPath.lastIndexOf("/");
  let folderPathToBeAddedTo = currentFolderPath.slice(0, indexToCut);

  folderPathToBeAddedTo += `/${newFolderName.toLowerCase()}`;

  const result = await cloudinaryUpdateFolderName(
    currentFolderPath,
    folderPathToBeAddedTo
  );

  // update database record
  const updatedFolder = await updateFolderById(
    folderId,
    newFolderName,
    folderPathToBeAddedTo
  );

  res.status(200).json({
    success: true,
    message: "Folder updated successfully",
    folder: updatedFolder,
  });
});

export const folderDelete = asyncHandler(async (req, res, next) => {
  const folderId = parseInt(req.params.id);

  if (!folderId) {
    throw new CustomError(400, "Invalid folder id");
  }

  const folder = await getFolderById(folderId);

  const result = await cloudinary.api.delete_folder(`${folder.folderPath}`);

  if (!result) {
    throw new CustomError("Could not delete folder", 500);
  }

  await deleteFolderById(folder.id);
  res.status(200).json({
    success: true,
    message: "Folder deleted successfully",
  });
});
