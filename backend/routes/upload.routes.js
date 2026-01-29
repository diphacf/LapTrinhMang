import express from 'express';
import {
    uploadSingleImage,
    uploadMultipleImages,
} from '../controllers/upload.controller.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();


router.post('/', protect, upload.single('image'), uploadSingleImage);
router.post(
    '/multiple',
    protect,
    upload.array('images', 10),
    uploadMultipleImages
);

export default router;
