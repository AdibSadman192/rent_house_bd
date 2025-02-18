import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';

const ChatbotWindow = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messageEndRef = useRef(null);
    const { user } = useAuth();

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim()) {
            try {
                setIsLoading(true);
                const userMessage = {
                    content: newMessage,
                    sender: 'user',
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, userMessage]);
                setNewMessage('');

                const response = await fetch('/api/chatbot/message', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        message: newMessage,
                        userId: user.id
                    })
                });

                const data = await response.json();
                const botMessage = {
                    content: data.text,
                    sender: 'bot',
                    sentiment: data.sentiment,
                    timestamp: new Date()
                };

                setMessages(prev => [...prev, botMessage]);
            } catch (error) {
                console.error('Error sending message:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
            <div className="bg-blue-500 text-white p-4 rounded-t-lg">
                <h2 className="text-lg font-semibold">AI Property Assistant</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-xs px-4 py-2 rounded-lg ${
                                message.sender === 'user' 
                                    ? 'bg-blue-500 text-white' 
                                    : 'bg-gray-100'
                            }`}
                        >
                            {message.content}
                            {message.sentiment && (
                                <div className="text-xs mt-1 opacity-75">
                                    Sentiment: {message.sentiment.toLowerCase()}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="text-sm text-gray-500 italic">
                        AI is thinking...
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
                        placeholder="Ask about properties..."
                        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            isLoading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        disabled={isLoading}
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatbotWindow;