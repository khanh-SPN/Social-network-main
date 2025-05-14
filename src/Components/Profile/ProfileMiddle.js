import React, { useState, useEffect } from 'react';
import './ProfileMiddle.css';
import Info from './ProfileComponents/InfoProfile/Info';
import ProfileInputPost from './ProfileComponents/ProfileInputPost';
import { getPosts } from '../../api'; // Sửa đường dẫn: từ src/Components/Profile/ lên src/

const ProfileMiddle = ({
  following,
  search,
  images,
  setImages,
  name,
  setName,
  userName,
  setUserName,
  profileImg,
  setProfileImg,
  coverImg,
  setCoverImg,
  modelDetails,
  setModelDetails,
  error,
}) => {
  const [posts, setPosts] = useState([]);
  const [body, setBody] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await getPosts(page);
        setPosts(data.posts);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error(err.response?.data?.msg || 'Failed to load posts');
      }
    };
    fetchPosts();
  }, [page]);

  const handlePostCreated = async () => {
    try {
      const { data } = await getPosts(page);
      setPosts(data.posts);
    } catch (err) {
      console.error(err.response?.data?.msg || 'Failed to load posts');
    }
  };

  return (
    <div className="profile-middle">
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <Info
        userPostData={posts}
        following={following}
        modelDetails={modelDetails}
        setModelDetails={setModelDetails}
        profileImg={profileImg}
        setProfileImg={setProfileImg}
        coverImg={coverImg}
        setCoverImg={setCoverImg}
        name={name}
        setName={setName}
        userName={userName}
        setUserName={setUserName}
      />
      <ProfileInputPost
        handleSubmit={() => {}}
        setBody={setBody}
        body={body}
        images={images}
        setImages={setImages}
        profileImg={profileImg}
        modelDetails={modelDetails}
        onPostCreated={handlePostCreated}
      />
      {/* Hiển thị danh sách bài viết nếu cần */}
    </div>
  );
};

export default ProfileMiddle;