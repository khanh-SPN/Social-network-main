import React, { useEffect, useState } from 'react';
import InputPost from '../Post/InputPost';
import Homepage from '../Home/Homepage';
import '../MiddleSide/Middle.css';

const Middle = ({
  body,
  setBody,
  posts,
  setPosts,
  search,
  images,
  setImages,
  setFriendsProfile,
  onPostCreated,
  error,
  page,
  setPage,
  totalPages,
}) => {
  const [searchResults, setSearchResults] = useState(posts);

  useEffect(() => {
    const searchData = posts.filter((val) => (
      (val.content?.toLowerCase().includes(search.toLowerCase())) ||
      (val.username?.toLowerCase().includes(search.toLowerCase()))
    ));
    setSearchResults(searchData);
  }, [posts, search]);

  return (
    <div className='M-features'>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <InputPost
        setBody={setBody}
        body={body}
        images={images}
        setImages={setImages}
        onPostCreated={onPostCreated}
      />
      <Homepage
        posts={searchResults}
        setPosts={setPosts}
        setFriendsProfile={setFriendsProfile}
        images={images}
      />
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

export default Middle;