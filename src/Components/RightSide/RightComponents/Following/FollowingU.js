import React, { useState, useEffect, useContext } from 'react';
import '../Following/FollowingU.css';
import FollowingUList from './FollowingUList';
import FollowingMore from './FollowingMore';
import { getFollowers } from '../../../../api';
import { AuthContext } from '../../../../index';

const FollowingU = ({ following, setFollowing }) => {
  const { userId } = useContext(AuthContext);
  const [followers, setFollowers] = useState([]);
  const [showMore, setShowMore] = useState(false);
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
        setFollowing(response.length);
      } catch (error) {
        setError(error.response?.data?.msg || 'Không thể tải người theo dõi');
      } finally {
        setLoading(false);
      }
    };
    fetchFollowers();
  }, [userId, setFollowing]);

  return (
    <div className="following-comp">
      <h2>Người đang theo dõi bạn</h2>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      {loading ? (
        <p style={{ textAlign: 'center', padding: '20px' }}>Đang tải...</p>
      ) : (
        <>
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
          {followers.length > 0 && (
            <button className='SM-btn' onClick={() => setShowMore(true)}>Xem thêm</button>
          )}
        </>
      )}
    </div>
  );
};

export default FollowingU;