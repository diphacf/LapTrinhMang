// ==================== IMPORTS ====================
// Import thư viện mongoose - ODM (Object Data Modeling) cho MongoDB
// Mongoose giúp: tạo schema, validate data, query database
import mongoose from 'mongoose';

/**
 * Hàm kết nối đến MongoDB database
 * 
 * CÁCH HOẠT ĐỘNG:
 * 1. Gọi mongoose.connect() với connection string từ .env
 * 2. Nếu thành công → Log thông tin kết nối
 * 3. Nếu thất bại → Log lỗi và thoát ứng dụng
 * 
 * TẠI SAO DÙNG ASYNC/AWAIT:
 * - Kết nối database là tác vụ bất đồng bộ (không biết khi nào xong)
 * - async/await giúp code dễ đọc hơn callback hoặc .then()
 * - await: Đợi cho đến khi promise resolve mới chạy tiếp
 */
const connectDB = async () => {
    try {
        // TRY BLOCK: Bao bọc code có thể gây lỗi

        // Gọi mongoose.connect() để kết nối MongoDB
        // THAM SỐ 1: process.env.MONGODB_URI
        //   - Lấy connection string từ file .env
        //   - VD: mongodb://localhost:27017/iphone-store
        //   - Hoặc: mongodb+srv://user:pass@cluster.mongodb.net/db
        // THAM SỐ 2: Options object
        //   - useNewUrlParser: Dùng parser mới cho connection string (tránh warning)
        //   - useUnifiedTopology: Dùng engine mới để monitor servers
        // AWAIT: Đợi kết nối xong, kết quả gán vào biến 'conn'
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Log thông tin kết nối thành công
        // conn.connection.host: Địa chỉ MongoDB server
        //   VD: localhost, cluster0.mongodb.net
        // Template literal `${}`: Nhúng biến JavaScript vào string
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

        // Log tên database đang kết nối
        // conn.connection.name: Tên database (VD: iphone-store)
        console.log(`📂 Database: ${conn.connection.name}`);

    } catch (error) {
        // CATCH BLOCK: Bắt lỗi nếu try block throw error
        // error: Object chứa thông tin lỗi

        // Log error message ra console
        // error.message: Mô tả ngắn gọn lỗi
        //   VD: "connection timeout", "authentication failed"
        console.error(`❌ Error connecting to MongoDB: ${error.message}`);

        // Thoát ứng dụng với exit code 1 (báo lỗi)
        // TẠI SAO: Backend không thể hoạt động nếu không có database
        // process.exit(1): Dừng Node.js process ngay lập tức
        //   - 0: Success
        //   - 1: Error
        process.exit(1);
    }
};

// Export hàm connectDB để dùng trong file khác
// export default: Export mặc định của module
// File khác import: import connectDB from './config/db.js'
export default connectDB;
