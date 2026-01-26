// ==================== IMPORTS ====================
// Import thư viện jsonwebtoken để tạo và verify JWT
// JWT = JSON Web Token: Token để authentication
import jwt from 'jsonwebtoken';

// ==================== GENERATE ACCESS TOKEN ====================
/**
 * Hàm tạo Access Token (JWT)
 * 
 * JWT LÀ GÌ:
 * - JSON Web Token: Token chứa thông tin được mã hóa
 * - Format: header.payload.signature (3 phần, ngăn cách bởi dấu chấm)
 * - VD: eyJhbGci...eyJpZCI6...SflKxw (base64 encoded)
 * 
 * ACCESS TOKEN:
 * - Thời hạn ngắn (15 phút)
 * - Dùng cho mỗi API request
 * - Nếu bị đánh cắp → chỉ dùng được 15 phút
 * 
 * @param {String} userId - MongoDB ObjectId của user
 * @returns {String} JWT access token
 */
export const generateAccessToken = (userId) => {
    // jwt.sign() - Tạo JWT token
    // 
    // THAM SỐ 1: Payload (data muốn encode)
    //   { id: userId }: Object chứa user ID
    //   Payload này sẽ được encode → có thể decode ra
    //   KHÔNG NÊN: Chứa password, sensitive data
    //   NÊN: Chứa user ID, role (non-sensitive)
    // 
    // THAM SỐ 2: Secret key
    //   process.env.JWT_SECRET: Lấy từ file .env
    //   VD: "iphone-super-secret-key-2024"
    //   Secret này dùng để "ký" (sign) token
    //   Chỉ ai có secret mới verify được token
    //   QUAN TRỌNG: Giữ bí mật, không share
    // 
    // THAM SỐ 3: Options
    //   expiresIn: Thời gian hết hạn
    //   process.env.JWT_EXPIRE = '15m'
    //   Formats hợp lệ: '15m', '1h', '7d', '2y'
    //   Sau thời gian này token không còn valid
    // 
    // RETURN: JWT string
    //   VD: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NmMxZDAzOGQ3ZjRlMDAxMjM0NTY3OCIsImlhdCI6MTcwNDA2NzIwMCwiZXhwIjoxNzA0MDY4MTAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
    return jwt.sign(
        { id: userId },                          // Payload
        process.env.JWT_SECRET,                  // Secret
        { expiresIn: process.env.JWT_EXPIRE }   // Options
    );
};

// ==================== GENERATE REFRESH TOKEN ====================
/**
 * Hàm tạo Refresh Token
 * 
 * REFRESH TOKEN:
 * - Thời hạn dài (7 ngày)
 * - Dùng để lấy access token mới khi hết hạn
 * - Lưu an toàn hơn (httpOnly cookie hoặc secure storage)
 * 
 * TẠI SAO CẦN 2 TOKENS:
 * - Access token ngắn → Secure (nếu bị đánh cắp, 15 phút sau vô dụng)
 * - Refresh token dài → UX tốt (user không cần login lại liên tục)
 * - Balance giữa security và user experience
 * 
 * @param {String} userId - MongoDB ObjectId
 * @returns {String} JWT refresh token
 */
export const generateRefreshToken = (userId) => {
    // Tương tự generateAccessToken nhưg:
    // 1. Dùng secret khác (JWT_REFRESH_SECRET)
    //    - Nếu access secret bị lộ → refresh vẫn an toàn
    //    - Tách biệt 2 loại token
    // 2. Thời hạn dài hơn (7 ngày)
    //    - process.env.JWT_REFRESH_EXPIRE = '7d'
    return jwt.sign(
        { id: userId },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRE }
    );
};

// ==================== VERIFY ACCESS TOKEN ====================
/**
 * Hàm verify và decode Access Token
 * 
 * CÁCH HOẠT ĐỘNG:
 * 1. Client gửi token trong Authorization header
 * 2. Server gọi verifyAccessToken(token)
 * 3. jwt.verify() kiểm tra:
 *    a) Signature có đúng không (dùng JWT_SECRET)
 *    b) Token đã hết hạn chưa (check exp field)
 * 4. Nếu valid → Return decoded payload
 * 5. Nếu invalid → Throw error → Catch → Return null
 * 
 * @param {String} token - JWT string từ client
 * @returns {Object|null} Decoded payload hoặc null nếu invalid
 */
export const verifyAccessToken = (token) => {
    try {
        // TRY BLOCK: Wrap code có thể throw error

        // jwt.verify(token, secret) - Verify và decode JWT
        // 
        // QUÁ TRÌNH VERIFY:
        // 1. Tách token thành 3 phần: header, payload, signature
        // 2. Decode header và payload (base64)
        // 3. Tính signature từ header + payload + secret
        // 4. So sánh signature:
        //    - Signature trong token: Được tạo bằng JWT_SECRET lúc sign
        //    - Signature tính toán: Dùng JWT_SECRET hiện tại
        //    - Nếu khác nhau → Token bị sửa đổi → Invalid
        // 5. Kiểm tra expiration:
        //    - Lấy 'exp' từ payload
        //    - So sánh với current timestamp
        //    - Nếu exp < now → Token hết hạn → Throw error
        // 
        // DECODED PAYLOAD FORMAT:
        // {
        //   id: "676c1d0e8d7f4e0012345678",  // User ID ta đã sign
        //   iat: 1704067200,                 // Issued At (timestamp)
        //   exp: 1704068100                  // Expiration (timestamp)
        // }
        // 
        // Return decoded payload nếu verify thành công
        return jwt.verify(token, process.env.JWT_SECRET);

    } catch (error) {
        // CATCH BLOCK: Bắt lỗi nếu verify thất bại
        // 
        // NGUYÊN NHÂN THẤT BẠI:
        // 1. Token bị sửa đổi (signature không match)
        // 2. Token hết hạn (exp < current time)
        // 3. Token có format sai (không phải JWT)
        // 4. Secret key sai
        // 
        // TẠI SAO RETURN NULL:
        // - Không throw error lên trên
        // - Middleware sẽ check null và response 401
        // - Code dễ đọc: if (!decoded) { unauthorized }
        return null;
    }
};

// ==================== VERIFY REFRESH TOKEN ====================
/**
 * Hàm verify Refresh Token
 * 
 * GIỐNG verifyAccessToken NHƯNG:
 * - Dùng JWT_REFRESH_SECRET thay vì JWT_SECRET
 * - Check expiration với 7 ngày thay vì 15 phút
 * 
 * DÙNG KHI NÀO:
 * - Client gọi POST /api/auth/refresh
 * - Body: { refreshToken: "eyJhbG..." }
 * - Server verify refresh token
 * - Nếu valid → Generate access token mới
 * - Nếu invalid → Yêu cầu login lại
 */
export const verifyRefreshToken = (token) => {
    try {
        // Verify với JWT_REFRESH_SECRET
        return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
        return null;
    }
};
