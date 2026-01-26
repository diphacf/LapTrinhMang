import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Product',
        },
        rating: {
            type: Number,
            required: [true, 'Vui lòng đánh giá sản phẩm'],
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            required: [true, 'Vui lòng viết nhận xét'],
            maxlength: [500, 'Nhận xét không được quá 500 ký tự'],
        },
    },
    {
        timestamps: true,
    }
);


reviewSchema.index({ user: 1, product: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);

export default Review;
