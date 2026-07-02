import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
        folder: "portfolio",
        resource_type: "auto",
        public_id: `${Date.now()}-${file.originalname.replace(/\.[^/.]+$/, "")}`
    })
});

export const upload = multer({
    storage,
    limits: {
        fileSize: 50 * 1024 * 1024
    }
});