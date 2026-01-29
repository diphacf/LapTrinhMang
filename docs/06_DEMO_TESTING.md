# Kịch Bản Demo & Testing

## Demo Flow cho Báo Cáo

### Chuẩn Bị
1. Mở 2 cửa sổ trình duyệt:
   - **Tab 1**: User (Chrome)
   - **Tab 2**: Admin (Firefox/Incognito Chrome)

2. Mở MongoDB Compass để xem real-time data

3. Mở VS Code terminal để xem server logs

---

## Kịch Bản 1: Basic Chat Flow

### Bước 1: User Login
**Tab 1 (User):**
```
1. Truy cập http://localhost:5173
2. Nhập tên: "Khách hàng A"
3. Chọn role: User
4. Click "Bắt đầu chat"
```

**Kết quả mong đợi:**
- Hiện greeting message từ bot
- Server log: "User Connected: [socket-id]"

---

### Bước 2: Admin Login
**Tab 2 (Admin):**
```
1. Truy cập http://localhost:5173
2. Nhập tên: "Nhân viên B"
3. Chọn role: Admin
4. Click "Bắt đầu chat"
```

**Kết quả mong đợi:**
- Bên trái hiện danh sách "Khách hàng A"
- Có dấu chấm xanh (online)

---

### Bước 3: User Gửi Tin Nhắn
**Tab 1 (User):**
```
Gửi: "Xin chào, tôi cần tư vấn"
```

**Kết quả mong đợi:**
- **User side**: Tin nhắn hiện bên phải (màu xanh)
- **Admin side**: 
  - Danh sách User có notification dot (màu đỏ)
  - Tin nhắn hiện bên trái khi click vào User
- **MongoDB**: Record mới trong collection `messages`
- **Server log**: "Client Khách hàng A says: Xin chào..."

---

### Bước 4: Admin Trả Lời
**Tab 2 (Admin):**
```
Click vào "Khách hàng A" -> Gửi: "Chào bạn, tôi có thể giúp gì?"
```

**Kết quả mong đợi:**
- **Admin side**: Tin nhắn bên phải (màu xanh)
- **User side**: Tin nhắn từ "Nhân viên B" hiện bên trái
- **MongoDB**: Record mới
- Notification dot biến mất

---

## Kịch Bản 2: AI Auto-Reply

### Bước 1: Trigger AI với Keyword
**Tab 1 (User):**
```
Gửi: "tư vấn mua iphone 15 pro"
```

**Kết quả mong đợi:**
- Sau 1-2 giây, AI phản hồi tự động
- Message từ "Apple Assistant" với icon AI
- **Server log**: "AI Chat Request: { message: '...' }"
- **MongoDB**: 2 records (1 từ user, 1 từ AI)

---

### Bước 2: Multiple Keywords
**Tab 1 (User):**
```
Gửi: "Giá iPhone 14 bao nhiêu?"
```

**Kết quả:** AI phản hồi về giá cả

```
Gửi: "Tôi muốn xem review"
```

**Kết quả:** AI phản hồi review

---

## Kịch Bản 3: Persistence Test

### Test Chat History
1. **User gửi vài tin nhắn**
2. **Tắt browser (Ctrl+W)**
3. **Mở lại và login với cùng username**

**Kết quả mong đợi:**
- Toàn bộ lịch sử chat hiện lại
- Tin nhắn cũ vẫn còn

---

### Test Multiple Users
1. **Mở Tab 3**: User "Khách hàng C"
2. **Gửi tin nhắn**
3. **Quay lại Tab 2 (Admin)**

**Kết quả mong đợi:**
- Danh sách có 2 users
- Click từng user để xem chat riêng
- Mỗi user có lịch sử riêng biệt

---

## Kịch Bản 4: File Upload

### Upload Image
**Tab 1 (User):**
```
1. Click icon đính kèm
2. Chọn 1 hình ảnh (< 5MB)
3. Gửi
```

**Kết quả mong đợi:**
- Hình ảnh hiện trong chat
- File lưu tại `backend/uploads/`
- URL format: `/uploads/1706318923456-image.jpg`

---

## Kịch Bản 5: Disconnect Handling

### User Disconnect
1. **Tab 1 (User): Tắt tab hoặc ngắt mạng**
2. **Tab 2 (Admin): Quan sát**

**Kết quả mong đợi:**
- Dấu chấm xanh chuyển thành xám
- Server log: "User Disconnected: Khách hàng A"
- `activeUsers` Map xóa entry

---

### Network Reconnection
1. **Tab 1: Mất mạng 10 giây**
2. **Bật mạng lại**

**Kết quả mong đợi:**
- Socket.IO tự động reconnect
- Lịch sử chat vẫn còn
- Không bị mất data

---

## Testing Checklist

### Functional Testing
- [ ] User có thể gửi tin nhắn
- [ ] Admin nhận được tin nhắn real-time
- [ ] AI auto-reply hoạt động
- [ ] Upload file thành công
- [ ] Chat history persistence
- [ ] Multiple users isolation
- [ ] Disconnect/Reconnect handling

### UI Testing
- [ ] Tin nhắn hiển thị đúng bên (trái/phải)
- [ ] Notification dot xuất hiện khi có tin nhắn mới
- [ ] Online status (xanh/xám) chính xác
- [ ] Scroll to bottom khi có tin nhắn mới
- [ ] Input field clear sau khi gửi

### Database Testing
- [ ] Messages được lưu đúng format
- [ ] `from`, `to`, `timestamp` chính xác
- [ ] AI messages có flag `isAi: true`
- [ ] Products collection có data

### Error Handling
- [ ] Server crash -> Client hiển thị lỗi kết nối
- [ ] MongoDB down -> Error log rõ ràng
- [ ] AI API fail -> Fallback message
- [ ] Upload file > 5MB -> Error message

---

## Performance Testing

### Load Test
```bash
# Sử dụng Artillery
npm install -g artillery

# Run load test
artillery quick --count 10 --num 100 http://localhost:5000
```

**Metrics to watch:**
- Response time < 200ms
- Socket connections stable
- Memory usage không tăng

---

### Stress Test
1. Mở 20 tabs cùng lúc
2. Mỗi tab gửi 10 tin nhắn/giây

**Mong đợi:**
- Server không crash
- Messages vẫn được gửi đúng
- UI không bị lag

---

## Demo Script cho Giảng Viên

### Phút 1-2: Giới Thiệu
> "Em xin giới thiệu hệ thống chat real-time được xây dựng bằng Socket.IO và React..."

**Show:** Architecture diagram từ file `01_GIOI_THIEU_HE_THONG.md`

---

### Phút 3-5: Demo Basic Chat
> "Đầu tiên em sẽ demo tính năng chat cơ bản giữa User và Admin"

**Actions:**
1. Login User
2. Login Admin
3. User gửi "Xin chào"
4. Admin reply

**Highlight:**
- Real-time (không reload page)
- Bidirectional communication

---

### Phút 6-8: Demo AI
> "Hệ thống tích hợp AI để tự động tư vấn khách hàng"

**Actions:**
1. User gửi "tư vấn mua iphone"
2. Wait for AI response

**Show:** Server logs với "AI Chat Request"

**Highlight:**
- Keyword detection
- OpenAI integration
- Auto-save to database

---

### Phút 9-10: Demo Persistence
> "Dữ liệu được lưu trữ vĩnh viễn trong MongoDB"

**Actions:**
1. Tắt browser
2. Login lại
3. Lịch sử vẫn còn

**Show:** MongoDB Compass với messages collection

---

### Phút 11-12: Code Explanation
> "Em xin giải thích một số đoạn code quan trọng"

**Show file:** `03_GIAI_THICH_CODE.md`

**Focus on:**
- Socket.IO event handling
- MongoDB integration
- AI API call

---

## Câu Hỏi Thường Gặp & Trả Lời

### Q1: "Tại sao chọn Socket.IO thay vì WebSocket thuần?"
**A:** 
- Socket.IO có fallback (polling) khi WebSocket không khả dụng
- Có sẵn rooms, namespaces
- Reconnection tự động
- Browser compatibility tốt hơn

### Q2: "Hệ thống scale như thế nào khi có nhiều user?"
**A:**
- Sử dụng Redis adapter để sync giữa nhiều server instances
- Load balancer với sticky sessions
- Database index optimization

### Q3: "Xử lý security như thế nào?"
**A:**
- CORS configuration
- Input validation
- (Future) JWT authentication
- Rate limiting

### Q4: "Message order được đảm bảo không?"
**A:**
- Có, Socket.IO đảm bảo message order từ cùng 1 client
- Cross-client order rely on database timestamp

### Q5: "Làm sao scale AI chatbot?"
**A:**
- Caching common responses
- Queue system cho concurrent requests
- Multiple API keys rotation
