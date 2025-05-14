import React, { useState, useEffect } from 'react';
import { followUser, unfollowUser } from '../../../../api';

const FollowingUList = ({ data, following, setFollowing }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followText, setFollowText] = useState('Theo dõi');
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        setUserId(decoded.id);
      } catch (err) {
        setError('Token không hợp lệ');
      }
    }
  }, []);

  const handleFollow = async () => {
    if (!userId) {
      setError('Vui lòng đăng nhập để theo dõi');
      return;
    }

    try {
      if (isFollowing) {
        await unfollowUser(data.id);
        setFollowing(following - 1);
        setFollowText('Theo dõi');
        setIsFollowing(false);
      } else {
        const { data: response } = await followUser(data.id);
        if (response.followed) {
          setFollowing(following + 1);
          setFollowText('Đang theo dõi');
          setIsFollowing(true);
        }
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Không thể theo dõi/bỏ theo dõi');
    }
  };

  return (
    <div className="following-people">
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <div className="following-details">
        <img src={data.profilePicture || data.img} alt={`${data.name || data.username}'s profile picture`} />
        <div className="following-name-username">
          <h3>{data.name || data.username}</h3>
          <p>{data.profileTag || data.username}</p>
        </div>
      </div>
      <button
        style={{
          background: isFollowing ? 'transparent' : 'linear-gradient(107deg, rgb(255, 67, 5) 11.1%, rgb(245, 135, 0) 95.3%)',
          color: isFollowing ? 'black' : 'white',
          border: isFollowing ? '2px solid orangered' : 'none',
        }}
        onClick={handleFollow}
      >
        {followText}
      </button>
    </div>
  );
};

export default FollowingUList;