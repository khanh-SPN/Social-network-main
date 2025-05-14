import React, { useState, useEffect, useContext } from 'react';
import '../Online/Online.css';
import OnlineList from './OnlineList';
import { getSuggestions } from '../../../../api';
import { AuthContext } from '../../../../index';
import { useNavigate } from 'react-router-dom';

const Online = () => {
  const { userId } = useContext(AuthContext);
  const navigate = useNavigate();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOnlineUsers = async () => {
      if (!userId) {
        setError('Vui lòng đăng nhập để xem bạn bè online');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getSuggestions();
        setOnlineUsers(response);
      } catch (error) {
        if (error.response?.status === 401) {
          setError('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          navigate('/');
        } else {
          setError(error.response?.data?.msg || 'Không thể tải bạn bè online');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchOnlineUsers();
  }, [userId, navigate]);

  return (
    <div className="online-comp">
      <h2>Bạn bè đang online</h2>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      {loading ? (
        <p style={{ textAlign: 'center', padding: '20px' }}>Đang tải...</p>
      ) : onlineUsers.length === 0 ? (
        <p style={{ textAlign: 'center' }}>Không có bạn bè online</p>
      ) : (
        onlineUsers.map((value) => (
          <OnlineList
            value={value}
            key={value.id}
          />
        ))
      )}
    </div>
  );
};

export default Online;