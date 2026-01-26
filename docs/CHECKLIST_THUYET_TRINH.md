# ✅ CHECKLIST CHUẨN BỊ THUYẾT TRÌNH

## 📋 TRƯỚC BUỔI THUYẾT TRÌNH (1-2 NGÀY)

### 1. Kiểm tra Code & Documentation

- [ ] Đọc lại toàn bộ code trong `backend/`
- [ ] Hiểu rõ flow của từng API endpoint
- [ ] Xem lại `BAO_CAO_DO_AN.md`
- [ ] Đọc `SLIDE_THUYET_TRINH.md`
- [ ] Review `README.md` và `QUICKSTART.md`

### 2. Chuẩn bị MongoDB

**Option A: MongoDB Atlas (Khuyến nghị)**
- [ ] Đăng nhập MongoDB Atlas
- [ ] Kiểm tra Cluster đang chạy
- [ ] Test connection string
- [ ] Xác nhận data đã được seed

**Option B: MongoDB Local**
- [ ] Cài đặt MongoDB Community Edition
- [ ] Chạy `mongod` service
- [ ] Test kết nối với Compass

### 3. Kiểm tra Environment

- [ ] File `.env` đã cấu hình đúng
- [ ] `MONGODB_URI` đúng
- [ ] `JWT_SECRET` đã set
- [ ] `PORT=5000` available

### 4. Test Backend

```bash
# Test các commands
cd d:\iphone-main\backend

# 1. Install dependencies
npm install

# 2. Seed data
npm run seed

# 3. Start server
npm run dev
```

- [ ] Server chạy thành công
- [ ] Không có lỗi
- [ ] MongoDB connected
- [ ] Port 5000 available

### 5. Chuẩn bị Demo Data

- [ ] Có ít nhất 2 products
- [ ] Có admin account: admin@iphone.com / 123456
- [ ] Có user account: user@iphone.com / 123456
- [ ] Database có orders mẫu
- [ ] Database có reviews mẫu

---

## 📋 NGÀY THUYẾT TRÌNH (BUỔI SÁNG)

### 1. Setup Máy Tính

**Đóng các ứng dụng không cần thiết:**
- [ ] Đóng browser tabs không liên quan
- [ ] Đóng chat apps (Messenger, Zalo...)
- [ ] Đóng game, music players
- [ ] Clean desktop (ẩn file không cần)

**Mở các ứng dụng cần thiết:**
- [ ] VS Code với project backend
- [ ] Terminal (PowerShell)
- [ ] Browser (Chrome/Edge)
- [ ] Thunder Client hoặc Postman
- [ ] MongoDB Compass (optional)

### 2. Kiểm tra lần cuối

**Backend:**
```bash
cd d:\iphone-main\backend
npm run dev
```

- [ ] Server running: http://localhost:5000
- [ ] Test endpoint: GET http://localhost:5000
- [ ] Kết quả: "iPhone Store API đang chạy..."

**Database:**
- [ ] Mở MongoDB Compass
- [ ] Kết nối database
- [ ] Kiểm tra collections: users, products, orders, reviews
- [ ] Đếm documents trong mỗi collection

**API Testing Tool:**
- [ ] Mở Thunder Client (trong VS Code)
- [ ] Hoặc Postman đã cài
- [ ] Prepare requests:
  - Login (admin@iphone.com)
  - Get products
  - Get orders
  - Create order

### 3. Chuẩn bị Files

**Mở sẵn các files trong VS Code:**
```
backend/
├── server.js                    ← Mở tab 1
├── models/User.js               ← Mở tab 2
├── models/Product.js            ← Mở tab 3
├── controllers/auth.controller.js ← Mở tab 4
├── routes/auth.routes.js        ← Mở tab 5
├── middleware/auth.js           ← Mở tab 6
└── .env                         ← Mở tab 7
```

**Documents:**
- [ ] Mở `BAO_CAO_DO_AN.md` trong VS Code preview
- [ ] Mở `SLIDE_THUYET_TRINH.md` trong preview
- [ ] In ra giấy (backup nếu có yêu cầu)

---

## 📋 TRONG LÚC THUYẾT TRÌNH

### Phase 1: Giới thiệu (2 phút)

**Nói:**
> "Em xin chào thầy. Hôm nay em xin trình bày đồ án về Backend API cho ứng dụng iPhone Store, sử dụng Node.js và Express framework."

**Trình chiếu:**
- [ ] Slide 1: Thông tin đồ án
- [ ] Slide 2: Công nghệ sử dụng

### Phase 2: Kiến trúc (3 phút)

**Nói:**
> "Em đã áp dụng mô hình MVC để tổ chức code..."

**Trình chiếu:**
- [ ] Slide 3: Kiến trúc hệ thống
- [ ] Show cấu trúc thư mục trong VS Code

**Demo:**
- [ ] Mở VS Code
- [ ] Explorer sidebar → show structure
- [ ] Giải thích: models, controllers, routes

### Phase 3: Database (3 phút)

**Nói:**
> "Em sử dụng MongoDB với 4 collections chính..."

**Trình chiếu:**
- [ ] Slide 4: Database design

**Demo:**
- [ ] Mở MongoDB Compass
- [ ] Show database: iphone-store
- [ ] Click vào từng collection
- [ ] Show sample documents

**Hoặc show code:**
- [ ] Mở `models/User.js`
- [ ] Explain schema
- [ ] Mở `models/Product.js`

### Phase 4: API Endpoints (4 phút)

**Nói:**
> "Hệ thống có tổng 21 API endpoints, bao gồm..."

**Trình chiếu:**
- [ ] Slide 5: Authentication & Products
- [ ] Slide 6: Orders & Reviews

**Demo code:**
- [ ] Mở `routes/auth.routes.js`
- [ ] Explain routing
- [ ] Mở `controllers/auth.controller.js`
- [ ] Explain một function (login)

### Phase 5: Bảo mật (3 phút)

**Nói:**
> "Về bảo mật, em implement JWT authentication và bcrypt..."

**Trình chiếu:**
- [ ] Slide 7: Bảo mật

**Demo code:**
- [ ] Mở `middleware/auth.js`
- [ ] Explain protect middleware
- [ ] Mở `models/User.js`
- [ ] Show bcrypt hashing

### Phase 6: DEMO LIVE API (5 phút)

**QUAN TRỌNG NHẤT!**

**Test 1: Login**
```http
POST http://localhost:5000/api/auth/login
{
  "email": "admin@iphone.com",
  "password": "123456"
}
```

- [ ] Copy request vào Thunder Client
- [ ] Click Send
- [ ] Show response với token
- [ ] Highlight accessToken

**Test 2: Get Products**
```http
GET http://localhost:5000/api/products
```

- [ ] Send request
- [ ] Show response array
- [ ] Point out rating, colors, etc.

**Test 3: Create Product (Admin)**
```http
POST http://localhost:5000/api/products
Authorization: Bearer <paste_token_here>
{
  "name": "iPhone 16 Pro",
  "price": 35000000,
  "stock": 50,
  "category": "Smartphone"
}
```

- [ ] Paste token from Test 1
- [ ] Send request
- [ ] Show 201 Created
- [ ] Switch to MongoDB Compass
- [ ] Refresh products collection
- [ ] Show new product appeared!

**Test 4: Create Product (No token = Error)**
```http
POST http://localhost:5000/api/products
(không có Authorization header)
```

- [ ] Send request
- [ ] Show 401 Unauthorized error
- [ ] Giải thích: "Đây là cơ chế bảo vệ API"

### Phase 7: Kết luận (2 phút)

**Nói:**
> "Tóm lại, em đã hoàn thành 100% mục tiêu đề ra..."

**Trình chiếu:**
- [ ] Slide 14: Kết quả đạt được
- [ ] Slide 15: Bài học
- [ ] Slide 16: Hướng phát triển

---

## 📋 Q&A - CÂU HỎI THƯỜNG GẶP

### 1. "Tại sao em chọn MongoDB thay vì MySQL?"

**Trả lời:**
> "Em chọn MongoDB vì:
> 1. Flexible schema - sản phẩm có nhiều variants (colors, sizes)
> 2. JSON format - dễ tích hợp với Node.js
> 3. Horizontal scaling tốt cho future growth
> 4. Document model phù hợp với product data"

### 2. "JWT hoạt động như thế nào?"

**Trả lời:**
> "JWT gồm 3 phần: Header, Payload, Signature
> 1. User login → Server tạo JWT với user ID
> 2. JWT được sign bằng secret key
> 3. Client lưu token
> 4. Mỗi request gửi kèm: Bearer <token>
> 5. Server verify signature để xác thực"

**Demo:**
- [ ] Mở jwt.io
- [ ] Paste một token
- [ ] Show decoded payload

### 3. "Làm sao đảm bảo password an toàn?"

**Trả lời:**
> "Em sử dụng bcrypt để hash password:
> 1. Password được hash với 10 salt rounds
> 2. Không bao giờ lưu plain text
> 3. Khi login, dùng bcrypt.compare()
> 4. Database schema: password có select: false"

**Demo:**
- [ ] Mở MongoDB Compass
- [ ] Show users collection
- [ ] Point to password field: $2a$10$...
- [ ] Explain: "Không thể reverse"

### 4. "Hệ thống xử lý lỗi như thế nào?"

**Trả lời:**
> "Em implement global error handler:
> 1. Try-catch trong controllers
> 2. Express-async-handler
> 3. Custom error messages
> 4. HTTP status codes chuẩn
> 5. Stack trace ở development mode"

**Demo:**
- [ ] Mở `middleware/error.js`
- [ ] Show errorHandler function

### 5. "Em đã test như thế nào?"

**Trả lời:**
> "Em test manual với Thunder Client:
> - 19 test cases
> - Cover all endpoints
> - Test cả success và error cases
> - Verify database changes"

**Demo:**
- [ ] Show Thunder Client history
- [ ] Show collection of requests

### 6. "Scalability - Scale hệ thống ra sao?"

**Trả lời:**
> "Để scale, có thể:
> 1. Load balancing với nhiều instances
> 2. Database replication (MongoDB replica sets)
> 3. Caching với Redis
> 4. CDN cho static files
> 5. Containerize với Docker"

### 7. "Tại sao dùng Refresh Token?"

**Trả lời:**
> "Refresh token để:
> 1. Access token có thời hạn ngắn (15 phút) = bảo mật cao
> 2. Nếu bị đánh cắp, chỉ dùng được 15 phút
> 3. Refresh token (7 ngày) để lấy access token mới
> 4. Tránh user phải login liên tục"

---

## 📋 SAU KHI THUYẾT TRÌNH

### Checklist

- [ ] Trả lời hết các câu hỏi của thầy
- [ ] Ghi nhận feedback
- [ ] Tắt server (Ctrl+C)
- [ ] Đóng MongoDB Compass
- [ ] Đóng Thunder Client
- [ ] Lưu lại presentation cho lần sau

### Backup Plan

**Nếu server không chạy:**
- [ ] Check MongoDB connection
- [ ] Restart server: `npm run dev`
- [ ] Check .env file
- [ ] Có thể show code + explain thay vì demo live

**Nếu quên password:**
- [ ] Mở `utils/seedData.js`
- [ ] Show password: "123456"
- [ ] Chạy lại: `npm run seed`

**Nếu máy chiếu không hoạt động:**
- [ ] Có bản in báo cáo
- [ ] Có thể explain trực tiếp từ laptop
- [ ] Demo vẫn chạy được

---

## 🎯 TIMELINE THUYẾT TRÌNH (20 PHÚT)

| Phút | Nội dung | Slide |
|------|----------|-------|
| 0-2 | Giới thiệu | 1-2 |
| 2-5 | Kiến trúc | 3 + VS Code |
| 5-8 | Database | 4 + Compass |
| 8-12 | API Endpoints | 5-6 + Code |
| 12-15 | Bảo mật | 7 + Code |
| 15-20 | **DEMO LIVE** | Thunder Client |
| 20-22 | Kết luận | 14-16 |
| 22-25 | Q&A | Flexible |

---

## 💡 TIPS THUYẾT TRÌNH

### Kỹ thuật

1. **Nói chậm, rõ ràng**
   - Tránh nói nhanh
   - Ngắt câu đúng chỗ
   - Nhấn mạnh keywords

2. **Eye contact**
   - Nhìn thầy khi nói
   - Không chỉ đọc slides
   - Không nhìn xuống bàn

3. **Giải thích code**
   - Point vào dòng code quan trọng
   - Explain logic, không chỉ đọc
   - Dùng ví dụ cụ thể

4. **Demo confidence**
   - Nói trước khi làm: "Em sẽ demo login API..."
   - Nói trong khi làm: "Em đang paste token..."
   - Nói sau khi làm: "Như thầy thấy, ta nhận được..."

5. **Handle errors**
   - Nếu lỗi xảy ra: "Em xin phép fix lỗi này..."
   - Explain vì sao lỗi
   - Fix calmly

### Nội dung

1. **Không đọc slides**
   - Slides chỉ là bullet points
   - Expand mỗi point khi nói

2. **Real examples**
   - Dùng "iPhone 15 Pro" thay vì "Product A"
   - Dùng số tiền thật: "28,990,000đ"

3. **Why, not just what**
   - Không chỉ nói "Em dùng JWT"
   - Mà "Em dùng JWT vì stateless, scalable, và secure"

4. **Show passion**
   - "Em rất hứng thú với..."
   - "Em gặp khó khăn nhưng đã học được..."

---

## 📸 SCREENSHOTS CẦN CÓ (BACKUP)

Nếu demo live fail, có screenshots:

1. [ ] Server running (terminal)
2. [ ] MongoDB Compass với data
3. [ ] Thunder Client - Login success
4. [ ] Thunder Client - Get products
5. [ ] Thunder Client - Create order
6. [ ] Thunder Client - 401 Unauthorized error
7. [ ] VS Code với cấu trúc thư mục

Lưu trong folder: `backend/presentation-screenshots/`

---

## ✅ FINAL CHECKLIST

**30 phút trước:**
- [ ] Máy tính charge đầy
- [ ] Wifi/Internet stable
- [ ] MongoDB running
- [ ] Backend server running
- [ ] Thunder Client ready
- [ ] VS Code opened
- [ ] Slides ready

**10 phút trước:**
- [ ] Test lại 1 lần nữa
- [ ] Login API works
- [ ] Products API works
- [ ] Hít thở sâu, calm down

**Khi bắt đầu:**
- [ ] Chào thầy lịch sự
- [ ] Giới thiệu đề tài
- [ ] Bắt đầu thuyết trình

---

**CHÚC BẠN THUYẾT TRÌNH THÀNH CÔNG! 🎉**

**Remember:**
- Calm and confident
- Know your code
- Explain clearly
- Demo works = 50% success
- Q&A prepared = 100% success

**Good luck! 🍀**
