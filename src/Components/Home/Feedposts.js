import React from 'react';
import Post from './Post';
import './Feedposts.css';

const Feedposts = ({ posts, setPosts, setFriendsProfile, images, error, page, setPage, totalPages }) => {
  return (
    <div className='feedposts'>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      {posts.map((post) => (
        <Post
          images={images}
          posts={posts}
          post={post}
          setPosts={setPosts}
          key={post.id}
          setFriendsProfile={setFriendsProfile}
        />
      ))}
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
    </div>
  );
};

export default Feedposts;