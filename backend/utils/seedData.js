import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Review from '../models/Review.js';

dotenv.config();


const users = [
    {
        name: 'Admin User',
        email: 'admin@iphone.com',
        password: '123456',
        role: 'admin',
    },
    {
        name: 'Nguyễn Văn A',
        email: 'user@iphone.com',
        password: '123456',
        role: 'user',
    },
];


const products = [
    {
        name: 'iPhone 15 Pro',
        description:
            'iPhone 15 Pro với chip A17 Pro mạnh mẽ, camera tiên tiến và thiết kế Titanium cao cấp.',
        price: 28990000,
        colors: [
            {
                name: 'Natural Titanium',
                code: '#8F8A81',
                images: [
                    '/assets/images/yellow.jpg',
                    '/assets/images/yellow-2.jpg',
                ],
            },
            {
                name: 'Blue Titanium',
                code: '#53596E',
                images: ['/assets/images/blue.jpg', '/assets/images/blue-2.jpg'],
            },
            {
                name: 'White Titanium',
                code: '#C9C8C2',
                images: ['/assets/images/white.jpg', '/assets/images/white-2.jpg'],
            },
            {
                name: 'Black Titanium',
                code: '#454749',
                images: ['/assets/images/black.jpg', '/assets/images/black-2.jpg'],
            },
        ],
        sizes: [
            {
                size: '6.1 inch',
                priceAdjustment: 0,
            },
            {
                size: '6.7 inch (Pro Max)',
                priceAdjustment: 5000000,
            },
        ],
        specifications: {
            chip: 'A17 Pro',
            camera: '48MP Main | Ultra Wide | Telephoto',
            display: 'Super Retina XDR display',
            battery: 'Up to 29 hours video playback',
            storage: '128GB / 256GB / 512GB / 1TB',
        },
        stock: 50,
        category: 'Smartphone',
        rating: 4.8,
        numReviews: 12,
    },
    {
        name: 'iPhone 15',
        description:
            'iPhone 15 với Dynamic Island, camera 48MP và thiết kế màu sắc rực rỡ.',
        price: 22990000,
        colors: [
            {
                name: 'Pink',
                code: '#F7C8D9',
                images: ['/assets/images/pink.jpg'],
            },
            {
                name: 'Blue',
                code: '#A7C7E7',
                images: ['/assets/images/blue.jpg'],
            },
            {
                name: 'Green',
                code: '#B4E7CE',
                images: ['/assets/images/green.jpg'],
            },
        ],
        sizes: [
            {
                size: '6.1 inch',
                priceAdjustment: 0,
            },
            {
                size: '6.7 inch (Plus)',
                priceAdjustment: 3000000,
            },
        ],
        specifications: {
            chip: 'A16 Bionic',
            camera: '48MP Main | Ultra Wide',
            display: 'Super Retina XDR display',
            battery: 'Up to 26 hours video playback',
            storage: '128GB / 256GB / 512GB',
        },
        stock: 100,
        category: 'Smartphone',
        rating: 4.5,
        numReviews: 8,
    },
];

const importData = async () => {
    try {
        await connectDB();

        
        await User.deleteMany();
        await Product.deleteMany();
        await Order.deleteMany();
        await Review.deleteMany();

        console.log('✅ Đã xóa dữ liệu cũ');

        
        const createdUsers = await User.insertMany(users);
        console.log('✅ Đã thêm users');

        
        const createdProducts = await Product.insertMany(products);
        console.log('✅ Đã thêm products');

        console.log('\n🎉 Import dữ liệu thành công!\n');
        console.log('📧 Admin: admin@iphone.com / 123456');
        console.log('📧 User: user@iphone.com / 123456\n');

        process.exit();
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await connectDB();

        await User.deleteMany();
        await Product.deleteMany();
        await Order.deleteMany();
        await Review.deleteMany();

        console.log('✅ Đã xóa tất cả dữ liệu!');
        process.exit();
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
};


if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
