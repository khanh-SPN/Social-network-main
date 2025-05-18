import React, { useState, useEffect, useContext } from 'react';
import '../Suggestion/Sugg.css';
import { getSuggestions, followUser } from '../../../../api';
import { AuthContext } from '../../../../index';
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'http://localhost:5000'; // Có thể lấy từ biến môi trường

const Sugg = () => {
  const { userId } = useContext(AuthContext);
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!userId) {
        setError('Vui lòng đăng nhập để xem gợi ý');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await getSuggestions();
        setSuggestions(response);
      } catch (error) {
        if (error.response?.status === 401) {
          setError('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          navigate('/');
        } else {
          setError(error.response?.data?.msg || 'Không thể tải gợi ý người dùng');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchSuggestions();
  }, [userId, navigate]);

  const handleFollow = async (followId) => {
    try {
      const response = await followUser(followId);
      if (response.followed) {
        setSuggestions(suggestions.filter(user => user.id !== followId));
      }
    } catch (error) {
      setError(error.response?.data?.msg || 'Không thể theo dõi người dùng');
    }
  };

  const handleDismiss = (dismissId) => {
    setSuggestions(suggestions.filter(user => user.id !== dismissId));
  };

  return (
    <div className="Sugg-comp">
      <h2>Gợi ý cho bạn</h2>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      {loading ? (
        <p style={{ textAlign: 'center', padding: '20px' }}>Đang tải...</p>
      ) : suggestions.length === 0 ? (
        <p style={{ textAlign: 'center' }}>Không có gợi ý nào</p>
      ) : (
        suggestions.map(user => (
          <div className="sugg-people" key={user.id}>
            <div className="s-left">
              <img
                src={user.profilePicture ? `${BASE_URL}${user.profilePicture}` : '/images/default-profile.jpg'}
                alt={`${user.username}'s profile picture`}
                onError={(e) => (e.target.src = '/images/default-profile.jpg')}
              />
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
        ))
      )}
    </div>
  );
};

export default Sugg;