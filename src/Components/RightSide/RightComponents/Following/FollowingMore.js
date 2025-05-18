import React, { useState, useEffect, useContext } from 'react';
import { Modal } from '@mantine/core';
import { getFollowers, followUser } from '../../../../api';
import { AuthContext } from '../../../../index';

const BASE_URL = 'http://localhost:5000'; // Có thể lấy từ biến môi trường

const FollowingMore = ({ showMore, setShowMore }) => {
  const { userId } = useContext(AuthContext);
  const [followers, setFollowers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFollowers = async () => {
      if (!userId) {
        setError('Vui lòng đăng nhập để xem người theo dõi');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await getFollowers(userId);
        setFollowers(response);
      } catch (error) {
        setError(error.response?.data?.msg || 'Không thể tải người theo dõi');
      } finally {
        setLoading(false);
      }
    };
    fetchFollowers();
  }, [userId]);

  const handleFollow = async (followerId) => {
    try {
      const response = await followUser(followerId);
      if (response.followed) {
        setFollowers(followers.filter(user => user.id !== followerId));
      }
    } catch (error) {
      setError(error.response?.data?.msg || 'Không thể theo dõi người dùng');
    }
  };

  return (
    <Modal
      className='modelShowMore'
      radius="8px"
      opened={showMore}
      onClose={() => setShowMore(false)}
      transitionProps={{ transition: 'fade', duration: 200 }}
      title="Người đang theo dõi bạn"
      centered
      padding="20px"
      zIndex={2000}
    >
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      {loading ? (
        <p style={{ textAlign: 'center', padding: '20px' }}>Đang tải...</p>
      ) : followers.length === 0 ? (
        <p style={{ textAlign: 'center' }}>Không có người theo dõi</p>
      ) : (
        followers.map((user) => (
          <div key={user.id} style={{ marginTop: '20px' }} className="following-people">
            <div className="following-details">
              <img
                src={user.profilePicture ? `${BASE_URL}${user.profilePicture}` : '/images/default-profile.jpg'}
                alt={`${user.username}'s profile picture`}
                onError={(e) => (e.target.src = '/images/default-profile.jpg')}
              />
              <div className="following-name-username">
                <h3>{user.username}</h3>
                <p>{user.profileTag}</p>
              </div>
            </div>
            <button
              className='Rbtn'
              style={{ background: 'linear-gradient(107deg, rgb(255, 67, 5) 11.1%, rgb(245, 135, 0) 95.3%)' }}
              onClick={() => handleFollow(user.id)}
            >
              Theo dõi
            </button>
          </div>
        ))
      )}
    </Modal>
  );
};

export default FollowingMore;