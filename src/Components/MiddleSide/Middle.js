import React, { useEffect, useState } from 'react';
import InputPost from '../Post/InputPost';
import Homepage from '../Home/Homepage';
import '../MiddleSide/Middle.css';
import { getPosts, searchUsers } from '../../api';

const Middle = ({ search, setFriendsProfile }) => {
  const [body, setBody] = useState('');
  const [posts, setPosts] = useState([]);
  const [images, setImages] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        let response;
        if (search) {
          response = await searchUsers(search); // Tìm kiếm người dùng
          // Giả sử BE trả về danh sách user, lấy bài viết của họ
          const userIds = response.map(user => user.id);
          response = await getPosts(page, 10);
          response.posts = response.posts.filter(post => userIds.includes(post.userId));
        } else {
          response = await getPosts(page, 10);
        }
        setPosts(response.posts);
        setTotalPages(response.totalPages);
      } catch (error) {
        setError(error.response?.data?.msg || 'Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [page, search]);

  const handlePostCreated = async () => {
    try {
      const response = await getPosts(1, 10);
      setPosts(response.posts);
      setTotalPages(response.totalPages);
      setPage(1);
    } catch (error) {
      setError(error.response?.data?.msg || 'Failed to fetch posts');
    }
  };

  return (
    <div className='M-features'>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      {loading ? (
        <p style={{ textAlign: 'center', padding: '20px' }}>Đang tải...</p>
      ) : (
        <>
          <InputPost
            setBody={setBody}
            body={body}
            images={images}
            setImages={setImages}
            onPostCreated={handlePostCreated}
          />
          <Homepage
            posts={posts}
            setPosts={setPosts}
            setFriendsProfile={setFriendsProfile}
            images={images}
          />
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
        </>
      )}
    </div>
  );
};

export default Middle;