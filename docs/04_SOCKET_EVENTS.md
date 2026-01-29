# Socket.IO Events Documentation

## Tổng Quan

Hệ thống sử dụng **100% Socket.IO** cho mọi giao tiếp. Không có REST API endpoints.

---

## Client → Server Events

### 1. login
**Mô tả:** Đăng nhập vào hệ thống

**Payload:**
```javascript
{
  username: "xuandat",
  role: "user" | "admin"
}
```

**Server Response:**
- Nếu admin: emit `update_user_list`
- Nếu user: thông báo cho admins qua `user_connected`

---

### 2. get_chat_history
**Mô tả:** Lấy lịch sử chat

**Payload:**
```javascript
{
  userId: "xuandat"
}
```

**Server Response:** emit `chat_history`

```javascript
[
  {
    from: "xuandat",
    to: "admin",
    message: "Xin chào",
    timestamp: "2026-01-27T00:15:23.000Z",
    isAi: false
  }
]
```

---

### 3. ai_chat
**Mô tả:** Gửi câu hỏi cho AI

**Payload:**
```javascript
{
  message: "tư vấn iPhone 15 Pro",
  from: "xuandat"
}
```

**Server Response:** emit `ai_response`

```javascript
{
  reply: "iPhone 15 Pro có chip A17 Pro..."
}
```

---

### 4. private_message
**Mô tả:** Admin gửi tin nhắn riêng cho User

**Payload:**
```javascript
{
  to: "socket-id-of-user",
  message: "Chúng tôi sẽ hỗ trợ ngay",
  from: "admin-name"
}
```

**Server Actions:**
- Lưu vào MongoDB
- emit `receive_private_message` đến user

---

### 5. client_message
**Mô tả:** User gửi tin nhắn

**Payload:**
```javascript
{
  message: "Cần tư vấn",
  from: "xuandat"
}
```

**Server Actions:**
- Lưu vào MongoDB
- Broadcast đến tất cả admin qua `receive_private_message`
- Trigger AI auto-reply (nếu có keyword)

---

### 6. upload_file
**Mô tả:** Upload file qua socket

**Payload:**
```javascript
{
  file: "base64-encoded-data",
  filename: "image.jpg",
  from: "xuandat"
}
```

**Server Response:** emit `file_uploaded`

```javascript
{
  url: "/uploads/1706318923456-image.jpg",
  success: true
}
```

---

### 7. disconnect
**Mô tả:** Ngắt kết nối

**Payload:** None (automatic event)

**Server Actions:**
- Xóa khỏi activeUsers
- Thông báo admins qua `user_disconnected`

---

## Server → Client Events

### 1. chat_history
**Mô tả:** Trả lịch sử chat

**Payload:**
```javascript
[
  { from, to, message, timestamp, isAi },
  ...
]
```

---

### 2. ai_response
**Mô tả:** Phản hồi từ AI

**Payload:**
```javascript
{
  reply: "Câu trả lời từ AI..."
}
```

---

### 3. receive_private_message
**Mô tả:** Nhận tin nhắn riêng

**Payload:**
```javascript
{
  from: "admin-name",
  fromId: "socket-123",  // Chỉ có khi admin nhận
  message: "Tin nhắn..."
}
```

---

### 4. update_user_list
**Mô tả:** Cập nhật danh sách user (gửi cho admin)

**Payload:**
```javascript
[
  { id: "socket-123", username: "user1", role: "user" },
  { id: "socket-456", username: "user2", role: "user" }
]
```

---

### 5. user_connected
**Mô tả:** Thông báo admin khi có user mới

**Payload:**
```javascript
{
  id: "socket-789",
  username: "newuser",
  role: "user"
}
```

---

### 6. user_disconnected
**Mô tả:** Thông báo admin khi user offline

**Payload:**
```javascript
"socket-789"  // Socket ID
```

---

### 7. file_uploaded
**Mô tả:** Xác nhận file đã upload

**Payload:**
```javascript
{
  url: "/uploads/filename.jpg",
  success: true
}
```

---

### 8. error
**Mô tả:** Thông báo lỗi

**Payload:**
```javascript
{
  message: "Không thể tải lịch sử chat"
}
```

---

## Code Examples

### Frontend: Gửi tin nhắn

```javascript
// User gửi tin nhắn
socket.emit('client_message', {
  message: inputText,
  from: myUsername
});

// Lắng nghe phản hồi
socket.on('receive_private_message', ({ from, message }) => {
  setMessages(prev => [...prev, { from, message, self: false }]);
});
```

### Frontend: Lấy lịch sử

```javascript
// Request
socket.emit('get_chat_history', { userId: myUsername });

// Response
socket.on('chat_history', (messages) => {
  setMessages(messages);
});
```

### Frontend: AI Chat

```javascript
// Send
socket.emit('ai_chat', { message: "tư vấn iPhone", from: myUsername });

// Receive
socket.on('ai_response', ({ reply }) => {
  setMessages(prev => [...prev, {
    from: 'Trợ Lý Apple',
    message: reply,
    isAi: true
  }]);
});
```

---

## Error Codes

Tất cả errors được gửi qua event `error`:

```javascript
socket.on('error', ({ message }) => {
  console.error(message);
  // "Không thể tải lịch sử chat"
  // "Dịch vụ AI tạm thời không khả dụng"
  // "Tải file thất bại"
});
```

---

## So sánh REST vs Socket.IO

### REST API (Cũ - Đã bỏ)
```javascript
const res = await fetch('/api/chat/history/user1');
const data = await res.json();
```

### Socket.IO (Mới - Hiện tại)
```javascript
socket.emit('get_chat_history', { userId: 'user1' });
socket.on('chat_history', (data) => { ... });
```

**Ưu điểm Socket.IO:**
- Real-time 2 chiều
- Không cần fetch API
- Server có thể push bất kỳ lúc nào
- Persistent connection
