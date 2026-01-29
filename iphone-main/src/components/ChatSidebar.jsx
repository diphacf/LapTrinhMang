
import React from 'react';

const ChatSidebar = ({ users, selectedUser, onSelectUser }) => {
    return (
        <div className="w-1/4 bg-black/60 backdrop-blur-sm border-r border-white/10 flex flex-col">
            <div className="p-4 border-b border-white/10">
                <h2 className="text-lg font-semibold text-gray-200">Active Users</h2>
            </div>

            <div className="flex-1 overflow-y-auto">
                {users.length === 0 ? (
                    <div className="p-4 text-gray-500 text-center">No users online</div>
                ) : (
                    users.map(user => (
                        <div
                            key={user.id}
                            onClick={() => onSelectUser(user)}
                            className={`p-4 border-b border-zinc-700 cursor-pointer hover:bg-zinc-700 transition-colors flex items-center gap-3 ${selectedUser?.id === user.id ? 'bg-zinc-700' : ''}`}
                        >
                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                                {user.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div className="flex justify-between items-center w-32">
                                    <p className="font-medium text-white truncate">{user.username}</p>
                                    {user.unread && (
                                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></div>
                                    )}
                                </div>
                                <p className="text-xs text-green-400">Online</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ChatSidebar;
