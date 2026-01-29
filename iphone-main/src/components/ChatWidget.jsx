import React, { useEffect, useState } from "react";
import io from "socket.io-client";

// Initialize socket connection
const socket = io.connect("http://localhost:5000"); // Ensure this matches backend port

const ChatWidget = ({ onClose }) => {
    const [username, setUsername] = useState("");
    const [room, setRoom] = useState("general_support"); // Default room
    const [showChat, setShowChat] = useState(false);
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);

    const joinRoom = () => {
        if (username !== "" && room !== "") {
            socket.emit("join_room", room);
            setShowChat(true);
        }
    };

    const sendMessage = async () => {
        if (currentMessage !== "") {
            const messageData = {
                room: room,
                author: username,
                message: currentMessage,
                time:
                    new Date(Date.now()).getHours() +
                    ":" +
                    new Date(Date.now()).getMinutes(),
            };

            await socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage("");
        }
    };

    useEffect(() => {
        const handleReceiveMessage = (data) => {
            setMessageList((list) => [...list, data]);
        };

        socket.on("receive_message", handleReceiveMessage);

        return () => {
            socket.off("receive_message", handleReceiveMessage);
        };
    }, [socket]);

    return (
        <div className="fixed bottom-5 right-5 z-50 w-80 bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200 font-sans text-black">
            {/* Header */}
            <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
                <h3 className="font-bold">Live Chat</h3>
                <button onClick={onClose} className="text-white hover:text-gray-200">
                    ✕
                </button>
            </div>

            {!showChat ? (
                <div className="p-5 flex flex-col gap-4">
                    <h4 className="text-center font-semibold text-gray-700">Join Chat</h4>
                    <input
                        type="text"
                        placeholder="Your Name / Role"
                        className="border p-2 rounded outline-none focus:border-blue-500"
                        onChange={(event) => setUsername(event.target.value)}
                    />
                    {/* Hidden room input for now, default to general_support */}
                    <button
                        onClick={joinRoom}
                        className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
                    >
                        Join
                    </button>
                </div>
            ) : (
                <>
                    {/* Chat Body */}
                    <div className="h-64 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-2">
                        {messageList.map((messageContent, index) => {
                            const isMyMessage = username === messageContent.author;
                            return (
                                <div
                                    key={index}
                                    className={`flex flex-col ${isMyMessage ? "items-end" : "items-start"}`}
                                >
                                    <div
                                        className={`max-w-[80%] break-words p-2 rounded-lg text-sm ${isMyMessage
                                                ? "bg-blue-600 text-white rounded-br-none"
                                                : "bg-gray-200 text-gray-800 rounded-bl-none"
                                            }`}
                                    >
                                        <p>{messageContent.message}</p>
                                    </div>
                                    <div className="flex gap-1 text-[10px] text-gray-500 mt-1">
                                        <span className="font-bold">{messageContent.author}</span>
                                        <span>{messageContent.time}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Chat Footer */}
                    <div className="p-3 border-t border-gray-200 flex gap-2 bg-white">
                        <input
                            type="text"
                            value={currentMessage}
                            placeholder="Type a message..."
                            className="flex-1 border p-2 rounded-full outline-none focus:border-blue-500 text-sm"
                            onChange={(event) => setCurrentMessage(event.target.value)}
                            onKeyPress={(event) => {
                                event.key === "Enter" && sendMessage();
                            }}
                        />
                        <button
                            onClick={sendMessage}
                            className="bg-blue-600 text-white p-2 rounded-full w-10 h-10 flex items-center justify-center hover:bg-blue-700"
                        >
                            ➤
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ChatWidget;
