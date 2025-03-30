import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = new PrismaClient().$extends(withAccelerate());

export const allFolders = async () => {
  const folders = await prisma.folder.findMany();
  return folders;
};

export const createFolder = async (newFolder) => {
  const { name, path, external_id } = newFolder;
  const folder = await prisma.folder.create({
    data: {
      folderName: name,
      folderPath: path,
      externalId: external_id,
    },
  });
  return folder;
};

// export const isFolderPathUnique = async (newPath) => {
// get all folder from db
// check collection if it the new path does not exist
// };
