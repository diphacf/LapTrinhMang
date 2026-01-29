# Kịch Bản Trình Bày & Demo Hệ Thống Chat WebSocket

## 🎯 Thời Lượng: 15-20 phút

---

## 📋 Phần 1: Mở Đầu (2 phút)

### Lời Giới Thiệu

> "Kính chào thầy,
> 
> Em xin phép được trình bày về **Hệ Thống Chat Thời Gian Thực sử dụng WebSocket (Socket.IO)**.
>
> Dự án của nhóm em là một ứng dụng chat cho cửa hàng Apple, cho phép khách hàng trao đổi trực tiếp với admin và được hỗ trợ bởi AI tự động."

### Slide 1: Thông Tin Nhóm

```
Nhóm: [Số nhóm]
Thành viên:
- Nhóm trưởng: [Tên] - Backend & Socket.IO
- Thành viên: [Tên] - Frontend & Testing
```

---

## 📋 Phần 2: Giới Thiệu Công Nghệ (3 phút)

### 2.1 WebSocket vs HTTP

> "Trước hết, em xin giới thiệu sơ lược về WebSocket"

**Show slide so sánh:**

| HTTP (Traditional) | WebSocket |
|-------------------|-----------|
| Request → Response | Bidirectional |
| Stateless | Persistent Connection |
| Mở connection nhiều lần | 1 connection duy trì |
| Client phải hỏi | Server có thể push |

### 2.2 Tại Sao Chọn WebSocket?

> "Nhóm em chọn WebSocket vì 3 lý do chính:
>
> 1. **Real-time**: Tin nhắn đến ngay lập tức, không cần polling
> 2. **Low Latency**: Persistent connection, không overhead HTTP headers
> 3. **Bidirectional**: Server có thể push data bất kỳ lúc nào

**Ví dụ thực tế:**

```javascript
// ❌ HTTP - Phải polling (tốn tài nguyên)
setInterval(() => {
  fetch('/api/messages').then(res => res.json());
}, 1000); // Gọi mỗi giây

// ✅ WebSocket - Server tự push
socket.on('new_message', (message) => {
  displayMessage(message);
});
```

### 2.3 Kiến Trúc Hệ Thống

> "Hệ thống của nhóm em sử dụng 100% Socket.IO, không có REST API"

**Show diagram:**

```
┌─────────────┐         WebSocket          ┌─────────────┐
│   Browser   │ ◄──────────────────────► │   Server    │
│  (React)    │    socket.emit/on         │ (Socket.IO) │
└─────────────┘                           └──────┬──────┘
                                                 │
                                           ┌─────▼──────┐
                                           │  MongoDB   │
                                           └────────────┘
```

---

## 📋 Phần 3: Demo Trực Tiếp (5 phút)

> "Bây giờ em xin demo cho thầy xem hệ thống hoạt động"

### 3.1 Chuẩn Bị

**Mở sẵn:**
- 2 cửa sổ browser (User & Admin)
- VS Code với file `server.js` 
- Terminal với server logs

### 3.2 Demo Flow

#### Bước 1: Kết Nối

**Action:**
1. Mở tab 1 → Login User "Khách A"
2. Mở tab 2 → Login Admin "Nhân viên B"

**Nói:**
> "Em sẽ mở 2 tab để mô phỏng User và Admin. Khi đăng nhập, client sẽ emit event `login`"

**Show terminal:**
```
✅ Người dùng đã kết nối: abc123
🔐 Đăng nhập: Khách A (user)
```

**Show code trong server.js:**
```javascript
socket.on("login", ({ username, role }) => {
  activeUsers.set(socket.id, { username, role });
  console.log(`🔐 Đăng nhập: ${username} (${role})`);
  
  if (role === 'admin') {
    // Gửi danh sách user cho admin
    socket.emit("update_user_list", usersList);
  }
});
```

**Giải thích:**
> "Khi user login, server lưu thông tin vào Map `activeUsers`. Nếu là admin, server sẽ emit event `update_user_list` để admin biết có những user nào đang online."

---

#### Bước 2: Gửi Tin Nhắn

**Action:**
- Tab User: Gửi "Xin chào, tôi cần tư vấn"

**Nói:**
> "User gửi tin nhắn bằng event `client_message`"

**Show terminal:**
```
💬 Khách hàng Khách A nói: Xin chào, tôi cần tư vấn
```

**Show code - Frontend (ChatWindow.jsx):**
```javascript
// User gửi tin nhắn
socket.emit("client_message", {
  message: inputText,
  from: myUsername
});
```

**Show code - Backend (server.js):**
```javascript
socket.on("client_message", async ({ message, from }) => {
  console.log(`💬 Khách hàng ${from} nói: ${message}`);
  
  // Lưu vào database
  await Message.create({ from, to: 'admin', message, role: 'user' });
  
  // Broadcast đến tất cả admin
  const admins = Array.from(activeUsers.entries())
    .filter(([id, user]) => user.role === 'admin');
  
  admins.forEach(([adminId, _]) => {
    io.to(adminId).emit("receive_private_message", { from, message });
  });
});
```

**Giải thích:**
> "Server nhận event, lưu vào MongoDB, sau đó broadcast đến tất cả admin đang online qua event `receive_private_message`. Admin nhận được tin nhắn ngay lập tức mà không cần polling."

**Show Admin tab:**
- Tin nhắn xuất hiện real-time bên Admin
- Có notification dot màu đỏ

---

#### Bước 3: Admin Trả Lời

**Action:**
- Tab Admin: Click vào User → Reply "Chào bạn, tôi có thể giúp gì?"

**Nói:**
> "Admin trả lời bằng event `private_message`"

**Show code:**
```javascript
// Admin gửi
socket.emit("private_message", {
  to: selectedUser.id,  // Socket ID của user
  message: inputText,
  from: myUsername
});
```

**Backend xử lý:**
```javascript
socket.on("private_message", async ({ to, message, from }) => {
  // Lưu vào DB
  await Message.create({ from, to, message, role: 'admin' });
  
  // Gửi trực tiếp đến user
  socket.to(to).emit("receive_private_message", { from, message });
});
```

**Show User tab:**
- Tin nhắn từ admin xuất hiện ngay lập tức

**Giải thích:**
> "Đây là giao tiếp 2 chiều real-time. Không cần refresh, không cần polling. WebSocket giữ kết nối mở liên tục."

---

#### Bước 4: AI Auto-Reply

**Action:**
- Tab User: Gửi "tư vấn mua iPhone 15 Pro"

**Nói:**
> "Hệ thống có AI tự động. Khi phát hiện từ khóa 'tư vấn', 'iPhone', server sẽ call AI"

**Show terminal:**
```
💬 Khách hàng Khách A nói: tư vấn mua iPhone 15 Pro
```

**Show code - Frontend trigger:**
```javascript
// Kiểm tra keyword
const keywords = ["tư vấn", "iphone", "giá"];
const shouldTriggerAI = keywords.some(kw => 
  inputText.toLowerCase().includes(kw)
);

if (shouldTriggerAI) {
  socket.emit('ai_chat', { message: inputText, from: myUsername });
}
```

**Show code - Backend AI:**
```javascript
socket.on("ai_chat", async ({ message, from }) => {
  // Call OpenAI API
  const openai = new OpenAI({
    baseURL: 'https://api.yescale.io/v1',
    apiKey: process.env.YESCALE_API_KEY,
  });

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "Bạn là Trợ lý ảo của Apple Store..."
      },
      { role: "user", content: message }
    ],
    model: "gpt-4o-mini",
  });

  const aiResponse = completion.choices[0].message.content;

  // Lưu vào DB
  await Message.create({
    from: 'Trợ Lý Apple',
    to: from,
    message: aiResponse,
    isAi: true,
    role: 'system'
  });

  // Gửi về client
  socket.emit("ai_response", { reply: aiResponse });
});
```

**Show User tab:**
- Sau 1-2 giây, AI reply xuất hiện với icon AI

**Giải thích:**
> "AI response cũng được gửi qua WebSocket event `ai_response`. Client lắng nghe event này và hiển thị tin nhắn với flag `isAi: true` để styling khác biệt."

---

#### Bước 5: Chat History (Persistence)

**Action:**
- Tắt tab User
- Mở lại → Login lại với cùng username

**Nói:**
> "Khi user quay lại, hệ thống sẽ load lịch sử chat từ database"

**Show code - Frontend:**
```javascript
useEffect(() => {
  // Request lịch sử
  socket.emit('get_chat_history', { userId: myUsername });
  
  // Lắng nghe response
  socket.on('chat_history', (messages) => {
    setMessages(messages.map(msg => ({
      ...msg,
      self: msg.from === myUsername
    })));
  });
  
  return () => socket.off('chat_history');
}, [myUsername]);
```

**Show code - Backend:**
```javascript
socket.on("get_chat_history", async ({ userId }) => {
  const messages = await Message.find({
    $or: [
      { from: userId },
      { to: userId },
      { from: userId, to: 'admin' }
    ]
  }).sort({ timestamp: 1 });

  socket.emit("chat_history", messages);
});
```

**Show User tab:**
- Toàn bộ lịch sử chat hiện lại

**Giải thích:**
> "Mọi tin nhắn đều được lưu vào MongoDB với timestamp. Khi user quay lại, client emit event `get_chat_history`, server query database và gửi về qua event `chat_history`."

---

## 📋 Phần 4: Giải Thích Code Chi Tiết (5 phút)

### 4.1 Socket.IO Connection

**Show server.js:**
```javascript
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log(`✅ Người dùng đã kết nối: ${socket.id}`);
  
  // Lắng nghe events...
  
  socket.on("disconnect", () => {
    console.log(`❌ Ngắt kết nối: ${socket.id}`);
  });
});
```

**Giải thích:**
> "Server khởi tạo Socket.IO instance với CORS config. Mỗi khi client kết nối, callback được trigger với object `socket` đại diện cho connection đó. Mỗi socket có `socket.id` duy nhất."

---

### 4.2 Broadcasting Strategies

**Giải thích 3 cách gửi message:**

```javascript
// 1. Gửi đến tất cả (kể cả sender)
io.emit('message', 'Hello everyone');

// 2. Gửi đến tất cả trừ sender
socket.broadcast.emit('message', 'Hello others');

// 3. Gửi đến 1 socket cụ thể
io.to(socketId).emit('message', 'Private to you');
```

**Ứng dụng thực tế:**
> "Trong hệ thống, khi User gửi tin nhắn:
> - Dùng `io.to(adminId).emit()` để gửi đến từng admin
> - Dùng `socket.to(userId).emit()` khi admin reply trực tiếp"

---

### 4.3 Database Integration

**Show Message Model:**
```javascript
const messageSchema = mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  isAi: { type: Boolean, default: false },
  role: { type: String, enum: ['user', 'admin', 'system'] }
}, { timestamps: true });
```

**Giải thích:**
> "Mỗi tin nhắn được lưu với:
> - `from/to`: Người gửi/nhận
> - `message`: Nội dung
> - `timestamp`: Thời gian gửi
> - `isAi`: Flag để phân biệt AI message
> - `role`: User, admin hay system"

---

### 4.4 Error Handling

```javascript
socket.on("ai_chat", async ({ message, from }) => {
  try {
    const aiResponse = await callOpenAI(message);
    socket.emit("ai_response", { reply: aiResponse });
  } catch (error) {
    console.error("❌ Lỗi AI:", error);
    socket.emit("error", { message: "Dịch vụ AI tạm thời không khả dụng" });
  }
});
```

**Giải thích:**
> "Với async operations, em dùng try-catch. Nếu có lỗi, server emit event `error` để client biết và hiển thị thông báo cho user."

---

## 📋 Phần 5: So Sánh REST vs WebSocket (2 phút)

### 5.1 Trước Đây (REST API)

**Code cũ:**
```javascript
// Client phải fetch
const res = await fetch('/api/chat/history/user1');
const messages = await res.json();
setMessages(messages);

// Polling để update real-time (tốn tài nguyên)
setInterval(() => {
  fetch('/api/messages/new');
}, 3000);
```

**Backend cũ:**
```javascript
// REST endpoint
app.get('/api/chat/history/:userId', async (req, res) => {
  const messages = await Message.find({...});
  res.json(messages);
});
```

### 5.2 Hiện Tại (WebSocket)

**Code mới:**
```javascript
// Emit event
socket.emit('get_chat_history', { userId: 'user1' });

// Listen cho response
socket.on('chat_history', (messages) => {
  setMessages(messages);
});

// Real-time update tự động, không cần polling
socket.on('receive_private_message', (msg) => {
  setMessages(prev => [...prev, msg]);
});
```

**Backend mới:**
```javascript
// Socket event
socket.on('get_chat_history', async ({ userId }) => {
  const messages = await Message.find({...});
  socket.emit('chat_history', messages);
});
```

### So Sánh

| Tiêu chí | REST | WebSocket |
|----------|------|-----------|
| **Latency** | 200-500ms | 10-50ms |
| **Overhead** | HTTP headers | Minimal |
| **Real-time** | Polling | Native |
| **Code** | fetch() | socket.emit() |

---

## 📋 Phần 6: Kết Luận (2 phút)

### Tổng Kết

> "Tóm lại, hệ thống của nhóm em có những điểm nổi bật:
>
> 1. **100% WebSocket** - Không dùng REST API, mọi giao tiếp qua Socket.IO
> 2. **True Real-time** - Tin nhắn đến ngay lập tức
> 3. **AI Integration** - Tự động hỗ trợ khách hàng
> 4. **Persistent** - Lịch sử chat được lưu vĩnh viễn
> 5. **Clean Architecture** - Event-driven, dễ maintain"

### Thách Thức & Giải Pháp

**Thách thức:**
- Migrate từ REST sang Socket
- Error handling khác với HTTP status codes
- File upload qua WebSocket

**Giải pháp:**
- Refactor từng phần một
- Dùng socket event `error` thay status codes
- Convert file sang base64

### Công Nghệ Đã Sử Dụng

```
Frontend: React + Socket.IO Client
Backend: Node.js + Express + Socket.IO Server
Database: MongoDB
AI: OpenAI SDK (Yescale API)
```

---

## 📋 Phần 7: Q&A (2 phút)

### Câu Hỏi Dự Kiến

**Q1: "Tại sao không dùng REST API?"**

**A:** 
> "Em thấy WebSocket phù hợp hơn cho ứng dụng chat vì:
> - Real-time: Không cần polling
> - Low latency: Persistent connection
> - Bidirectional: Server có thể push
> 
> REST API tốt cho CRUD operations, nhưng với chat cần update liên tục, WebSocket hiệu quả hơn."

**Q2: "Làm sao scale khi có nhiều users?"**

**A:**
> "Có thể dùng Redis adapter để sync giữa nhiều server instances:
> 
> ```javascript
> import { createAdapter } from '@socket.io/redis-adapter';
> io.adapter(createAdapter(pubClient, subClient));
> ```
> 
> Như vậy có thể chạy nhiều servers, Redis sẽ broadcast events cross-servers."

**Q3: "Bảo mật như thế nào?"**

**A:**
> "Hiện tại em chưa implement authentication đầy đủ, nhưng có thể thêm:
> 
> ```javascript
> io.use((socket, next) => {
>   const token = socket.handshake.auth.token;
>   if (isValidToken(token)) {
>     next();
>   } else {
>     next(new Error('Authentication failed'));
>   }
> });
> ```
> 
> Validate token trước khi cho kết nối."

---

## 🎬 Checklist Demo

Trước khi trình bày, đảm bảo:

- [ ] Backend đang chạy (`npm start`)
- [ ] Frontend đang chạy (`npm run dev`)
- [ ] MongoDB đã kết nối
- [ ] Mở 2 tabs browser (User & Admin)
- [ ] VS Code mở file server.js
- [ ] Terminal hiển thị logs
- [ ] Slideshow chuẩn bị sẵn

---

## 💡 Tips Trình Bày

1. **Nói chậm, rõ ràng**
2. **Show code trước khi demo** - Giúp thầy hiểu logic
3. **Giải thích từng event** - Emit và listen ở đâu
4. **Highlight terminal logs** - Để thầy thấy real-time
5. **Zoom in code** - Đảm bảo thầy nhìn rõ
6. **Tự tin** - Bạn hiểu code của mình!

---

**Chúc bạn trình bày thành công! 🎉**
