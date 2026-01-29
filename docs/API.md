# 📚 API Documentation - iPhone Store (Client-Server Demo)

Hệ thống rút gọn để demo cơ chế Client-Server trong môn Lập Trình Mạng.

## Base URL
```
http://localhost:5000/api
```

---

## 📱 Products API

### 1. Get All Products
**Mô tả**: Server trả về danh sách sản phẩm từ Mock Data (RAM).

**Endpoint:** `GET /products`

**Request:**
- Method: `GET`
- Header: Không yêu cầu

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "1",
      "name": "iPhone 15 Pro (Server Mock)",
      "description": "Dữ liệu từ RAM Server, không cần MongoDB.",
      "price": 29990000,
      "category": "Smartphone",
      "stock": 10,
      "colors": [
        { "name": "Titan Tự Nhiên", "code": "#d4c5b0" }
      ],
      "sizes": [
        { "size": "256GB" }
      ],
      "specifications": { "Chip": "A17 Pro" }
    }
    // ... thêm sản phẩm khác
  ],
  "page": 1,
  "total": 2
}
```

### 2. Get Product by ID
**Mô tả**: Lấy chi tiết 1 sản phẩm cụ thể.

**Endpoint:** `GET /products/:id`

**Example:** `GET /products/1`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "1",
    "name": "iPhone 15 Pro (Server Mock)",
    "price": 29990000,
    // ... chi tiết khác
  }
}
```

**Response (404 Not Found):**
```json
{
  "message": "Không tìm thấy sản phẩm (Mock Data)"
}
```

---

## 🧪 Testing

Bạn có thể test bằng trình duyệt hoặc Thunder Client:

1. Mở Browser: [http://localhost:5000/api/products](http://localhost:5000/api/products)
2. Kết quả: Thấy chuỗi JSON trả về.
