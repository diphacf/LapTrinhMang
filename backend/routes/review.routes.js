import express from 'express';
import {
    createReview,
    getProductReviews,
    deleteReview,
} from '../controllers/review.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();


router.post('/products/:productId/reviews', protect, createReview);
router.get('/products/:productId/reviews', getProductReviews);
router.delete('/reviews/:id', protect, deleteReview);

export default router;
