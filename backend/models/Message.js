import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    from: { type: String, required: true },
    to: { type: String, default: null },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    isAi: { type: Boolean, default: false },
    role: { type: String, enum: ['user', 'admin', 'system'], default: 'user' }
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
