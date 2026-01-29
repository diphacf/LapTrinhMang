import asyncHandler from 'express-async-handler';
import Review from '../models/Review.js';
import Product from '../models/Product.js';


export const createReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    const productId = req.params.productId;

    
    const product = await Product.findById(productId);

    if (!product) {
        res.status(404);
        throw new Error('Không tìm thấy sản phẩm');
    }

    
    const alreadyReviewed = await Review.findOne({
        user: req.user._id,
        product: productId,
    });

    if (alreadyReviewed) {
        res.status(400);
        throw new Error('Bạn đã đánh giá sản phẩm này rồi');
    }

    
    const review = await Review.create({
        user: req.user._id,
        product: productId,
        rating,
        comment,
    });

    
    const reviews = await Review.find({ product: productId });
    product.numReviews = reviews.length;
    product.rating =
        reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

    await product.save();

    res.status(201).json({
        success: true,
        data: review,
    });
});


export const getProductReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.find({ product: req.params.productId })
        .populate('user', 'name avatar')
        .sort({ createdAt: -1 });

    res.json({
        success: true,
        data: reviews,
    });
});


export const deleteReview = asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.id);

    if (!review) {
        res.status(404);
        throw new Error('Không tìm thấy review');
    }

    
    if (
        review.user.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin'
    ) {
        res.status(403);
        throw new Error('Bạn không có quyền xóa review này');
    }

    const productId = review.product;
    await review.deleteOne();

    
    const product = await Product.findById(productId);
    const reviews = await Review.find({ product: productId });

    product.numReviews = reviews.length;
    product.rating = reviews.length
        ? reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length
        : 0;

    await product.save();

    res.json({
        success: true,
        message: 'Xóa review thành công',
    });
});
