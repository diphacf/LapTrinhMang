import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} from '../utils/generateToken.js';


export const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('Email đã được sử dụng');
    }

    
    const user = await User.create({
        name,
        email,
        password,
    });

    if (user) {
        res.status(201).json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                accessToken: generateAccessToken(user._id),
                refreshToken: generateRefreshToken(user._id),
            },
        });
    } else {
        res.status(400);
        throw new Error('Dữ liệu không hợp lệ');
    }
});


export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
        res.json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                accessToken: generateAccessToken(user._id),
                refreshToken: generateRefreshToken(user._id),
            },
        });
    } else {
        res.status(401);
        throw new Error('Email hoặc mật khẩu không đúng');
    }
});


export const refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        res.status(400);
        throw new Error('Refresh token là bắt buộc');
    }

    
    const decoded = verifyRefreshToken(refreshToken);

    if (!decoded) {
        res.status(401);
        throw new Error('Refresh token không hợp lệ hoặc đã hết hạn');
    }

    
    const newAccessToken = generateAccessToken(decoded.id);

    res.json({
        success: true,
        data: {
            accessToken: newAccessToken,
        },
    });
});


export const getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    res.json({
        success: true,
        data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            createdAt: user.createdAt,
        },
    });
});


export const logout = asyncHandler(async (req, res) => {
    
    
    res.json({
        success: true,
        message: 'Đăng xuất thành công',
    });
});
