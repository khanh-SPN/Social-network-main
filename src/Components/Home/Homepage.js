import React, { useEffect, useState } from 'react';
import Feedposts from './Feedposts';
import '../Home/Homepage.css';
import { getPosts } from '../../api';

const Homepage = ({ setFriendsProfile }) => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await getPosts(page, 10);
        setPosts(response.posts);
        setTotalPages(response.totalPages);
      } catch (error) {
        setError(error.response?.data?.msg || 'Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [page]);

  return (
    <main className='homepage'>
      {loading ? (
        <p style={{ textAlign: 'center', marginTop: '40px' }}>Đang tải...</p>
      ) : posts.length ? (
        <Feedposts
          posts={posts}
          setPosts={setPosts}
          setFriendsProfile={setFriendsProfile}
          error={error}
          page={page}
          setPage={setPage}
          totalPages={totalPages}
        />
      ) : (
        <p style={{ textAlign: 'center', marginTop: '40px' }}>
          Không có bài viết nào
        </p>
      )}
    </main>
  );
};

export default Homepage;