import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';


export const createOrder = asyncHandler(async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('Không có sản phẩm trong đơn hàng');
    }

    const order = new Order({
        user: req.user._id,
        orderItems,
        shippingAddress,
        paymentMethod,
        totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json({
        success: true,
        data: createdOrder,
    });
});


export const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({
        createdAt: -1,
    });

    res.json({
        success: true,
        data: orders,
    });
});


export const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
        'user',
        'name email'
    );

    if (order) {
        
        if (
            order.user._id.toString() === req.user._id.toString() ||
            req.user.role === 'admin'
        ) {
            res.json({
                success: true,
                data: order,
            });
        } else {
            res.status(403);
            throw new Error('Bạn không có quyền xem đơn hàng này');
        }
    } else {
        res.status(404);
        throw new Error('Không tìm thấy đơn hàng');
    }
});


export const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address,
        };

        const updatedOrder = await order.save();

        res.json({
            success: true,
            data: updatedOrder,
        });
    } else {
        res.status(404);
        throw new Error('Không tìm thấy đơn hàng');
    }
});


export const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();

        const updatedOrder = await order.save();

        res.json({
            success: true,
            data: updatedOrder,
        });
    } else {
        res.status(404);
        throw new Error('Không tìm thấy đơn hàng');
    }
});


export const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({})
        .populate('user', 'name email')
        .sort({ createdAt: -1 });

    res.json({
        success: true,
        data: orders,
    });
});
