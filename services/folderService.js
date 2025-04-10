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

export const getFolderById = async (folderId) => {
  try {
    const folder = await prisma.folder.findUnique({
      where: {
        id: folderId,
      },
    });
    return folder;
  } catch (error) {
    throw new DatabaseError(error);
  }
};

export const deleteFolderById = async (folderId) => {
  try {
    const deleteFolder = await prisma.folder.delete({
      where: {
        id: folderId,
      },
    });
    return deleteFolder;
  } catch (error) {
    throw new DatabaseError(error);
  }
};
