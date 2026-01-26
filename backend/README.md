# 📱 iPhone Store Backend API

Backend API cho ứng dụng iPhone Store - Bài tập Lập trình mạng

## 🛠️ Công nghệ sử dụng

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload

## 📋 Yêu cầu hệ thống

- Node.js v16 trở lên
- MongoDB (Local hoặc MongoDB Atlas)
- npm hoặc yarn

## 🚀 Cài đặt

### 1. Cài đặt dependencies

```bash
cd backend
npm install
```

### 2. Cấu hình environment variables

Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

Sửa các giá trị trong `.env`:

```env
NODE_ENV=development
PORT=5000

# MongoDB URI
# Local: mongodb://localhost:27017/iphone-store
# Atlas: mongodb+srv://<username>:<password>@cluster.mongodb.net/iphone-store
MONGODB_URI=mongodb://localhost:27017/iphone-store

JWT_SECRET=iphone-super-secret-key-change-this-in-production-2024
JWT_EXPIRE=15m
JWT_REFRESH_SECRET=iphone-refresh-token-secret-key-2024
JWT_REFRESH_EXPIRE=7d

CLIENT_URL=http://localhost:5173
MAX_FILE_SIZE=5242880
```

### 3. Cài đặt MongoDB

**Option 1: MongoDB Local**

- Download và cài đặt: https://www.mongodb.com/try/download/community
- Chạy MongoDB: `mongod`

**Option 2: MongoDB Atlas (Cloud - Khuyến nghị)**

1. Đăng ký tài khoản: https://www.mongodb.com/cloud/atlas/register
2. Tạo cluster miễn phí
3. Lấy connection string và thay vào `MONGODB_URI`

### 4. Seed dữ liệu mẫu

```bash
npm run seed
```

Dữ liệu mẫu bao gồm:
- **Admin**: admin@iphone.com / 123456
- **User**: user@iphone.com / 123456
- 2 sản phẩm iPhone

### 5. Chạy server

```bash
# Development mode (với nodemon)
npm run dev

# Production mode
npm start
```

Server sẽ chạy tại: http://localhost:5000

## 📚 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Đăng ký user mới | Public |
| POST | `/api/auth/login` | Đăng nhập | Public |
| POST | `/api/auth/refresh` | Refresh access token | Public |
| GET | `/api/auth/me` | Lấy thông tin user | Private |
| POST | `/api/auth/logout` | Đăng xuất | Private |

### Products

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/products` | Lấy tất cả sản phẩm | Public |
| GET | `/api/products/:id` | Lấy chi tiết sản phẩm | Public |
| POST | `/api/products` | Tạo sản phẩm mới | Admin |
| PUT | `/api/products/:id` | Cập nhật sản phẩm | Admin |
| DELETE | `/api/products/:id` | Xóa sản phẩm | Admin |

### Orders

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/orders` | Tạo đơn hàng | Private |
| GET | `/api/orders/my` | Lấy orders của user | Private |
| GET | `/api/orders/:id` | Chi tiết order | Private |
| PUT | `/api/orders/:id/pay` | Cập nhật thanh toán | Private |
| GET | `/api/orders` | Lấy tất cả orders | Admin |
| PUT | `/api/orders/:id/deliver` | Cập nhật giao hàng | Admin |

### Reviews

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/products/:productId/reviews` | Tạo review | Private |
| GET | `/api/products/:productId/reviews` | Lấy reviews | Public |
| DELETE | `/api/reviews/:id` | Xóa review | Private/Admin |

### Upload

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/upload` | Upload 1 ảnh | Private |
| POST | `/api/upload/multiple` | Upload nhiều ảnh | Private |

## 📝 Ví dụ sử dụng API

### 1. Đăng ký user mới

```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Nguyễn Văn B",
  "email": "user2@iphone.com",
  "password": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Nguyễn Văn B",
    "email": "user2@iphone.com",
    "role": "user",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Đăng nhập

```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@iphone.com",
  "password": "123456"
}
```

### 3. Lấy danh sách sản phẩm

```bash
GET http://localhost:5000/api/products?page=1&keyword=Pro
```

### 4. Tạo đơn hàng

```bash
POST http://localhost:5000/api/orders
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "orderItems": [
    {
      "product": "product_id",
      "name": "iPhone 15 Pro",
      "color": "Blue Titanium",
      "size": "6.1 inch",
      "quantity": 1,
      "price": 28990000,
      "image": "/assets/images/blue.jpg"
    }
  ],
  "shippingAddress": {
    "address": "123 Nguyễn Huệ",
    "city": "TP.HCM",
    "postalCode": "700000",
    "country": "Vietnam"
  },
  "paymentMethod": "COD",
  "totalPrice": 28990000
}
```

### 5. Upload ảnh

```bash
POST http://localhost:5000/api/upload
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

image: [file]
```

## 🗂️ Cấu trúc thư mục

```
backend/
├── config/
│   └── db.js                 # Database connection
├── controllers/
│   ├── auth.controller.js    # Authentication logic
│   ├── product.controller.js # Product logic
│   ├── order.controller.js   # Order logic
│   ├── review.controller.js  # Review logic
│   └── upload.controller.js  # Upload logic
├── middleware/
│   ├── auth.js              # JWT authentication
│   ├── error.js             # Error handling
│   └── upload.js            # File upload config
├── models/
│   ├── User.js              # User schema
│   ├── Product.js           # Product schema
│   ├── Order.js             # Order schema
│   └── Review.js            # Review schema
├── routes/
│   ├── auth.routes.js       # Auth routes
│   ├── product.routes.js    # Product routes
│   ├── order.routes.js      # Order routes
│   ├── review.routes.js     # Review routes
│   └── upload.routes.js     # Upload routes
├── utils/
│   ├── generateToken.js     # JWT utilities
│   └── seedData.js          # Seed script
├── uploads/                 # Uploaded files
├── .env                     # Environment variables
├── .env.example             # Env template
├── .gitignore
├── package.json
├── server.js                # Entry point
└── README.md
```

## 🔐 Authentication

API sử dụng JWT (JSON Web Tokens) cho authentication:

1. **Access Token**: Thời hạn 15 phút, dùng cho các request
2. **Refresh Token**: Thời hạn 7 ngày, dùng để lấy access token mới

### Sử dụng:

```javascript
// Headers cho protected routes
Authorization: Bearer <access_token>
```

### Refresh token khi hết hạn:

```bash
POST /api/auth/refresh
{
  "refreshToken": "your_refresh_token"
}
```

## 🧪 Testing với Thunder Client / Postman

1. Import collection từ file `docs/API.md`
2. Tạo environment variables:
   - `base_url`: http://localhost:5000
   - `access_token`: [token từ login]

## ⚠️ Lưu ý quan trọng

1. **Environment Variables**: Không commit file `.env` lên git
2. **JWT Secret**: Đổi `JWT_SECRET` trong production
3. **MongoDB**: Sử dụng MongoDB Atlas cho production
4. **File Upload**: Thư mục `uploads/` được tạo tự động
5. **CORS**: Đã cấu hình cho `http://localhost:5173` (frontend)

## 🐛 Troubleshooting

### Lỗi kết nối MongoDB

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Giải pháp**: 
- Kiểm tra MongoDB đã chạy chưa: `mongod`
- Hoặc dùng MongoDB Atlas

### Lỗi JWT

```
Error: Không có quyền truy cập, token không hợp lệ
```

**Giải pháp**: 
- Kiểm tra token có đúng format: `Bearer <token>`
- Token có thể đã hết hạn, dùng refresh token

### Lỗi CORS

```
Access to fetch at 'http://localhost:5000' from origin 'http://localhost:5173' has been blocked by CORS
```

**Giải pháp**: 
- Kiểm tra `CLIENT_URL` trong `.env`
- Restart server sau khi đổi env variables

## 📖 Tài liệu tham khảo

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT.io](https://jwt.io/)

## 👨‍💻 Scripts

```bash
# Chạy development server
npm run dev

# Chạy production server
npm start

# Import dữ liệu mẫu
npm run seed

# Xóa tất cả dữ liệu
npm run seed -- -d
```

## 📞 Hỗ trợ

Nếu gặp vấn đề, hãy kiểm tra:
1. MongoDB đã chạy chưa
2. Environment variables đã đúng chưa
3. Dependencies đã cài đặt đầy đủ chưa
4. Port 5000 có bị chiếm chưa

---

**Lưu ý**: Đây là project học tập cho môn Lập trình mạng. Không dùng cho production mà không có thêm security measures.

**Made with ❤️ for Network Programming Course**
