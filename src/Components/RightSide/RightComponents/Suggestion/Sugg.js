import React, { useState, useEffect } from 'react';
import '../Suggestion/Sugg.css';
import { getSuggestions, followUser } from '../../../../api';

const Sugg = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        setUserId(decoded.id);
      } catch (err) {
        setError('Token không hợp lệ, vui lòng đăng nhập lại');
        localStorage.removeItem('token');
        window.location.href = '/';
      }
    } else {
      setError('Vui lòng đăng nhập để xem gợi ý');
    }
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!userId) return;
      try {
        const { data } = await getSuggestions();
        setSuggestions(data);
      } catch (err) {
        if (err.response?.status === 401) {
          setError('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
          localStorage.removeItem('token');
          window.location.href = '/';
        } else {
          setError(err.response?.data?.msg || 'Không thể tải gợi ý người dùng');
        }
      }
    };
    fetchSuggestions();
  }, [userId]);

  const handleFollow = async (userId) => {
    try {
      await followUser(userId);
      setSuggestions(suggestions.filter(user => user.id !== userId));
    } catch (err) {
      setError(err.response?.data?.msg || 'Không thể theo dõi người dùng');
    }
  };

  const handleDismiss = (userId) => {
    setSuggestions(suggestions.filter(user => user.id !== userId));
  };

  return (
    <div className="Sugg-comp">
      <h2>Gợi ý cho bạn</h2>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      {suggestions.map(user => (
        <div className="sugg-people" key={user.id}>
          <div className="s-left">
            <img src={user.profilePicture || ''} alt={`${user.username}'s profile picture`} />
            <div>
              <h3>{user.username}</h3>
              <p>{user.profileTag}</p>
            </div>
          </div>
          <div className="s-right">
            <button onClick={() => handleFollow(user.id)}>Theo dõi</button>
            <button onClick={() => handleDismiss(user.id)}>Bỏ qua</button>
          </div>
        </div>
      ))}
      {suggestions.length === 0 && !error && <p style={{ textAlign: 'center' }}>Không có gợi ý nào</p>}
    </div>
  );
};

export default Sugg;