import React, { useState, useEffect } from 'react';
import '../Online/Online.css';
import OnlineList from './OnlineList';
import { getSuggestions } from '../../../../api';

const Online = () => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOnlineUsers = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Vui lòng đăng nhập để xem bạn bè online');
        return;
      }

      try {
        const { data } = await getSuggestions();
        setOnlineUsers(data);
      } catch (err) {
        if (err.response?.status === 401) {
          setError('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
          localStorage.removeItem('token');
          window.location.href = '/';
        } else {
          setError(err.response?.data?.msg || 'Không thể tải bạn bè online');
        }
      }
    };
    fetchOnlineUsers();
  }, []);

  return (
    <div className="online-comp">
      <h2>Bạn bè đang online</h2>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      {onlineUsers.map((value, id) => (
        <OnlineList
          value={value}
          key={id}
        />
      ))}
      {onlineUsers.length === 0 && !error && <p style={{ textAlign: 'center' }}>Không có bạn bè online</p>}
    </div>
  );
};

export default Online;