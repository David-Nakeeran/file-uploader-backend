import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import DatabaseError from "../errors/databaseError.js";

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

// Move file to another folder
// https://cloudinary.com/documentation/image_upload_api_reference#rename

// Delete file
// https://cloudinary.com/documentation/admin_api#delete_resources_by_asset_id

// GET all files by folder
// https://cloudinary.com/documentation/admin_api#get_resources_by_asset_folder
