import React, { useState, useEffect } from 'react';
import { Modal } from '@mantine/core';
import { getFollowers, followUser } from '../../../../api';

const FollowingMore = ({ showMore, setShowMore }) => {
  const [followers, setFollowers] = useState([]);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        setUserId(decoded.id);
      } catch (err) {
        setError('Token không hợp lệ, vui lòng đăng nhập lại');
      }
    } else {
      setError('Vui lòng đăng nhập để xem người theo dõi');
    }
  }, []);

  useEffect(() => {
    const fetchFollowers = async () => {
      if (!userId) return;
      try {
        const { data } = await getFollowers(userId);
        setFollowers(data);
      } catch (err) {
        setError(err.response?.data?.msg || 'Không thể tải người theo dõi');
      }
    };
    fetchFollowers();
  }, [userId]);

  const handleFollow = async (followerId) => {
    try {
      await followUser(followerId);
      setFollowers(followers.filter(user => user.id !== followerId));
    } catch (err) {
      setError(err.response?.data?.msg || 'Không thể theo dõi người dùng');
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
      {followers.map((user) => (
        <div key={user.id} style={{ marginTop: '20px' }} className="following-people">
          <div className="following-details">
            <img src={user.profilePicture || ''} alt={`${user.username}'s profile picture`} />
            <div className="following-name-username">
              <h3>{user.username}</h3>
              <p>{user.profileTag || user.username}</p>
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
      ))}
      {followers.length === 0 && !error && <p style={{ textAlign: 'center' }}>Không có người theo dõi</p>}
    </Modal>
  );
};

export default FollowingMore;