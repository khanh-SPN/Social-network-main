import React, { useState, useEffect } from 'react';
import InfoFriends from './FriendsProfileInfo/InfoFriends';
import InfoFriendPost from './FriendsProfileInfo/InfoFriendPost';
import { useLocation } from 'react-router-dom';
import { getUserProfile, getPosts } from '../../api';

const FriendsProfileMiddle = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get('id');
  const [friendProfile, setFriendProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const profile = await getUserProfile(userId);
        const postsResponse = await getPosts(1, 10); // Lấy bài viết của user
        setFriendProfile(profile);
        setPosts(postsResponse.posts.filter(post => post.userId === parseInt(userId)));
      } catch (error) {
        console.error(error.response?.data?.msg || 'Failed to fetch profile or posts');
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchData();
  }, [userId]);

  if (loading) return <div style={{ textAlign: 'center', padding: '20px' }}>Đang tải...</div>;

  return (
    <div style={{ paddingBottom: '30px' }}>
      {friendProfile ? (
        <>
          <InfoFriends val={friendProfile} />
          {posts.map((post) => (
            <InfoFriendPost val={post} key={post.id} />
          ))}
        </>
      ) : (
        <p style={{ textAlign: 'center' }}>Không có thông tin để hiển thị</p>
      )}
    </div>
  );
};

export default FriendsProfileMiddle;