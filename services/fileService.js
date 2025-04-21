import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import DatabaseError from "../errors/databaseError.js";
import CustomError from "../errors/customError.js";

const prisma = new PrismaClient().$extends(withAccelerate());

export const createFile = async (userId, folderId, file) => {
  const {
    asset_id,
    public_id,
    resource_type,
    secure_url,
    display_name,
    format = null,
  } = file;

  try {
    const file = await prisma.file.create({
      data: {
        fileName: display_name,
        filePath: public_id,
        assetId: asset_id,
        resourceType: resource_type,
        format: format,
        url: secure_url,
        userId,
        folderId,
      },
    });
    return file;
  } catch (error) {
    throw new DatabaseError(error);
  }
};

export const getFileById = async (fileId) => {
  try {
    const file = await prisma.file.findUnique({
      where: {
        id: fileId,
      },
    });
    if (!file) {
      throw new CustomError(404, "File does not exist");
    }
    return file;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new DatabaseError(error);
  }
};

export const updateFile = async (fileId, filePath, url, folderId) => {
  try {
    const updatedFile = await prisma.file.update({
      where: {
        id: fileId,
      },
      data: {
        filePath,
        url,
        folderId,
      },
    });
    if (!updatedFile) {
      throw new CustomError(404, "File does not exist");
    }
    return updatedFile;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new DatabaseError(error);
  }
};
