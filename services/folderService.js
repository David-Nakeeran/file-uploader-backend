import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import DatabaseError from "../errors/databaseError.js";

const prisma = new PrismaClient().$extends(withAccelerate());

export const allFolders = async (userId) => {
  try {
    const folders = await prisma.folder.findMany({
      where: {
        userId: userId,
      },
    });
    return folders;
  } catch (error) {
    throw new DatabaseError(error);
  }
};

export const createFolder = async (newFolder, userId) => {
  const { name, path, external_id } = newFolder;
  try {
    const folder = await prisma.folder.create({
      data: {
        folderName: name,
        folderPath: path,
        externalId: external_id,
        userId: userId,
      },
    });
    return folder;
  } catch (error) {
    throw new DatabaseError(error);
  }
};

export const getFolderByFilePath = async (path) => {
  try {
    const folder = await prisma.folder.findUnique({
      where: {
        folderPath: path,
      },
    });
    return folder;
  } catch (error) {
    throw new DatabaseError(error);
  }
};

// export const isFolderPathUnique = async (newPath) => {
// get all folder from db
// check collection if it the new path does not exist
// };
