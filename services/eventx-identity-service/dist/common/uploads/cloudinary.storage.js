"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCloudinaryStorage = void 0;
const cloudinary_1 = require("cloudinary");
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const getCloudinaryStorage = () => {
    cloudinary_1.v2.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_KEY,
        api_secret: process.env.CLOUDINARY_SECRET,
        timeout: 8000
    });
    return new multer_storage_cloudinary_1.CloudinaryStorage({
        cloudinary: cloudinary_1.v2,
        params: async (req, file) => ({
            folder: 'eventx/events',
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
            transformation: [{ width: 1200, height: 630, crop: 'limit', quality: 'auto' }],
        }),
    });
};
exports.getCloudinaryStorage = getCloudinaryStorage;
//# sourceMappingURL=cloudinary.storage.js.map