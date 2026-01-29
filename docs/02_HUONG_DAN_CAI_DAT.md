# Hướng Dẫn Cài Đặt và Vận Hành

## Yêu Cầu Hệ Thống

### Phần Mềm Cần Thiết
- **Node.js** >= 16.x
- **MongoDB** >= 5.x (Local hoặc MongoDB Atlas)
- **npm** hoặc **yarn**

### Kiểm Tra Phiên Bản
```bash
node --version
npm --version
mongod --version
```

## Bước 1: Cài Đặt Dependencies

### Backend
```bash
cd backend
npm install
```

Các package chính được cài đặt:
- `express` - Web framework
- `socket.io` - WebSocket server
- `mongoose` - MongoDB ORM
- `openai` - AI integration
- `multer` - File upload
- `dotenv` - Environment variables

### Frontend
```bash
cd iphone-main
npm install
```

Các package chính:
- `react` - UI library
- `socket.io-client` - WebSocket client
- `react-router-dom` - Routing

## Bước 2: Cấu Hình Environment

Tạo file `backend/.env`:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/iphone-store

# JWT Configuration
JWT_SECRET=iphone-super-secret-key-change-this-in-production-2024
JWT_EXPIRE=15m
JWT_REFRESH_SECRET=iphone-refresh-token-secret-key-2024
JWT_REFRESH_EXPIRE=7d

# Frontend URL (CORS)
CLIENT_URL=http://localhost:5173

# File Upload Configuration
MAX_FILE_SIZE=5242880

# AI Configuration
YESCALE_API_KEY=your-api-key-here
```

## Bước 3: Khởi Chạy MongoDB

### Local MongoDB
```bash
# Windows
mongod

# macOS/Linux
sudo systemctl start mongod
```

### MongoDB Atlas (Cloud)
Sử dụng connection string từ MongoDB Atlas:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/iphone-store
```

## Bước 4: Khởi Động Ứng Dụng

### Backend Server
```bash
cd backend
npm start
```

Server sẽ chạy tại: `http://localhost:5000`

### Frontend Development
```bash
cd iphone-main
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173`

## Bước 5: Truy Cập Ứng Dụng

### Vai Trò User
Truy cập: `http://localhost:5173`
- Nhập tên
- Chọn role: **User**
- Bắt đầu chat

### Vai Trò Admin
Truy cập: `http://localhost:5173`
- Nhập tên
- Chọn role: **Admin**
- Xem danh sách User và chat

## Vận Hành Trên LAN (2 Máy Tính)

### Máy 1 (Server)

1. Lấy IP của máy:
```bash
ipconfig  # Windows
ifconfig  # macOS/Linux
```

Ví dụ: `192.168.1.100`

2. Cấu hình `vite.config.js`:
```javascript
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173,
  }
})
```

3. Khởi động cả Backend và Frontend

### Máy 2 (Client)

Truy cập: `http://192.168.1.100:5173`

## Kiểm Tra Hệ Thống

### Test 1: Kết Nối MongoDB
```bash
# Trong backend terminal
curl http://localhost:5000/
```

Kết quả mong đợi: `API Server đang chạy... (Client-Server Mode)`

### Test 2: Socket.IO Connection
Mở browser console tại frontend, kiểm tra logs:
```
Socket Connected
User logged in: [username]
```

### Test 3: AI Chatbot
Gửi tin nhắn: "tư vấn mua iphone 15 pro"

Kiểm tra AI có phản hồi không.

### Test 4: MongoDB Persistence
1. Gửi tin nhắn
2. Tắt browser
3. Mở lại -> Lịch sử chat vẫn còn

## Xử Lý Lỗi Thường Gặp

### Lỗi 1: MongoDB Connection Failed
```
MongoDB Connection Error: MongoServerError
```

**Giải pháp:**
- Kiểm tra MongoDB đang chạy: `mongod`
- Kiểm tra `MONGODB_URI` trong `.env`

### Lỗi 2: Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Giải pháp:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID [PID] /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

### Lỗi 3: AI API Error
```
AI Service Error: 401 Unauthorized
```

**Giải pháp:**
- Kiểm tra `YESCALE_API_KEY` trong `.env`
- Đảm bảo API key còn hạn

### Lỗi 4: CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```

**Giải pháp:**
- Kiểm tra `CLIENT_URL` trong `.env`
- Đảm bảo frontend URL khớp với cấu hình CORS

## Production Deployment

### Build Frontend
```bash
cd iphone-main
npm run build
```

### Serve Static Files
Cập nhật `server.js`:
```javascript
app.use(express.static(path.join(__dirname, '../iphone-main/dist')));
```

### Start Production Server
```bash
NODE_ENV=production npm start
```

## Bảo Trì

### Backup Database
```bash
mongodump --db iphone-store --out ./backup
```

### Restore Database
```bash
mongorestore --db iphone-store ./backup/iphone-store
```

### View Logs
Server logs xuất hiện tại terminal khi chạy `npm start`

### Clear Uploaded Files
```bash
rm -rf backend/uploads/*
```
