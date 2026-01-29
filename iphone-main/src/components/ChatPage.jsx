
import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';

// NOTE: Replace 'localhost' with your LAN IP (e.g., 192.168.1.5) for cross-device testing
const ENDPOINT = "http://172.20.10.3:5000";

const ChatPage = ({ onBack }) => {
    const [role, setRole] = useState(null); // 'user' or 'admin'
    const [username, setUsername] = useState('');
    const [socket, setSocket] = useState(null);
    const [activeUsers, setActiveUsers] = useState([]); // For Admin
    const [selectedUser, setSelectedUser] = useState(null); // For Admin
    const [messages, setMessages] = useState([]); // Array of {from, message, self}

    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Cleanup on unmount
        return () => {
            if (socket) socket.disconnect();
        }
    }, [socket]);

    const selectedUserRef = useRef(null);

    useEffect(() => {
        selectedUserRef.current = selectedUser;
    }, [selectedUser]);

    const handleLogin = (selectedRole) => {
        if (!username) return alert("Please enter a name");

        const newSocket = io(ENDPOINT);
        setSocket(newSocket);
        setRole(selectedRole);

        newSocket.on("connect", () => {
            setIsConnected(true);
            console.log("Socket Connected");
        });

        newSocket.on("disconnect", () => {
            setIsConnected(false);
            console.log("Socket Disconnected");
        });

        newSocket.on("connect_error", (err) => {
            console.error("Connection Error:", err);
            alert(`Connection failed: ${err.message}. Check if Backend is running and IP is correct.`);
        });

        newSocket.emit("login", { username, role: selectedRole });

        newSocket.on("update_user_list", (users) => {
            setActiveUsers(users.map(u => ({ ...u, unread: false })));
        });

        newSocket.on("user_connected", (user) => {
            setActiveUsers(prev => [...prev, { ...user, unread: false }]);
        });

        newSocket.on("user_disconnected", (userId) => {
            setActiveUsers(prev => prev.filter(u => u.id !== userId));
            if (selectedUserRef.current?.id === userId) setSelectedUser(null);
        });

        newSocket.on("receive_private_message", (data) => {
            setMessages(prev => [...prev, { from: data.from, message: data.message, self: false, to: null }]);

            // Mark user as unread if NOT currently selected
            // We use fromId to find the user in the list? Or match username?
            // data.from is username.
            if (selectedUserRef.current?.username !== data.from) {
                setActiveUsers(prev => prev.map(user =>
                    user.username === data.from ? { ...user, unread: true } : user
                ));
            }
        });
    };

    const handleSendMessage = (message) => {
        if (!message.trim()) return;

        if (role === 'user') {
            // User sends to Admin (conceptually 'Store') - simplified for demo: send to all admins or just log
            // For this demo, we can just broadcast or assume a default admin receiver if we had one.
            // But the requirement says "User chat with Store".
            // Let's emit a 'private_message' to a specific target if we knew ID, or just 'send_message' to a room.
            // To keep it simple per request: User <-> Admin.
            // We'll emulate "Store" as any Admin listening.

            // Better approach for User: Send to a 'admin_room' or just broadcast 'send_message' and filter on Admin side?
            // Let's use the 'private_message' event but we need a target ID.
            // For simplicity in this specific "User <-> Store" flow:
            // The User just speaks to "The Store".
            // We can broadcast to all Admins? 
            // User will send to 'admin' (handled by server to find admin?) or just use 'send_message' to a room.

            // Let's stick to the User <-> specific Admin flow for the "2 laptops" requirement.
            // Admin picks a User. Messages go to THAT User.
            // User needs to reply to THAT Admin? Or just "The Admin"?

            // Let's strictly implement: 
            // Admin selects User -> socket.emit('private_message', { to: userId, ... })
            // User sends message -> socket.emit('private_message', { to: ??? })
            // To fix this for the demo: The User will just wait for an Admin to message them, OR we broadcast to Admins.
            // OR: We simulate "Admin" as a fixed room?

            // REVISED PLAN FOR USER:
            // User sends to 'send_message' (general room) for now, OR we capture the Admin's ID from the first message received.
            // Let's assume User -> Admin communication is initiated by User sending to a "support" room.

            // Wait, standard architecture:
            // User joins. Admin sees User. Admin clicks User. Admin sends msg.
            // User receives msg. User replies to SENDER.

            // Implementation:
            // When User receives private message, they store the 'from' ID as current chat partner?
            // Simple Hack: User broadcasts to "admins".

            // Let's use a simpler "Join Chat" approach:
            // User joins unique room (socket.id).
            // Admin joins that room? No, Admin stays outside.

            // Let's use the `private_message` with a catch:
            // If User sends, they need a recipient.
            // Let's emit to "admins" (pseudo-broadcast).
            // To simplify: I will send to "active_admin" if I have one?
            // NO, simpler:
            // Message include { to: activeChatPartnerId }.
        }
    };

    // Actually, let's refine the handler for simplicity/robustness:
    // Admin: Selects User from list. Send to User.ID.
    // User: When sending, if they have a 'last_admin_id' they send to it?

    // Let's make it so User messages are just "sent" and the Server routes them to Admins?
    // Or simpler: User messages are broadcast to a 'support' room that Admins join?

    // Let's go with:
    // Admin joins.
    // User joins.
    // User sends message -> Server -> All Admins receive.
    // Admin replies -> Server -> Specific User.

    // I need to update server.js to support 'message_to_admins' event?
    // Yes, that's cleaner. User doesn't need to know Admin ID.

    // Refined Server Logic needed?
    // Existing: socket.on("private_message", ({ to, message, from }))
    // Only Admin knows 'to'. 
    // User doesn't know 'to'.

    // Solution for User:
    // User emits 'send_to_store', { message }.
    // Server: io.emit to all Admins.

    // I will just use 'send_message' with a type?
    // Let's handle this in the Frontend component logic below.

    return (
        <div
            className="fixed inset-0 z-50 text-white flex flex-col bg-cover bg-center"
            style={{ backgroundImage: "url('/assets/images/chat-bg.jpeg')" }}
        >
            {/* Top Bar */}
            <div className="h-16 bg-black/80 backdrop-blur-md flex items-center justify-between px-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <h1 className="text-xl font-bold">Apple Support Chat</h1>
                    {role && (
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${isConnected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            {isConnected ? 'Connected' : 'Disconnected'}
                        </div>
                    )}
                </div>
                <button onClick={onBack} className="text-sm text-gray-400 hover:text-white">Exit</button>
            </div>

            {!role ? (
                // Role Selection Screen
                <div className="flex-1 flex flex-col items-center justify-center gap-8">
                    <h2 className="text-3xl font-semibold">Choose your role</h2>
                    <input
                        type="text"
                        placeholder="Enter your name"
                        className="px-4 py-2 rounded text-black w-64"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                    <div className="flex gap-6">
                        <button
                            onClick={() => handleLogin('user')}
                            className="bg-blue-600 hover:bg-blue-500 px-8 py-4 rounded-xl text-xl font-bold transition-all"
                        >
                            I am a User
                        </button>
                        <button
                            onClick={() => handleLogin('admin')}
                            className="bg-zinc-700 hover:bg-zinc-600 px-8 py-4 rounded-xl text-xl font-bold transition-all"
                        >
                            I am the Store (Admin)
                        </button>
                    </div>
                </div>
            ) : (
                // Chat Interface
                <div className="flex-1 flex overflow-hidden">
                    {/* Sidebar (Only for Admin) */}
                    {role === 'admin' && (
                        <ChatSidebar
                            users={activeUsers}
                            selectedUser={selectedUser}
                            onSelectUser={(user) => {
                                setSelectedUser(user);
                                // Clear unread status
                                setActiveUsers(prev => prev.map(u => u.id === user.id ? { ...u, unread: false } : u));
                            }}
                        />
                    )}

                    {/* Chat Window */}
                    <ChatWindow
                        role={role}
                        socket={socket}
                        selectedUser={selectedUser} // Admin uses this to know who to send to
                        myUsername={username}
                        messages={messages}
                        setMessages={setMessages}
                    />
                </div>
            )}
        </div>
    );
};

export default ChatPage;
