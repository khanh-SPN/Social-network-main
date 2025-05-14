import React, { useState, useEffect } from 'react';
import '../Following/FollowingU.css';
import FollowingUList from './FollowingUList';
import FollowingMore from './FollowingMore';
import { getFollowers } from '../../../../api';

const FollowingU = ({ following, setFollowing }) => {
  const [followers, setFollowers] = useState([]);
  const [showMore, setShowMore] = useState(false);
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
        setFollowing(data.length);
      } catch (err) {
        setError(err.response?.data?.msg || 'Không thể tải người theo dõi');
      }
    };
    fetchFollowers();
  }, [userId, setFollowing]);

  return (
    <div className="following-comp">
      <h2>Người đang theo dõi bạn</h2>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      {followers.map((user) => (
        <FollowingUList
          following={following}
          setFollowing={setFollowing}
          data={user}
          key={user.id}
        />
      ))}
      <FollowingMore
        showMore={showMore}
        setShowMore={setShowMore}
      />
      <button className='SM-btn' onClick={() => setShowMore(true)}>Xem thêm</button>
    </div>
  );
};

export default FollowingU;