// ==================== IMPORTS ====================
// asyncHandler: Wrapper function tự động bắt lỗi cho async functions
// Thay vì viết try/catch trong mỗi middleware → asyncHandler làm giúp
import asyncHandler from 'express-async-handler';

// Import User model để query database
import User from '../models/User.js';

// Import hàm verify token
import { verifyAccessToken } from '../utils/generateToken.js';

// ==================== PROTECT MIDDLEWARE ====================
/**
 * Middleware xác thực JWT token
 * 
 * MIDDLEWARE LÀ GÌ:
 * - Function chạy GIỮA request và response
 * - Có thể modify req, res objects
 * - Gọi next() để chuyển sang middleware/handler tiếp theo
 * 
 * LUỒNG HOẠT ĐỘNG:
 * Client → protect middleware → route handler → response
 * 
 * DÙNG KHI NÀO:
 * - Routes cần authentication
 * - VD: router.get('/profile', protect, getUserProfile)
 * - Nếu no token/invalid token → 401 Unauthorized
 * - Nếu valid → next() → getUserProfile() chạy
 * 
 * EXPORT: Named export để import { protect }
 */
export const protect = asyncHandler(async (req, res, next) => {
    // asyncHandler wraps this function:
    // - Nếu có lỗi (throw Error) → tự động catch
    // - Pass error cho error handling middleware
    // - Không cần try/catch thủ công

    // ==================== KHAI BÁO BIẾN ====================
    // Khai báo biến token (let để reassign sau)
    let token;

    // ==================== KIỂM TRA AUTHORIZATION HEADER ====================
    /**
     * HTTP Authorization Header format:
     * Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     * 
     * 2 parts:
     * 1. "Bearer" - Authentication scheme
     * 2. Token string
     */
    if (
        // Điều kiện 1: req.headers.authorization tồn tại
        // - req.headers: Object chứa tất cả HTTP headers
        // - authorization: Header chứa token
        // - Nếu client không gửi header này → undefined
        req.headers.authorization &&

        // Điều kiện 2: Header bắt đầu bằng 'Bearer'
        // - .startsWith('Bearer'): Kiểm tra string prefix
        // - Đúng chuẩn Bearer token format
        // - Nếu client gửi sai format (VD: "Token abc") → false
        req.headers.authorization.startsWith('Bearer')
    ) {
        // ==================== CÓ TOKEN → XỬ LÝ ====================
        try {
            // TRY BLOCK: Bắt lỗi nếu verify thất bại

            // ==================== TÁCH TOKEN ====================
            // Header: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            // .split(' '): Tách string thành array bởi dấu space
            //   → ["Bearer", "eyJhbGci..."]
            // [1]: Lấy phần tử thứ 2 (index 1) = token string
            // Kết quả: token = "eyJhbGci..."
            token = req.headers.authorization.split(' ')[1];

            // ==================== VERIFY TOKEN ====================
            // verifyAccessToken(token): Hàm từ utils/generateToken.js
            // 
            // QUÁ TRÌNH:
            // 1. jwt.verify(token, JWT_SECRET)
            // 2. Kiểm tra signature có đúng không
            // 3. Kiểm tra token đã hết hạn chưa
            // 4. Decode payload
            // 
            // RETURN:
            // - Nếu valid: decoded = { id: 'user_id', iat: ..., exp: ... }
            // - Nếu invalid: decoded = null
            const decoded = verifyAccessToken(token);

            // ==================== KIỂM TRA DECODED ====================
            if (!decoded) {
                // Token không hợp lệ hoặc hết hạn

                // Set response status code 401 Unauthorized
                // 401: Authentication required nhưng failed
                res.status(401);

                // Throw error → asyncHandler catch → error middleware xử lý
                throw new Error('Không có quyền truy cập, token không hợp lệ');
            }

            // ==================== LẤY USER TỪ DATABASE ====================
            // Token valid → Lấy user info từ DB
            // 
            // decoded.id: User ID trong JWT payload
            // User.findById(): Mongoose method query MongoDB
            //   - Input: ObjectId
            //   - Output: User document hoặc null
            // .select('-password'): Không lấy password field
            //   - '-password': Minus sign = exclude
            //   - Bảo mật: Không bao giờ trả password (ngay cả hash)
            // 
            // req.user: Gán user vào request object
            //   - req.user sẽ available trong các middleware/handler tiếp theo
            //   - Route handler có thể dùng: req.user.email, req.user.role, etc.
            req.user = await User.findById(decoded.id).select('-password');

            // ==================== KIỂM TRA USER TỒN TẠI ====================
            if (!req.user) {
                // User ID trong token không tìm thấy trong DB
                // Có thể: User đã bị xóa nhưng token vẫn còn valid
                res.status(401);
                throw new Error('User không tồn tại');
            }

            // ==================== NEXT() ====================
            // Authen thành công → Chuyển control sang middleware/handler tiếp theo
            // next(): Express function
            //   - Gọi middleware tiếp theo trong chain
            //   - Nếu không có next() → request bị "treo"
            // 
            // Lúc này:
            // - req.user đã có data
            // - Route handler có thể dùng req.user
            next();

        } catch (error) {
            // ==================== CATCH ERRORS ====================
            // Bắt mọi lỗi trong try block:
            // - verifyAccessToken throw error
            // - User.findById throw error (DB connection issue)
            // - Manual throw Error

            res.status(401);
            throw new Error('Không có quyền truy cập, token không hợp lệ');
        }
    }

    // ==================== KHÔNG CÓ TOKEN ====================
    // Nếu if block không chạy (no Authorization header)
    if (!token) {
        res.status(401);
        throw new Error('Không có quyền truy cập, không tìm thấy token');
    }
});

// ==================== ADMIN MIDDLEWARE ====================
/**
 * Middleware kiểm tra quyền admin
 * 
 * CÁCH DÙNG:
 * - Chạy SAU protect middleware
 * - VD: router.post('/products', protect, admin, createProduct)
 * 
 * FLOW:
 * 1. protect middleware chạy → set req.user
 * 2. admin middleware chạy → check req.user.role
 * 3. Nếu admin → next() → createProduct chạy
 * 4. Nếu không phải admin → 403 Forbidden
 * 
 * TẠI SAO KHÔNG DÙNG asyncHandler:
 * - Không có async operation (await)
 * - Chỉ check simple condition
 * - Synchronous code không cần async wrapper
 */
export const admin = (req, res, next) => {
    // ==================== KIỂM TRA USER VÀ ROLE ====================
    if (
        // Điều kiện 1: req.user tồn tại
        // - protect middleware đã set req.user
        // - Nếu không có protect → req.user = undefined
        req.user &&

        // Điều kiện 2: req.user.role === 'admin'
        // - User model có enum: ['user', 'admin']
        // - Chỉ admin mới pass điều kiện này
        req.user.role === 'admin'
    ) {
        // ==================== LÀ ADMIN ====================
        // next(): Chuyển sang handler tiếp theo
        // VD: createProduct, deleteProduct, etc.
        next();
    } else {
        // ==================== KHÔNG PHẢI ADMIN ====================
        // Set status 403 Forbidden
        // 403 vs 401:
        //   - 401 Unauthorized: Chưa login hoặc token invalid
        //   - 403 Forbidden: Đã login nhưng không đủ quyền
        res.status(403);

        throw new Error('Chỉ admin mới có quyền truy cập');
    }
};
