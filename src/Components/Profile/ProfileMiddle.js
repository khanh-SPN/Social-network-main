import React, { useState, useEffect, useContext } from 'react';
import './ProfileMiddle.css';
import Info from './ProfileComponents/InfoProfile/Info';
import ProfileInputPost from './ProfileComponents/ProfileInputPost';
import { getPosts, getUserProfile } from '../../api';
import { AuthContext } from '../../index';

const ProfileMiddle = () => {
  const { userId } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [body, setBody] = useState('');
  const [images, setImages] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getPosts(page, 10);
        setPosts(response.posts.filter(post => post.userId === parseInt(userId)));
        setTotalPages(response.totalPages);
      } catch (error) {
        setError(error.response?.data?.msg || 'Failed to load posts');
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchData();
  }, [userId, page]);

  const handlePostCreated = async () => {
    try {
      const response = await getPosts(1, 10);
      setPosts(response.posts.filter(post => post.userId === parseInt(userId)));
      setTotalPages(response.totalPages);
      setPage(1);
    } catch (error) {
      setError(error.response?.data?.msg || 'Failed to load posts');
    }
  };

  return (
    <div className="profile-middle">
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      {loading ? (
        <p style={{ textAlign: 'center', padding: '20px' }}>Đang tải...</p>
      ) : (
        <>
          <Info />
          <ProfileInputPost
            setBody={setBody}
            body={body}
            images={images}
            setImages={setImages}
            onPostCreated={handlePostCreated}
          />
          {/* Hiển thị danh sách bài viết nếu cần */}
        </>
      )}
    </div>
  );
};

export default ProfileMiddle;