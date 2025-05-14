import React, { useState, useContext } from 'react';
import { followUser, unfollowUser } from '../../../../api';
import { AuthContext } from '../../../../index';

const FollowingUList = ({ data, following, setFollowing }) => {
  const { userId } = useContext(AuthContext);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followText, setFollowText] = useState('Theo dõi');
  const [error, setError] = useState('');

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
        const response = await followUser(data.id);
        if (response.followed) {
          setFollowing(following + 1);
          setFollowText('Đang theo dõi');
          setIsFollowing(true);
        }
      }
    } catch (error) {
      setError(error.response?.data?.msg || 'Không thể theo dõi/bỏ theo dõi');
    }
  };

  return (
    <div className="following-people">
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <div className="following-details">
        <img src={data.profilePicture || '/default-profile.jpg'} alt={`${data.username}'s profile picture`} />
        <div className="following-name-username">
          <h3>{data.username}</h3>
          <p>{data.profileTag}</p>
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