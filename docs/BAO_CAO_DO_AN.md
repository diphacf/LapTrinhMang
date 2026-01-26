# 📱 BÁO CÁO ĐỒ ÁN
## HỆ THỐNG CLIENT-SERVER CHO ỨNG DỤNG IPHONE STORE

---

### 📋 THÔNG TIN ĐỒ ÁN

**Tên đồ án:** Xây dựng mô hình Client-Server cho ứng dụng iPhone Store  
**Môn học:** Lập trình mạng  
**Năm học:** 2024-2025  

---

## MỤC LỤC

1. [Tổng quan](#1-tổng-quan)
2. [Công nghệ & Mô hình](#2-công-nghệ--mô-hình)
3. [Thiết kế Dữ liệu (Mock Data)](#3-thiết-kế-dữ-liệu-mock-data)
4. [Giao tiếp API](#4-giao-tiếp-api)
5. [Hướng dẫn Cài đặt](#5-hướng-dẫn-cài-đặt)
6. [Kết luận](#6-kết-luận)

---

## 1. TỔNG QUAN

### 1.1. Mục tiêu
Đồ án này tập trung vào việc minh họa và xây dựng một hệ thống **Client-Server** cơ bản, là nền tảng của Lập trình mạng. 
Mục tiêu cốt lõi là chứng minh được hai tiến trình độc lập (Client và Server) có thể trao đổi dữ liệu với nhau thông qua giao thức mạng (HTTP).

### 1.2. Phạm vi rút gọn
Để tập trung vào bản chất giao tiếp mạng, hệ thống đã lược bỏ các thành phần không cần thiết cho môn học này như: Database, Authentication, Upload file.

---

## 2. CÔNG NGHỆ & MÔ HÌNH

### 2.1. Kiến trúc Hệ thống

Hệ thống hoạt động theo mô hình Client-Server truyền thống:

```
┌─────────────┐   HTTP Request  ┌──────────────┐
│   CLIENT    │ ◄─────────────► │    SERVER    │
│ (Frontend)  │   JSON Resp     │  (Backend)   │
└─────────────┘                 └──────┬───────┘
                                       │
                                 ┌─────▼──────┐
                                 │ RAM Memory │
                                 │ Mock Data  │
                                 └────────────┘
```

1.  **Client (Frontend)**: Giao diện người dùng, gửi yêu cầu lấy dữ liệu.
2.  **Server (Backend)**: Lắng nghe yêu cầu, xử lý và trả về dữ liệu mẫu (Mock Data).

### 2.2. Công nghệ sử dụng

| Thành phần | Công nghệ | Vai trò |
|------------|----------|---------|
| **Server** | Node.js + Express | Tạo HTTP Server, xử lý Request |
| **Client** | React + Vite | Hiển thị dữ liệu lên giao diện |
| **Giao thức** | HTTP/1.1 | Chuẩn giao tiếp |
| **Format** | JSON | Định dạng dữ liệu trao đổi |

### 2.3. Cấu trúc Thư mục (Server)

```
backend/
├── controllers/
│   └── product.controller.js  # Chứa dữ liệu giả và logic trả về
├── routes/
│   └── product.routes.js      # Định nghĩa các API Endpoint
├── server.js                  # File chính khởi chạy Server (Port 5000)
└── package.json               # Khai báo thư viện
```

---

## 3. THIẾT KẾ DỮ LIỆU (MOCK DATA)

Do không dùng Database, dữ liệu được lưu cứng (Hardcoded) ngay trong code của Server (`product.controller.js`).

**Cấu trúc một đối tượng Sản Phẩm:**

```javascript
{
  _id: "1",
  name: "iPhone 15 Pro",
  price: 29990000,
  description: "Dữ liệu server trả về",
  stock: 10
}
```

---

## 4. GIAO TIẾP API

Hệ thống cung cấp 01 API chính để demo khả năng kết nối:

### 4.1. Get All Products

*   **URL:** `http://localhost:5000/api/products`
*   **Method:** `GET`
*   **Mô tả:** Lấy danh sách sản phẩm từ Server.

**Quy trình xử lý:**
1.  Client gọi API.
2.  Server nhận yêu cầu.
3.  Server đọc biến `mockProducts` từ RAM.
4.  Server giả lập độ trễ mạng (300ms).
5.  Server trả về JSON cho Client.

---

## 5. HƯỚNG DẪN CÀI ĐẶT

### Bước 1: Khởi chạy Server (Backend)

```bash
cd backend
npm start
```
*Server sẽ chạy tại http://localhost:5000*

### Bước 2: Khởi chạy Client (Frontend)

Mở terminal mới:
```bash
cd iphone-main
npm run dev
```
*Client sẽ chạy tại http://localhost:5173*

### Bước 3: Kiểm tra
Truy cập trình duyệt để thấy danh sách sản phẩm hiển thị -> **Chứng tỏ kết nối thành công.**

---

## 6. KẾT LUẬN

Đồ án đã hoàn thành yêu cầu của môn **Lập trình mạng**:
1.  Hiểu và cài đặt được Socket lắng nghe (Server).
2.  Thiết lập được kết nối từ Client.
3.  Truyền tải thành công cấu trúc dữ liệu qua mạng.
4.  Hệ thống chạy ổn định, nhanh và nhẹ.

---
**CẢM ƠN THẦY ĐÃ XEM BÁO CÁO!**
