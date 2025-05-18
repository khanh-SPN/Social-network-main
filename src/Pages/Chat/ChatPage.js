import React, { useState, useContext } from 'react';
import { AuthContext } from '../../index';
import ChatList from '../../Components/Chat/ChatList';
import ChatWindow from '../../Components/Chat/ChatWindow';
import '../../Components/Chat/Chat.css';

const ChatPage = () => {
  const { userId } = useContext(AuthContext);
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="chat-page">
      <h2>Chat</h2>
      <div className="chat-container">
        <ChatList setSelectedUser={setSelectedUser} selectedUser={selectedUser} />
        {selectedUser ? (
          <ChatWindow selectedUser={selectedUser} currentUserId={userId} />
        ) : (
          <div className="chat-placeholder">Chọn một cuộc trò chuyện để bắt đầu</div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;