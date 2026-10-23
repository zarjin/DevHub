import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.ts";

const avatarStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (_req, _file) => ({
    folder: "devhub/avatar",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    transformation: [
      { width: 500, height: 500, crop: "fill", gravity: "face" },
    ],
  }),
});

export const uploadAvatar = multer({ storage: avatarStorage });
