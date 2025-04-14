import cloudinary from "../utils/cloudinaryConfig.js";
import CloudinaryError from "../errors/cloudinaryError.js";

export const cloudinaryUpdateFolderName = async (
  currentFolderPath,
  folderName
) => {
  try {
    return await cloudinary.api.rename_folder(
      `${currentFolderPath}`,
      `${folderName}`
    );
  } catch (error) {
    console.log(`Message: ${Object.keys(error)}`);
    console.log(error.error);
    throw new CloudinaryError(409, "A folder with that name already exists");
  }
};

export const cloudinaryDeleteFolder = async (folderPath) => {
  try {
    return await cloudinary.api.delete_folder(folderPath);
  } catch (error) {
    console.log(`Message: ${Object.keys(error)}`);
    console.log(error.error);
  }
};
