import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../hooks/useSocket';
import { useAuth } from '../../hooks/useAuth';

const ChatWindow = ({ conversationId, participants }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messageEndRef = useRef(null);
    const socket = useSocket();
    const { user } = useAuth();

    useEffect(() => {
        if (socket) {
            // Load initial messages
            socket.emit('join_conversation', conversationId);
            socket.emit('get_messages', conversationId);

            // Listen for new messages
            socket.on('new_message', (message) => {
                setMessages(prev => [...prev, message]);
            });

            // Listen for typing status
            socket.on('typing_status', ({ userId, isTyping }) => {
                if (userId !== user.id) {
                    setIsTyping(isTyping);
                }
            });

            return () => {
                socket.off('new_message');
                socket.off('typing_status');
                socket.emit('leave_conversation', conversationId);
            };
        }
    }, [socket, conversationId, user.id]);

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim()) {
            socket.emit('send_message', {
                conversationId,
                content: newMessage,
                senderId: user.id
            });
            setNewMessage('');
        }
    };

    const handleTyping = () => {
        socket.emit('typing', { conversationId, userId: user.id, isTyping: true });
        setTimeout(() => {
            socket.emit('typing', { conversationId, userId: user.id, isTyping: false });
        }, 2000);
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-xs px-4 py-2 rounded-lg ${message.senderId === user.id ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                        >
                            {message.content}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="text-sm text-gray-500 italic">
                        Someone is typing...
                    </div>
                )}
                <div ref={messageEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleTyping}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatWindow;