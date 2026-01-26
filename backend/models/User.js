// ==================== IMPORTS ====================
// Import thư viện mongoose để tạo schema và model
import mongoose from 'mongoose';
// Import bcryptjs để hash và verify password
// bcrypt là thuật toán hash một chiều (không thể reverse)
import bcrypt from 'bcryptjs';

/**
 * USER SCHEMA - Định nghĩa cấu trúc của User document
 * 
 * SCHEMA LÀ GÌ:
 * - Blueprint/khuôn mẫu cho documents trong MongoDB collection
 * - Định nghĩa fields, kiểu dữ liệu, validation rules
 * - Giống table structure trong SQL nhưng linh hoạt hơn
 * 
 * TẠI SAO CẦN SCHEMA:
 * - Validate data trước khi insert vào DB
 * - Đảm bảo data consistency
 * - Auto-generate methods, hooks
 */
const userSchema = new mongoose.Schema(
    {
        // ==================== FIELD: NAME ====================
        // Tên người dùng
        name: {
            // type: Kiểu dữ liệu là String
            type: String,

            // required: Bắt buộc phải có
            // [true, 'message']: true = bắt buộc, 'message' = error message
            // Mongoose sẽ throw error nếu thiếu field này
            required: [true, 'Vui lòng nhập tên'],

            // trim: Tự động xóa khoảng trắng đầu/cuối
            // VD: "  John  " → "John"
            trim: true,

            // maxlength: Giới hạn độ dài tối đa
            // [50, 'message']: 50 ký tự, error message nếu vượt quá
            maxlength: [50, 'Tên không được quá 50 ký tự'],
        },

        // ==================== FIELD: EMAIL ====================
        email: {
            type: String,
            required: [true, 'Vui lòng nhập email'],

            // unique: Tạo unique index trong MongoDB
            // Không cho phép 2 documents có cùng email
            // MongoDB sẽ throw duplicate key error nếu trùng
            unique: true,

            // lowercase: Tự động chuyển về chữ thường
            // VD: "John@Gmail.COM" → "john@gmail.com"
            // Giúp tìm kiếm không phân biệt hoa/thường
            lowercase: true,

            trim: true,

            // match: Regex validation - kiểm tra format email
            // [/regex/, 'message']: pattern, error message
            // Pattern giải thích:
            //   ^ : bắt đầu string
            //   \w+ : một hoặc nhiều chữ/số/underscore
            //   [\.-]? : có thể có dấu . hoặc -
            //   @ : phải có @
            //   \w+ : domain name
            //   \. : dấu chấm
            //   \w{2,3} : extension 2-3 ký tự (.com, .vn)
            //   $ : kết thúc string
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Email không hợp lệ',
            ],
        },

        // ==================== FIELD: PASSWORD ====================
        password: {
            type: String,
            required: [true, 'Vui lòng nhập mật khẩu'],

            // minlength: Độ dài tối thiểu
            minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự'],

            // select: false - QUAN TRỌNG!
            // Không trả về password khi query database
            // User.find() hoặc User.findOne() sẽ KHÔNG bao gồm password
            // Để lấy password phải dùng: .select('+password')
            // LÝ DO: Bảo mật - tránh lộ password hash
            select: false,
        },

        // ==================== FIELD: ROLE ====================
        // Vai trò của user (user hoặc admin)
        role: {
            type: String,

            // enum: Chỉ cho phép một số giá trị cố định
            // Nếu gán giá trị khác → Mongoose throw error
            enum: ['user', 'admin'],

            // default: Giá trị mặc định nếu không cung cấp
            // User mới tạo sẽ có role = 'user'
            default: 'user',
        },

        // ==================== FIELD: AVATAR ====================
        // URL ảnh đại diện
        avatar: {
            type: String,

            // Default avatar nếu user không upload
            default: 'https://via.placeholder.com/150',
        },
    },
    {
        // ==================== SCHEMA OPTIONS ====================

        // timestamps: true
        // Tự động thêm 2 fields:
        //   - createdAt: Timestamp khi document được tạo
        //   - updatedAt: Timestamp khi document được update
        // Mongoose tự động quản lý 2 fields này
        timestamps: true,
    }
);

// ==================== PRE-SAVE HOOK ====================
/**
 * Middleware chạy TRƯỚC KHI save document vào database
 * 
 * CÁCH HOẠT ĐỘNG:
 * 1. User.create() hoặc user.save() được gọi
 * 2. Pre-save hook này chạy trước
 * 3. Hash password
 * 4. Sau đó mới save vào DB
 * 
 * TẠI SAO CẦN:
 * - Tự động hash password, không cần làm thủ công trong controller
 * - DRY principle: Don't Repeat Yourself
 * - Đảm bảo mọi password đều được hash
 */
userSchema.pre('save', async function (next) {
    // 'this' trong context này = document đang được save
    // VD: user object có {name, email, password, role}

    // Kiểm tra password có bị modify (thay đổi) không
    // this.isModified('password'): Mongoose method
    //   - Return true nếu password thay đổi (tạo mới hoặc update)
    //   - Return false nếu password không đổi (update name, email, etc.)
    // 
    // TẠI SAO CẦN CHECK:
    // - Khi user update profile (name, avatar), password không đổi
    // - Nếu không check → hash lại password đã hash → sai
    // - VD: Hash("$2a$10$abc") → "$2a$10$xyz" (sai hoàn toàn)
    if (!this.isModified('password')) {
        next(); // Bỏ qua hash, chuyển sang bước tiếp theo
    }

    // Generate salt - chuỗi random để hash
    // bcrypt.genSalt(rounds):
    //   - rounds = 10: Độ phức tạp (2^10 = 1024 iterations)
    //   - Càng cao càng secure nhưng càng chậm
    //   - 10 là balance tốt (OWASP recommended)
    // Salt VD: "$2a$10$eImiTXuWVxfM37uY4JANjQ"
    const salt = await bcrypt.genSalt(10);

    // Hash password với salt
    // bcrypt.hash(plaintext, salt):
    //   1. Kết hợp password + salt
    //   2. Chạy qua bcrypt algorithm nhiều rounds
    //   3. Tạo ra hash string ~60 ký tự
    // 
    // VD INPUT: password = "123456"
    // VD OUTPUT: "$2a$10$eImiTXuWVxfM37uY4JANjQ.2rT9b5z7LPBQ1QZoP"
    // 
    // Gán password đã hash vào this.password
    // → Khi save vào DB, password đã là hash (không phải plaintext)
    this.password = await bcrypt.hash(this.password, salt);

    // next() không cần gọi explicit vì async function tự resolve
});

// ==================== INSTANCE METHOD ====================
/**
 * Method để verify password khi login
 * 
 * CÁCH DÙNG:
 * const user = await User.findOne({email}).select('+password');
 * const isMatch = await user.matchPassword('123456');
 * if (isMatch) { login success }
 * 
 * TẠI SAO LÀ INSTANCE METHOD:
 * - Mỗi user document có method này
 * - Gọi trên instance: user.matchPassword()
 * - Không phải static method: User.matchPassword()
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
    // 'this' = user document instance
    // this.password = password hash trong database

    // bcrypt.compare(plaintext, hash):
    //   1. Lấy salt từ hash (phần đầu của hash string)
    //   2. Hash plaintext với salt đó
    //   3. So sánh 2 hash
    //   4. Return true nếu giống, false nếu khác
    // 
    // VD:
    // - enteredPassword: "123456" (user nhập)
    // - this.password: "$2a$10$eImiTXu..." (trong DB)
    // - bcrypt hash "123456" với salt từ DB hash
    // - So sánh kết quả → true/false
    // 
    // TẠI SAO AN TOÀN:
    // - Không thể reverse hash về plaintext
    // - Mỗi lần hash cùng password → hash khác (do salt random)
    // - Chỉ có thể verify bằng bcrypt.compare()
    return await bcrypt.compare(enteredPassword, this.password);
};

// ==================== TẠO MODEL ====================
/**
 * Tạo Mongoose Model từ Schema
 * 
 * mongoose.model(name, schema):
 *   - name: 'User' → MongoDB collection name = 'users'
 *     (Mongoose tự lowercase và pluralize)
 *   - schema: userSchema đã định nghĩa
 * 
 * Model này dùng để:
 *   - Query: User.find(), User.findOne(), User.findById()
 *   - Create: User.create(), new User().save()
 *   - Update: User.updateOne(), user.save()
 *   - Delete: User.deleteOne(), User.findByIdAndDelete()
 */
const User = mongoose.model('User', userSchema);

// ==================== EXPORT MODEL ====================
// Export để dùng trong controllers, middleware
// VD: import User from '../models/User.js'
export default User;
