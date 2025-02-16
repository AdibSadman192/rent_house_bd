import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { FiMessageSquare, FiSend, FiSearch } from 'react-icons/fi';

export default function MessagesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch messages when component mounts or user changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        const response = await fetch('/api/messages', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }

        const data = await response.json();
        setMessages(data.conversations || []);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchMessages();
    }
  }, [user]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [loading, user, router]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId: selectedConversation.id,
          message: newMessage
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      // Update local messages state
      const newMessageObj = await response.json();
      setSelectedConversation(prev => ({
        ...prev,
        messages: [...prev.messages, newMessageObj]
      }));
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout>
      <Head>
        <title>Messages | RentHouseBD</title>
      </Head>

      <div className="min-h-screen bg-gray-50 p-6">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <FiMessageSquare className="mr-3 text-primary-600" /> Messages
          </h1>

          <div className="grid grid-cols-12 gap-6 bg-white rounded-xl shadow-soft">
            {/* Conversations List */}
            <div className="col-span-4 border-r border-gray-100 p-6">
              <div className="relative mb-6">
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
              </div>

              {isLoading ? (
                <div className="text-center text-gray-500">Loading conversations...</div>
              ) : messages.length === 0 ? (
                <div className="text-center text-gray-500">No conversations found</div>
              ) : (
                messages.map(conversation => (
                  <div 
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 
                      ${selectedConversation?.id === conversation.id ? 'bg-primary-50' : ''}`}
                  >
                    <div className="flex items-center">
                      <img 
                        src={conversation.participant.avatar || '/default-avatar.png'} 
                        alt={conversation.participant.name}
                        className="w-10 h-10 rounded-full mr-4"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">{conversation.participant.name}</h3>
                        <p className="text-sm text-gray-500 truncate">
                          {conversation.lastMessage?.text || 'No messages yet'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Thread */}
            <div className="col-span-8 p-6">
              {selectedConversation ? (
                <div className="h-full flex flex-col">
                  <div className="flex items-center mb-6 pb-4 border-b border-gray-100">
                    <img 
                      src={selectedConversation.participant.avatar || '/default-avatar.png'} 
                      alt={selectedConversation.participant.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h2 className="font-bold text-gray-900">{selectedConversation.participant.name}</h2>
                      <p className="text-sm text-gray-500">Active now</p>
                    </div>
                  </div>

                  <div className="flex-grow overflow-y-auto mb-6 space-y-4 pr-4">
                    {selectedConversation.messages.map((msg, index) => (
                      <div 
                        key={index} 
                        className={`flex ${
                          msg.senderId === user.id ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div 
                          className={`max-w-[70%] p-3 rounded-lg ${
                            msg.senderId === user.id 
                              ? 'bg-primary-500 text-white' 
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center space-x-4">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Type a message..."
                      className="flex-grow px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                    <button 
                      onClick={sendMessage}
                      className="bg-primary-500 text-white p-2.5 rounded-full hover:bg-primary-600"
                    >
                      <FiSend />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  Select a conversation to start messaging
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
