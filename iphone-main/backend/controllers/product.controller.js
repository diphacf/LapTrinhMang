import asyncHandler from 'express-async-handler';

const mockProducts = [
    {
        _id: '1',
        name: 'iPhone 15 Pro (DỮ LIỆU TỪ SERVER)',
        description: 'Client đã kết nối thành công tới Server',
        price: 29990000,
        category: 'Smartphone',
        stock: 10,
        colors: [{ name: 'Titan Tự Nhiên', code: '#d4c5b0' }],
        sizes: [{ size: '256GB' }],
        specifications: { "Chip": "A17 Pro" }
    },
    {
        _id: '2',
        name: 'iPhone 14 Plus (Network Test)',
        description: 'Connection Established: 200 OK',
        price: 21990000,
        category: 'Smartphone',
        stock: 5,
        colors: [{ name: 'Xanh Dương', code: '#a0b4c8' }],
        sizes: [{ size: '128GB' }],
        specifications: { "Chip": "A15 Bionic" }
    }
];

export const getProducts = asyncHandler(async (req, res) => {
    console.log(` [${new Date().toLocaleTimeString()}] Client đang gọi API lấy danh sách sản phẩm...`);

    setTimeout(() => {
        res.json({
            success: true,
            data: mockProducts,
            page: 1,
            pages: 1,
            total: mockProducts.length,
        });
    }, 300);
});

export const getProductById = asyncHandler(async (req, res) => {
    const product = mockProducts.find(p => p._id === req.params.id);

    if (product) {
        res.json({
            success: true,
            data: product,
        });
    } else {
        res.status(404);
        throw new Error('Không tìm thấy sản phẩm (Mock Data)');
    }
});
