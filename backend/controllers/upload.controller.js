import asyncHandler from 'express-async-handler';
import { upload } from '../middleware/upload.js';


export const uploadSingleImage = asyncHandler(async (req, res) => {
    if (!req.file) {
        res.status(400);
        throw new Error('Vui lòng chọn file để upload');
    }

    res.json({
        success: true,
        data: {
            filename: req.file.filename,
            path: `/uploads/${req.file.filename}`,
            size: req.file.size,
        },
    });
});


export const uploadMultipleImages = asyncHandler(async (req, res) => {
    if (!req.files || req.files.length === 0) {
        res.status(400);
        throw new Error('Vui lòng chọn file để upload');
    }

    const files = req.files.map((file) => ({
        filename: file.filename,
        path: `/uploads/${file.filename}`,
        size: file.size,
    }));

    res.json({
        success: true,
        data: files,
    });
});
