import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  FiSend, 
  FiMessageCircle, 
  FiUser, 
  FiSearch, 
  FiMoreVertical 
} from 'react-icons/fi';

const MessagingPage = () => {
  const [conversations, setConversations] = useState([
    {
      id: 1,
      name: 'Ahmed Khan',
      avatar: '/images/avatars/agent1.jpg',
      lastMessage: 'Are you interested in the Gulshan apartment?',
      unread: 2,
      messages: [
        { id: 1, sender: 'Ahmed Khan', text: 'Hi, are you interested in the Gulshan apartment?', timestamp: '10:30 AM' },
        { id: 2, sender: 'You', text: 'Yes, I would like to know more details.', timestamp: '10:35 AM' },
      ]
    },
    {
      id: 2,
      name: 'Fatima Rahman',
      avatar: '/images/avatars/agent2.jpg',
      lastMessage: 'The property is available from next month.',
      unread: 1,
      messages: [
        { id: 1, sender: 'Fatima Rahman', text: 'The property is available from next month.', timestamp: '09:45 AM' },
      ]
    }
  ]);

  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const updatedConversations = conversations.map(conv => {
      if (conv.id === selectedConversation.id) {
        return {
          ...conv,
          messages: [
            ...conv.messages,
            { 
              id: conv.messages.length + 1, 
              sender: 'You', 
              text: newMessage, 
              timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
            }
          ]
        };
      }
      return conv;
    });

    setConversations(updatedConversations);
    setSelectedConversation(
      updatedConversations.find(conv => conv.id === selectedConversation.id)
    );
    setNewMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-white/70 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-3 h-[700px]">
          {/* Conversations List */}
          <div className="col-span-1 border-r border-gray-200/50 overflow-y-auto">
            <div className="p-4 border-b border-gray-200/50">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search conversations"
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-xl focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {conversations.map(conversation => (
              <motion.div
                key={conversation.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedConversation(conversation)}
                className={`p-4 flex items-center space-x-4 cursor-pointer transition-colors ${
                  selectedConversation?.id === conversation.id 
                    ? 'bg-primary-50' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <div className="relative">
                  <img 
                    src={conversation.avatar} 
                    alt={conversation.name} 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {conversation.unread > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {conversation.unread}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{conversation.name}</h3>
                  <p className="text-sm text-gray-500 truncate">
                    {conversation.lastMessage}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Chat Window */}
          <div className="col-span-2 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 flex justify-between items-center border-b border-gray-200/50">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={selectedConversation.avatar} 
                      alt={selectedConversation.name} 
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {selectedConversation.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Real Estate Agent
                      </p>
                    </div>
                  </div>
                  <button className="text-gray-500 hover:text-gray-700">
                    <FiMoreVertical />
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedConversation.messages.map(message => (
                    <div 
                      key={message.id} 
                      className={`flex ${
                        message.sender === 'You' 
                          ? 'justify-end' 
                          : 'justify-start'
                      }`}
                    >
                      <div 
                        className={`max-w-[70%] p-3 rounded-xl ${
                          message.sender === 'You'
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p>{message.text}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200/50 flex items-center space-x-4">
                  <input 
                    type="text" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 p-3 bg-gray-100 rounded-xl focus:ring-2 focus:ring-primary-500"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={sendMessage}
                    className="bg-primary-600 text-white p-3 rounded-full"
                  >
                    <FiSend />
                  </motion.button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <FiMessageCircle className="text-6xl text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Select a conversation to start messaging
                </h3>
                <p className="text-gray-500">
                  Choose a contact from the list to view your conversation
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagingPage;
