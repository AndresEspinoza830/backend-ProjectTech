import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dedajurgm",
  api_key: "274318666211875",
  api_secret: "PXIw3aiwsjJLeJDEvFQ2t-HuBtw",
  secure: true,
});

export const uploadImage = async (filePath) => {
  return await cloudinary.uploader.upload(filePath, {
    folder: "project",
  });
};
