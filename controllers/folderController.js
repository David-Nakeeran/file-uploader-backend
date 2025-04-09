import asyncHandler from "express-async-handler";
import upload from "../middleware/multer.js";
import cloudinary from "../utils/cloudinaryConfig.js";
import {
  allFolders,
  createFolder,
  getFolderByFilePath,
} from "../services/folderService.js";

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

export const folderGetByParams = asyncHandler(async (req, res, next) => {
  const folderPath = req.params.folderPath;

  if (!folderPath) {
    throw new CustomError(400, "Invalid folder path");
  }

  return await getFolderByFilePath(folderPath);
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
  // const folderId = req.params.id;
  const { newFolderName } = req.body;
  // look up database to get correct record
  // store file path as old filenamepath variable
  const currentFolderPath = "uploads/test2";

  const indexToCut = currentFolderPath.lastIndexOf("/");
  let folderPathToBeAddedTo = currentFolderPath.slice(0, indexToCut);

  folderPathToBeAddedTo += `/${newFolderName}`;

  // before updated cloudinary with new folder now
  // use service function to check it doesn't have a sibling folder with the same name

  // update database folder name with newFolderName
  const result = await cloudinary.api.rename_folder(
    `${currentFolderPath}`,
    `${folderPathToBeAddedTo}`
  );

  console.log(result);
  if (!result) {
    throw new CustomError("Could not update folder", 500);
  }

  // update database record

  res.status(200).json({
    success: true,
    message: "Folder updated successfully",
    folder: result,
  });
});

export const folderDelete = asyncHandler(async (req, res, next) => {
  // const folderId = req.params.id;
  // look up database
  // return from database filepath
  const filePath = "uploads/testFolder/";
  const result = await cloudinary.api.delete_folder(`${filePath}`);
  console.log(result);
  if (!result) {
    throw new CustomError("Could not update folder", 500);
  }
  // if successfully deleted from cloudinary
  //  delete from database
  res.status(200).json({
    success: true,
    message: "Folder deleted successfully",
    // folder: result,
  });
});
