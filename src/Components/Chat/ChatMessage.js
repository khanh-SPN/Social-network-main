import React from 'react';
import './Chat.css';

const ChatMessage = ({ message, isSent }) => {
  return (
    <div className={`chat-message ${isSent ? 'sent' : 'received'}`}>
      <p>{message.content}</p>
      <span>{new Date(message.createdAt).toLocaleTimeString()}</span>
    </div>
  );
};

export default ChatMessage;