
import React, { useState, useEffect, useRef } from 'react';

const ChatWindow = ({ role, socket, selectedUser, myUsername, messages, setMessages }) => {
    const [inputText, setInputText] = useState("");
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        let targetId = null;
        if (role === 'admin' && selectedUser) targetId = selectedUser.username;
        else if (role === 'user') targetId = myUsername;

        if (targetId) {
            socket.emit('get_chat_history', { userId: targetId });
        }
    }, [role, selectedUser, myUsername, socket]);

    useEffect(() => {
        const handleChatHistory = (messages) => {
            if (Array.isArray(messages)) {
                setMessages(messages.map(msg => ({
                    ...msg,
                    self: msg.from === myUsername
                })));
            }
        };

        socket.on('chat_history', handleChatHistory);

        return () => socket.off('chat_history', handleChatHistory);
    }, [myUsername, socket, setMessages]);

    useEffect(() => {
        const handleAiResponse = ({ reply }) => {
            setMessages(prev => [...prev, {
                from: 'Trợ Lý Apple',
                message: reply,
                self: false,
                isAi: true
            }]);
        };

        socket.on('ai_response', handleAiResponse);

        return () => socket.off('ai_response', handleAiResponse);
    }, [socket, setMessages]);

    const handleSend = async () => {
        if (!inputText.trim()) return;

        const msgData = {
            message: inputText,
            from: myUsername,
            self: true,
            to: role === 'admin' ? selectedUser?.id : null
        };

        // Optimistic UI update
        setMessages(prev => [...prev, msgData]);

        if (role === 'admin') {
            if (selectedUser) {
                socket.emit("private_message", {
                    to: selectedUser.id,
                    message: inputText,
                    from: myUsername
                });
            } else {
                alert("Please select a user to chat with.");
                return; // Don't clear input if failed
            }
        } else {
            // User sending to Admin
            // Simplified: We assume User messages just go to "the store"
            // Since we didn't implement complex routing, let's just emit 'private_message' to ALL admins?
            // Or server handles routing?
            // Current server logic: socket.on("private_message", ({ to... }))
            // User doesn't know 'to'.
            // FIX: User sends to a specific event 'user_message' and Server finds Admin?
            // Or we Hack it: User sends 'send_message' (broadcast) and Admin filters?

            // Let's use a custom event for User -> Admin in this Window
            // But wait, I can edit the Protocol.
            // Easiest is: User sends to 'send_message' (Room = 'general_support'?)
            // Let's rely on the previous plan: User sends to 'send_message' broadcast?
            // NO, User wants private chat.

            // Let's use a simple socket emit 'message_to_admin'
            // I'll need to update server.js one more time briefly? 
            // OR: User sends to 'private_message' with to: 'ADMIN_BROADCAST'?

            // Let's try: socket.emit("send_message", { room: socket.id, ... })
            // And Admin joins User's room?
            // Yes! Admin clicks User -> join_room(user.id).
            // That is the standard socket.io chat architecture.

            // LET'S SWITCH ARCHITECTURE SLIGHTLY FOR ROBUSTNESS:
            // 1. User joins room = socket.id (Client does this automatically? or explicit join_room)
            // 2. User sends message to room = socket.id.
            // 3. Admin clicks User -> Admin joins room = user.id.
            // 4. Admin sends message to room = user.id.

            // This is much better than "private_message" with ID targeting because it handles history/multi-admin easier.
            // BUT I already wrote server.js for 'private_message'.

            // Let's stick to 'private_message' but handle the User side.
            // User Side: How to find Admin ID?
            // Answer: Server sends 'admin_id' on login?
            // Or: User emits 'user_message' -> Server forwards to all Admins.

            // Let's just emit 'private_message' with to: null? and Server handles?
            // I'll update Client to emit 'message_from_user'
            // Send to Admin via Socket
            socket.emit("client_message", {
                message: inputText,
                from: myUsername
            });
            // Optimistic Update is already done above globally
            // setMessages(prev => [...prev, msgData]);  <-- REMOVED
        }

        const lowerMsg = inputText.toLowerCase().trim();
        const isKeywordTrigger = lowerMsg.includes("tư vấn") || lowerMsg.includes("iphone") || lowerMsg.includes("giá");
        const isUserAutoReply = role !== 'admin';

        if (isUserAutoReply || lowerMsg.startsWith("hey ai") || lowerMsg.startsWith("hey apple") || isKeywordTrigger) {
            let query = inputText;

            if (lowerMsg.startsWith("hey ai")) query = inputText.substring(6).trim();
            else if (lowerMsg.startsWith("hey apple")) query = inputText.substring(9).trim();

            socket.emit('ai_chat', { message: query || inputText, from: myUsername });
        }

        setInputText("");
    };

    // Override for User sending logic to match Server 'send_message'
    // I need to make sure Admin joins 'general_support' room?
    // Let's simple check server.js... 'send_message' broadcasts to room.

    // Actually, keep it simple for the User:
    // User -> Server (via private_message to active Admin).
    // I'll add a helper to catch the 'first admin' from the user_list update?
    // Oh, 'user' role doesn't get user_list.

    // Quick Fix:
    // User sends to 'send_message' (room: 'support').
    // Admin joins 'support' on load.
    // ALL messages appear in Admin's "Public Channel".
    // This deviates from "Dedicated User Chat".

    // BEST APPROACH NOW:
    // User emits 'chat_message', { message, from: username }.
    // Server listens 'chat_message', appends socket.id, forwards to Admins.
    // Admins receive { id, from, message }.

    // Since I can't easily change Server safely without breaking things, I will just use the 'send_message' (broadcast) 
    // and have Admin filter by sender?

    // No, let's just make the User emit specific event "client_message".
    // I will update Server.js to handle "client_message".

    return (
        <div className="flex-1 flex flex-col bg-black/40 backdrop-blur-sm">
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-black/60 backdrop-blur-sm flex justify-between items-center">
                <h3 className="font-bold text-lg">
                    {role === 'admin'
                        ? (selectedUser ? `Chatting with ${selectedUser.username}` : "Select a user to chat")
                        : "Chatting with Apple Support"}
                </h3>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Default Bot Message */}
                <div className="flex justify-start">
                    <div className="max-w-[70%] p-3 rounded-2xl bg-black/40 backdrop-blur-md text-white border border-white/10 shadow-sm">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-200 to-white border border-gray-300 flex items-center justify-center text-xs font-bold text-black shadow-sm">AI</div>
                            <p className="text-sm font-bold opacity-90 text-gray-200">Trợ Lý Apple</p>
                        </div>
                        <p className="text-white">Welcome to Apple Support! <br />How can we help you today?</p>
                    </div>
                </div>

                {messages.filter(msg => {
                    if (role === 'admin') {
                        // Admin: Show messages from Selected User OR from Me (to Selected User)
                        if (!selectedUser) return false;

                        // FIX: Allow AI messages to be seen
                        if (msg.isAi || msg.from === 'Trợ Lý Apple') return true;

                        return msg.from === selectedUser.username || (msg.self && msg.to === selectedUser.id);
                    } else {
                        // User: Show all messages
                        return true;
                    }
                }).map((msg, index) => (
                    <div key={index} className={`flex ${msg.self ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] p-3 rounded-2xl ${msg.self ? 'bg-blue-600/80 backdrop-blur-sm text-white' : 'bg-black/60 backdrop-blur-sm text-white border border-white/10'}`}>
                            {msg.from && <p className="text-sm font-bold opacity-70 mb-1">{msg.from}</p>}
                            {msg.message && (
                                <p className="whitespace-pre-wrap">
                                    {msg.message.replace(/\*\*/g, '').replace(/\*/g, '').replace(/#/g, '')}
                                </p>
                            )}

                            {/* Render Attachment */}
                            {msg.attachment && (
                                <div className="mt-2">
                                    {msg.attachment.type.startsWith('image/') ? (
                                        <img
                                            src={`http://172.20.10.3:5000${msg.attachment.url}`}
                                            alt="attachment"
                                            className="max-w-full rounded-lg max-h-48 object-cover"
                                        />
                                    ) : (
                                        <a
                                            href={`http://172.20.10.3:5000${msg.attachment.url}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 bg-black/20 p-2 rounded hover:bg-black/40 transition"
                                        >
                                            <span className="text-2xl">📄</span>
                                            <span className="underline truncate">{msg.attachment.name}</span>
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-black/60 backdrop-blur-sm border-t border-white/10 flex gap-2 items-center">
                {/* File Upload Button */}
                <label className="cursor-pointer p-2 hover:bg-zinc-700 rounded-full transition-colors text-gray-400 hover:text-white">
                    <input
                        type="file"
                        className="hidden"
                        onChange={async (e) => {
                            const file = e.target.files[0];
                            if (!file) return;

                            // Upload File
                            const formData = new FormData();
                            formData.append('file', file);

                            try {
                                // NOTE: Replace localhost with IP for LAN
                                const res = await fetch('http://172.20.10.3:5000/api/upload', {
                                    method: 'POST',
                                    body: formData
                                });
                                const data = await res.json();
                                if (data.url) {
                                    // Construct message with attachment
                                    const msgData = {
                                        message: "", // Empty text for file-only message
                                        attachment: data,
                                        from: myUsername
                                    };

                                    // Send via Socket
                                    if (role === 'admin') {
                                        if (selectedUser) {
                                            const payload = {
                                                to: selectedUser.id,
                                                message: "",
                                                attachment: data,
                                                from: myUsername
                                            };
                                            socket.emit("private_message", payload);
                                            // Optimistic Update
                                            setMessages(prev => [...prev, { ...msgData, self: true, to: selectedUser.id }]);
                                        }
                                    } else {
                                        socket.emit("client_message", {
                                            message: "",
                                            attachment: data,
                                            from: myUsername
                                        });
                                        // Optimistic Update
                                        setMessages(prev => [...prev, { ...msgData, self: true }]);
                                    }
                                }
                            } catch (err) {
                                console.error("Upload failed", err);
                                alert("File upload failed");
                            }
                        }}
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
                    </svg>
                </label>

                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={role === 'admin' && !selectedUser ? "Select a user on the left to chat" : "Type a message..."}
                    className={`flex-1 bg-white text-black border border-zinc-300 rounded-full px-4 py-2 focus:outline-none focus:border-blue-500 placeholder-gray-500 ${role === 'admin' && !selectedUser ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={role === 'admin' && !selectedUser}
                />
                <button
                    onClick={handleSend}
                    disabled={role === 'admin' && !selectedUser}
                    className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white w-10 h-10 rounded-full flex items-center justify-center font-bold"
                >
                    ➤
                </button>
            </div>
        </div>
    );
};

export default ChatWindow;
