import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Tên sản phẩm là bắt buộc'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Mô tả sản phẩm là bắt buộc'],
        },
        price: {
            type: Number,
            required: [true, 'Giá sản phẩm là bắt buộc'],
            min: 0,
        },
        colors: [
            {
                name: {
                    type: String,
                    required: true,
                },
                code: {
                    type: String,
                    required: true,
                },
                images: [String],
            },
        ],
        sizes: [
            {
                size: {
                    type: String,
                    required: true,
                },
                priceAdjustment: {
                    type: Number,
                    default: 0,
                },
            },
        ],
        specifications: {
            type: Map,
            of: String,
        },
        stock: {
            type: Number,
            required: true,
            default: 0,
        },
        category: {
            type: String,
            required: true,
            default: 'Smartphone',
        },
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        numReviews: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);


productSchema.index({ name: 'text', description: 'text' });

const Product = mongoose.model('Product', productSchema);

export default Product;
