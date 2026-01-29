# Giải Thích Chi Tiết Cấu Trúc Code

## Backend Architecture

### 1. Entry Point - server.js

#### Imports và Setup
```javascript
import express from "express";
import { Server } from "socket.io";
import mongoose from "mongoose";
```

**Giải thích:**
- `express` - Framework chính để xây dựng REST API
- `socket.io` - Thư viện WebSocket cho real-time communication
- `mongoose` - ODM (Object Data Modeling) cho MongoDB

#### MongoDB Connection
```javascript
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/iphone-store')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));
```

**Giải thích:**
- Kết nối đến MongoDB sử dụng connection string
- Sử dụng `.env` để bảo mật thông tin
- Promise-based: `.then()` khi thành công, `.catch()` khi lỗi

#### Socket.IO Server Setup
```javascript
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
```

**Giải thích:**
- Tạo Socket.IO server gắn với HTTP server
- CORS config cho phép cross-origin requests
- `origin: "*"` - Cho phép mọi nguồn (development mode)

### 2. Socket Events

#### User Login Event
```javascript
socket.on("login", ({ username, role }) => {
  activeUsers.set(socket.id, { username, role });
  
  if (role === 'admin') {
    const usersList = Array.from(activeUsers.entries())
      .filter(([id, user]) => user.role === 'user')
      .map(([id, user]) => ({ id, ...user }));
    socket.emit("update_user_list", usersList);
  }
});
```

**Giải thích:**
- Lắng nghe event `login` từ client
- Lưu user vào Map với key là `socket.id`
- Nếu user là Admin:
  - Thu thập danh sách tất cả User
  - Gửi lại cho Admin qua event `update_user_list`

#### Private Message Event
```javascript
socket.on("private_message", async ({ to, message, from }) => {
  try {
    await Message.create({ from, to, message, role: 'admin' });
  } catch (error) {
    console.error("Error saving private message:", error);
  }
  
  socket.to(to).emit("receive_private_message", { from, message });
});
```

**Giải thích:**
- Nhận tin nhắn riêng tư từ 1 user
- Lưu vào MongoDB bằng `Message.create()`
- Gửi đến đúng người nhận qua `socket.to(to).emit()`

#### Client Message Event
```javascript
socket.on("client_message", async ({ message, from }) => {
  await Message.create({ from, to: 'admin', message, role: 'user' });
  
  const admins = Array.from(activeUsers.entries())
    .filter(([id, user]) => user.role === 'admin');
    
  admins.forEach(([adminId, _]) => {
    io.to(adminId).emit("receive_private_message", { from, fromId: socket.id, message });
  });
});
```

**Giải thích:**
- Xử lý tin nhắn từ User gửi cho Admin
- Lưu vào DB với `to: 'admin'`
- Broadcast đến **tất cả Admin đang online**
- Sử dụng `io.to()` để gửi đến nhiều socket

### 3. Controllers

#### Chat Controller - getChatHistory
```javascript
export const getChatHistory = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const messages = await Message.find({
        $or: [
            { from: userId },
            { to: userId },
            { from: userId, to: 'admin' }
        ]
    }).sort({ timestamp: 1 });

    res.json(messages);
});
```

**Giải thích:**
- `asyncHandler` - Wrapper để bắt lỗi async tự động
- `req.params.userId` - Lấy userId từ URL params
- MongoDB query với `$or`:
  - Tin nhắn **từ** userId
  - Tin nhắn **đến** userId
  - Tin nhắn userId gửi cho admin
- `.sort({ timestamp: 1 })` - Sắp xếp theo thời gian tăng dần

#### Chat Controller - handleAiChat
```javascript
export const handleAiChat = asyncHandler(async (req, res) => {
    const { message, from, username } = req.body;
    const userToReply = from || username;

    const openai = new OpenAI({
        baseURL: 'https://api.yescale.io/v1',
        apiKey: process.env.YESCALE_API_KEY,
    });

    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content: "Bạn là Trợ lý ảo chuyên nghiệp của Cửa hàng Apple..."
            },
            { role: "user", content: message }
        ],
        model: "gpt-4o-mini",
    });

    const aiResponse = completion.choices[0].message.content;

    if (userToReply) {
        await Message.create({
            from: 'Apple Assistant',
            to: userToReply,
            message: aiResponse,
            isAi: true,
            role: 'system'
        });
    }

    res.json({ reply: aiResponse });
});
```

**Giải thích:**
1. **Khởi tạo OpenAI Client** với Yescale API endpoint
2. **Gửi Request** với:
   - `system` message: Định nghĩa vai trò AI
   - `user` message: Câu hỏi từ user
3. **Lấy Response** từ `completion.choices[0]`
4. **Lưu vào DB** để persistence
5. **Trả về JSON** cho client

### 4. Models

#### Message Model
```javascript
import mongoose from 'mongoose';

const messageSchema = mongoose.Schema(
    {
        from: { type: String, required: true },
        to: { type: String, required: true },
        message: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        isAi: { type: Boolean, default: false },
        role: { type: String, enum: ['user', 'admin', 'system'] }
    },
    { timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);
export default Message;
```

**Giải thích:**
- `from`, `to`, `message` - Bắt buộc
- `timestamp` - Tự động set thời gian hiện tại
- `isAi` - Flag để phân biệt AI message
- `role` - Enum giới hạn 3 giá trị
- `timestamps: true` - Tự động thêm `createdAt`, `updatedAt`

#### Product Model
```javascript
const productSchema = mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    colors: [{ name: String, code: String }],
    sizes: [{ size: String }],
    specifications: { type: Map, of: String }
});
```

**Giải thích:**
- `colors` - Array of objects (nhiều màu)
- `sizes` - Array of objects (nhiều size)
- `specifications` - Map key-value linh hoạt

### 5. Routes

```javascript
import express from 'express';
import { getChatHistory, handleAiChat } from '../controllers/chat.controller.js';

const router = express.Router();

router.get('/history/:userId', getChatHistory);
router.post('/ai', handleAiChat);

export default router;
```

**Giải thích:**
- Tạo Express Router
- Map HTTP methods đến controller functions
- `/:userId` - Dynamic route parameter
- Export để sử dụng trong `server.js`

## Frontend Architecture

### 1. Socket Connection

```javascript
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  autoConnect: false
});

socket.connect();
socket.emit("login", { username, role });
```

**Giải thích:**
- Import `io` từ client library
- `autoConnect: false` - Không tự kết nối
- Manual `.connect()` khi cần
- Emit `login` event sau khi connect

### 2. Listening to Events

```javascript
useEffect(() => {
  socket.on("receive_private_message", ({ from, message }) => {
    setMessages(prev => [...prev, { from, message, self: false }]);
  });

  return () => socket.off("receive_private_message");
}, []);
```

**Giải thích:**
- `useEffect` với empty deps `[]` - Chạy 1 lần khi mount
- `socket.on()` - Lắng nghe event
- Update state bằng spread operator `[...prev, newMsg]`
- `socket.off()` trong cleanup để tránh memory leak

### 3. Sending Messages

```javascript
const sendMessage = () => {
  if (role === 'user') {
    socket.emit("client_message", { message: inputText, from: myUsername });
  } else {
    socket.emit("private_message", { to: selectedUser.id, message: inputText, from: myUsername });
  }
  
  setMessages(prev => [...prev, { from: myUsername, message: inputText, self: true }]);
  setInputText('');
};
```

**Giải thích:**
- Kiểm tra role để chọn event phù hợp
- User gửi `client_message` (broadcast đến Admin)
- Admin gửi `private_message` (1-1 với User)
- Optimistic update: Thêm message vào UI ngay lập tức
- Clear input sau khi gửi

### 4. Fetching Chat History

```javascript
useEffect(() => {
    const fetchHistory = async () => {
        const targetId = role === 'admin' ? selectedUser.username : myUsername;
        
        if (targetId) {
            const res = await fetch(`http://localhost:5000/api/chat/history/${targetId}`);
            const data = await res.json();
            
            setMessages(data.map(msg => ({
                ...msg,
                self: msg.from === myUsername
            })));
        }
    };

    fetchHistory();
}, [role, selectedUser, myUsername]);
```

**Giải thích:**
- Fetch khi `selectedUser` thay đổi (Admin chọn user khác)
- Hoặc khi component mount lần đầu
- Map data để thêm `self` property (phân biệt tin nhắn của mình)
- Set vào state để render

### 5. AI Auto-Reply

```javascript
useEffect(() => {
    if (role === 'user' && inputText) {
        const keywords = ["tư vấn", "iphone", "giá"];
        const shouldTriggerAI = keywords.some(kw => inputText.toLowerCase().includes(kw));
        
        if (shouldTriggerAI) {
            callAI(inputText);
        }
    }
}, [messages]);

const callAI = async (userMessage) => {
    const res = await fetch('http://localhost:5000/api/chat/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, from: myUsername })
    });
    
    const data = await res.json();
    
    setMessages(prev => [...prev, {
        from: 'Apple Assistant',
        message: data.reply,
        self: false,
        isAi: true
    }]);
};
```

**Giải thích:**
1. **Trigger Detection**:
   - Kiểm tra từ khóa trong tin nhắn
   - `.some()` trả về true nếu có ít nhất 1 từ khóa
2. **API Call**:
   - POST request đến `/api/chat/ai`
   - Gửi kèm `from` để AI response được lưu đúng user
3. **Update UI**:
   - Thêm AI response vào messages
   - Set `isAi: true` để styling khác biệt

## Key Concepts

### 1. WebSocket vs HTTP
- **HTTP**: Request-Response, stateless
- **WebSocket**: Full-duplex, persistent connection
- Socket.IO sử dụng WebSocket với fallback

### 2. Event-Driven Architecture
```
Client emits "login" 
  -> Server receives 
  -> Server emits "update_user_list" 
  -> Client receives
```

### 3. Optimistic UI Updates
Thêm message vào UI ngay lập tức, không đợi server confirm

### 4. Data Persistence
- **Volatile**: `activeUsers` Map (chỉ trong RAM)
- **Persistent**: MongoDB (lưu vĩnh viễn)

### 5. MVC Pattern
- **Model**: Mongoose schemas
- **View**: React components
- **Controller**: Express route handlers
