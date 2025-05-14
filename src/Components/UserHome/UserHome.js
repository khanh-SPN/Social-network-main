import React, { useState, useEffect, useContext } from 'react';
import FeedUser from './FeedUser';
import { getPosts, getUserProfile } from '../../api';
import { AuthContext } from '../../index';

const UserHome = () => {
  const { userId } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [postsResponse, userResponse] = await Promise.all([
          getPosts(page, 10),
          getUserProfile(userId)
        ]);
        setPosts(postsResponse.posts.filter(post => post.userId === parseInt(userId)));
        setTotalPages(postsResponse.totalPages);
        setUser(userResponse);
      } catch (error) {
        setError(error.response?.data?.msg || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchData();
  }, [userId, page]);

  return (
    <div>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      {loading ? (
        <p style={{ textAlign: 'center', padding: '20px' }}>Đang tải...</p>
      ) : posts.length ? (
        <FeedUser
          user={user}
          posts={posts}
          setPosts={setPosts}
        />
      ) : (
        <p style={{ textAlign: 'center', marginBottom: '40px' }}>
          Không có bài viết nào
        </p>
      )}
      {totalPages > 1 && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            style={{ padding: '10px 20px', marginRight: '10px', cursor: page === 1 ? 'not-allowed' : 'pointer' }}
          >
            Previous
          </button>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            style={{ padding: '10px 20px', cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default UserHome;