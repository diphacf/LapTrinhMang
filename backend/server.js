import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import mongoose from "mongoose";
import Message from "./models/Message.js";
import OpenAI from "openai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/iphone-store')
  .then(() => console.log(' Đã kết nối MongoDB thành công'))
  .catch(err => console.error(' Lỗi kết nối MongoDB:', err));

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const activeUsers = new Map();

io.on("connection", (socket) => {
  console.log(` Người dùng đã kết nối: ${socket.id}`);

  socket.on("login", ({ username, role }) => {
    activeUsers.set(socket.id, { username, role });
    console.log(`🔐 Đăng nhập: ${username} (${role})`);

    if (role === 'admin') {
      const usersList = Array.from(activeUsers.entries())
        .filter(([id, user]) => user.role === 'user')
        .map(([id, user]) => ({ id, ...user }));
      socket.emit("update_user_list", usersList);
    } else if (role === 'user') {
      const admins = Array.from(activeUsers.entries()).filter(([id, user]) => user.role === 'admin');

      const usersList = Array.from(activeUsers.entries())
        .filter(([id, u]) => u.role === 'user')
        .map(([id, u]) => ({ id, ...u }));

      admins.forEach(([adminId, _]) => {
        io.to(adminId).emit("update_user_list", usersList);
        io.to(adminId).emit("user_connected", { id: socket.id, username, role });
      });
    }
  });

  socket.on("get_chat_history", async ({ userId }) => {
    try {
      const messages = await Message.find({
        $or: [
          { from: userId },
          { to: userId },
          { from: userId, to: 'admin' }
        ]
      }).sort({ timestamp: 1 });

      socket.emit("chat_history", messages);
    } catch (error) {
      console.error(" Lỗi tải lịch sử chat:", error);
      socket.emit("error", { message: "Không thể tải lịch sử chat" });
    }
  });

  socket.on("ai_chat", async ({ message, from }) => {
    try {
      const openai = new OpenAI({
        baseURL: 'https://api.yescale.io/v1',
        apiKey: process.env.YESCALE_API_KEY,
      });

      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "Bạn là Trợ lý ảo chuyên nghiệp của Cửa hàng Apple (Apple Store). Nhiệm vụ của bạn là tư vấn cho khách hàng về các sản phẩm iPhone, iPad, MacBook, Apple Watch và các dịch vụ đi kèm. Hãy trả lời ngắn gọn, lịch sự, thân thiện và hữu ích. Nếu không biết câu trả lời, hãy đề nghị khách hàng liên hệ trực tiếp với nhân viên qua khung chat này."
          },
          { role: "user", content: message }
        ],
        model: "gpt-4o-mini",
      });

      const aiResponse = completion.choices[0].message.content;

      await Message.create({
        from: 'Trợ Lý Apple',
        to: from,
        message: aiResponse,
        isAi: true,
        role: 'system'
      });

      socket.emit("ai_response", { reply: aiResponse });

    } catch (error) {
      console.error(" Lỗi AI:", error);
      socket.emit("error", { message: "Dịch vụ AI tạm thời không khả dụng" });
    }
  });

  socket.on("upload_file", ({ file, filename, from }) => {
    try {
      const uploadDir = path.join(__dirname, 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
      }

      const uniqueFilename = `${Date.now()}-${filename}`;
      const filepath = path.join(uploadDir, uniqueFilename);

      fs.writeFileSync(filepath, Buffer.from(file, 'base64'));

      socket.emit("file_uploaded", {
        url: `/uploads/${uniqueFilename}`,
        success: true
      });

    } catch (error) {
      console.error(" Lỗi tải file:", error);
      socket.emit("error", { message: "Tải file thất bại" });
    }
  });

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`👥 Người dùng ${socket.id} tham gia phòng: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("private_message", async ({ to, message, from }) => {
    console.log(` Tin nhắn riêng từ ${from} đến ${to}: ${message}`);

    try {
      await Message.create({ from, to, message, role: 'admin' });
    } catch (error) {
      console.error(" Lỗi lưu tin nhắn riêng:", error);
    }

    socket.to(to).emit("receive_private_message", { from, message });
  });

  socket.on("client_message", async ({ message, from }) => {
    console.log(` Khách hàng ${from} nói: ${message}`);

    try {
      await Message.create({ from, to: 'admin', message, role: 'user' });
    } catch (error) {
      console.error(" Lỗi lưu tin nhắn khách:", error);
    }

    const admins = Array.from(activeUsers.entries()).filter(([id, user]) => user.role === 'admin');
    admins.forEach(([adminId, _]) => {
      io.to(adminId).emit("receive_private_message", { from, fromId: socket.id, message });
    });
  });

  socket.on("disconnect", () => {
    const user = activeUsers.get(socket.id);
    if (user) {
      console.log(` Ngắt kết nối: ${user.username} (${user.role})`);

      if (user.role === 'user') {
        const admins = Array.from(activeUsers.entries()).filter(([id, _]) => _.role === 'admin');
        admins.forEach(([adminId, _]) => {
          io.to(adminId).emit("user_disconnected", socket.id);
        });
      }
      activeUsers.delete(socket.id);
    } else {
      console.log(" Người dùng ngắt kết nối:", socket.id);
    }
  });
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get("/", (req, res) => {
  res.send(" Máy Chủ Socket.IO Đang Chạy (Giao Tiếp WebSocket)");
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(` Máy chủ Socket.IO đang chạy tại cổng ${PORT}`);
});
