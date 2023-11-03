import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dedajurgm",
  api_key: "274318666211875",
  api_secret: "PXIw3aiwsjJLeJDEvFQ2t-HuBtw",
  secure: true,
});

export const uploadImages = async (filePath) => {
  return await cloudinary.uploader.upload(filePath, {
    folder: "project",
  });
};

export const deleteImage = async (publicId) => {
  return await cloudinary.uploader.destroy(publicId);
};
