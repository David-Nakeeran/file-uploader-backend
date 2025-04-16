import cloudinary from "../utils/cloudinaryConfig.js";
import CloudinaryError from "../errors/cloudinaryError.js";

export const cloudinaryCreateFolder = async (path) => {
  try {
    return await cloudinary.api.create_folder(path);
  } catch (error) {
    console.log(`Message: ${Object.keys(error)}`);
    console.log(error.error);
  }
};

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
    // Chore: find out error
  }
};

export const streamUpload = (fileBuffer, folder, publicId) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        folder: folder,
        public_id: publicId,
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
};
