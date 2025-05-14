import React, { useState, useEffect } from 'react';
import FeedUser from './FeedUser';
import { getPosts } from '../../api'; // Sửa đường dẫn: từ src/Components/UserHome/ lên src/

const UserHome = ({ setUserPostData, userPostData, profileImg, modelDetails, images }) => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const { data } = await getPosts(page);
        setUserPostData(data.posts);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error(err.response?.data?.msg || 'Failed to load user posts');
      }
    };
    fetchUserPosts();
  }, [page, setUserPostData]);

  return (
    <div>
      {userPostData.length ? (
        <FeedUser
          modelDetails={modelDetails}
          profileImg={profileImg}
          posts={userPostData}
          setPosts={setUserPostData}
          images={images}
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
            style={{ padding: '10px 20px', marginRight: '10px' }}
          >
            Previous
          </button>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            style={{ padding: '10px 20px' }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default UserHome;