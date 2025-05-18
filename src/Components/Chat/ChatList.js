import React, { useState, useEffect } from 'react';
import { getConversations } from '../../api';
import './Chat.css';

const BASE_URL = 'http://localhost:5000';

const ChatList = ({ setSelectedUser, selectedUser }) => {
  const [conversations, setConversations] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const response = await getConversations();
        console.log('Fetched conversations:', response);
        setConversations(response);
      } catch (error) {
        console.error('Error fetching conversations:', error);
        setError(error.response?.data?.msg || 'Không thể tải danh sách cuộc trò chuyện');
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  return (
    <div className="chat-list">
      <h3>Cuộc trò chuyện</h3>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      {loading ? (
        <p style={{ textAlign: 'center' }}>Đang tải...</p>
      ) : conversations.length === 0 ? (
        <p style={{ textAlign: 'center' }}>Chưa có cuộc trò chuyện nào</p>
      ) : (
        conversations.map((conv) => (
          <div
            key={conv.id}
            className={`chat-list-item ${selectedUser?.id === conv.user.id ? 'active' : ''}`}
            onClick={() => {
              console.log('Selected user:', conv.user);
              setSelectedUser(conv.user);
            }}
          >
            <img
              src={conv.user.profilePicture ? `${BASE_URL}${conv.user.profilePicture}` : '/images/default-profile.jpg'}
              alt={`${conv.user.username}'s profile picture`}
              className="chat-list-img"
              onError={(e) => (e.target.src = '/images/default-profile.jpg')}
            />
            <div className="chat-list-info">
              <h4>{conv.user.username}</h4>
              <p>{conv.lastMessage ? conv.lastMessage.substring(0, 20) + '...' : 'Chưa có tin nhắn'}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ChatList;