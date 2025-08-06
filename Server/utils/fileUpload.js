import dotenv from 'dotenv';
dotenv.config();
import { v2 as cloudinary } from 'cloudinary';
import { StatusCodes } from 'http-status-codes';
import AppError from './AppError.js';


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadToCloudinary = async (buffer, folder) => {
    try {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder,
                    resource_type: 'auto'
                },
                (error, result) => {
                    if (error) {
                        reject(new AppError('Failed to upload file', StatusCodes.INTERNAL_SERVER_ERROR));
                    }
                    resolve({
                        url: result.secure_url,
                        public_id: result.public_id
                    });
                }
            );
            uploadStream.end(buffer);
        });
    } catch (error) {
        throw new AppError('Failed to upload file', StatusCodes.INTERNAL_SERVER_ERROR);
    }
};

export const deleteFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        throw new AppError('Failed to delete file', StatusCodes.INTERNAL_SERVER_ERROR);
    }
};

export const validateFile = (file, allowedTypes, maxSize) => {
    // Check file type
    const fileType = file.mimetype.split('/')[1];
    if (!allowedTypes.includes(fileType)) {
        throw new AppError(
            `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
            StatusCodes.BAD_REQUEST
        );
    }

    // Check file size (in bytes)
    if (file.size > maxSize) {
        throw new AppError(
            `File size too large. Maximum size: ${maxSize / 1024 / 1024}MB`,
            StatusCodes.BAD_REQUEST
        );
    }
}; 