import React, { useState, useEffect, useRef } from 'react';
import { getMessages, sendMessage } from '../../api';
import ChatMessage from './ChatMessage';
import './Chat.css';

const BASE_URL = 'http://localhost:5000';

const ChatWindow = ({ selectedUser, currentUserId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await getMessages(selectedUser.id);
        console.log('Fetched messages:', response);
        setMessages(response.messages);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setError(error.response?.data?.msg || 'Không thể tải tin nhắn');
      } finally {
        setLoading(false);
      }
    };
    if (selectedUser) fetchMessages();
  }, [selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const response = await sendMessage({
        recipientId: selectedUser.id,
        content: newMessage,
      });
      console.log('Sent message:', response);
      setMessages([...messages, response]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      setError(error.response?.data?.msg || 'Không thể gửi tin nhắn');
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <img
          src={selectedUser.profilePicture ? `${BASE_URL}${selectedUser.profilePicture}` : '/images/default-profile.jpg'}
          alt={`${selectedUser.username}'s profile picture`}
          className="chat-header-img"
          onError={(e) => (e.target.src = '/images/default-profile.jpg')}
        />
        <h3>{selectedUser.username}</h3>
      </div>
      <div className="chat-messages">
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        {loading ? (
          <p style={{ textAlign: 'center' }}>Đang tải tin nhắn...</p>
        ) : messages.length === 0 ? (
          <p style={{ textAlign: 'center' }}>Chưa có tin nhắn</p>
        ) : (
          messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              isSent={msg.sender_id === currentUserId}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <form className="chat-input" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Nhập tin nhắn..."
        />
        <button type="submit">Gửi</button>
      </form>
    </div>
  );
};

export default ChatWindow;