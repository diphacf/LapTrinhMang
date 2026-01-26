# 📱 SLIDE THUYẾT TRÌNH (RÚT GỌN)
## LẬP TRÌNH MẠNG - CLIENT/SERVER MODEL

---

## SLIDE 1: GIỚI THIỆU ĐỀ TÀI

### 📋 iPhone Store (Client-Server Demo)
**Môn học:** Lập trình mạng
**Mô hình:** Client - Server (Không Database)
**Mục tiêu:**
1. Hiểu cách Client gửi Request.
2. Hiểu cách Server nhận và trả Response.
3. Thao tác Socket/HTTP cơ bản.

---

## SLIDE 2: CÔNG NGHỆ & MÔ HÌNH

### 🏗️ Kiến trúc Hệ thống

```
┌─────────────┐   HTTP (JSON)   ┌──────────────┐
│   CLIENT    │ ◄─────────────► │    SERVER    │
│ (ReactJS)   │                 │  (Node.js)   │
└─────────────┘                 └──────┬───────┘
                                       │
                                 ┌─────▼──────┐
                                 │ RAM Memory │
                                 │ Mock Data  │
                                 └────────────┘
```

**Công nghệ:**
- **Server:** Node.js + Express
- **Client:** React + Vite
- **Giao thức:** HTTP/1.1
- **Dữ liệu:** JSON (Lưu cứng trên RAM)

---

## SLIDE 3: CẤU TRÚC SERVER

Hệ thống Backend được tối giản hóa:

```
backend/
├── controllers/
│   └── product.controller.js  # Chứa Mock Data List
├── routes/
│   └── product.routes.js      # Định tuyến API
├── server.js                  # Entry Point (Port 5000)
└── package.json               # Dependencies
```

*Đã loại bỏ hoàn toàn Database, Auth, và các thư mục phức tạp.*

---

## SLIDE 4: API CHÍNH

Chỉ tập trung vào 1 chức năng chính để demo: **Lấy danh sách sản phẩm**.

**Endpoint:** `GET /api/products`

**Luồng đi (Flow):**
1. Client gửi `GET /api/products`.
2. Server đọc mảng `mockProducts` từ RAM.
3. Server trả về JSON.
4. Client nhận JSON map ra giao diện.

---

## SLIDE 5: DEMO MOCK DATA

Dữ liệu giả lập tại Server:

```javascript
const mockProducts = [
  {
    _id: "1",
    name: "iPhone 15 Pro (Server Mock)",
    price: 29990000,
    description: "Dữ liệu được gửi từ Server Node.js"
  }
];
```

=> **Chứng minh:** Client không tự sinh dữ liệu, mà phải "xin" từ Server.

---

## SLIDE 6: KẾT QUẢ ĐẠT ĐƯỢC

### ✅ Yêu cầu môn học
1. **Kết nối thành công:** Client (5173) nói chuyện được với Server (5000).
2. **Truyền tải dữ liệu:** Gói tin JSON đi qua mạng OK.
3. **Độc lập:** Hai tiến trình chạy riêng biệt.

### 🚀 Ưu điểm
- Nhanh, nhẹ, dễ cài đặt.
- Tập trung đúng trọng tâm môn mạng máy tính.
- Code trong sáng, dễ giải thích.

---

## SLIDE 7: DEMO LIVE & Q&A

**Kịch bản Demo:**
1. Start Server (`npm start`).
2. Start Client (`npm run dev`).
3. Show Web thành công.
4. Tắt Server => Web mất kết nối (Chứng minh phụ thuộc mạng).

**(Hết)**
