import React, { useState, useEffect, useContext } from 'react';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import PlayCircleFilledOutlinedIcon from '@mui/icons-material/PlayCircleFilledOutlined';
import KeyboardVoiceRoundedIcon from '@mui/icons-material/KeyboardVoiceRounded';
import { FaSmile } from 'react-icons/fa';
import { createPost, getUserProfile } from '../../../api';
import { AuthContext } from '../../../index';

const ProfileInputPost = ({ setBody, body, images, setImages, onPostCreated }) => {
  const { userId } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await getUserProfile(userId);
        setUser(response);
      } catch (error) {
        setError(error.response?.data?.msg || 'Failed to fetch user');
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchUser();
  }, [userId]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('content', body);
      if (images) formData.append('image', images);
      await createPost(formData);
      setBody('');
      setImages(null);
      onPostCreated();
    } catch (error) {
      setError(error.response?.data?.msg || 'Failed to create post');
    }
  };

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Đang tải...</div>;

  return (
    <div className="i-form">
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <form onSubmit={handleFormSubmit}>
        <div className="i-input-box">
          <img src={user?.profilePicture || '/default-profile.jpg'} className='i-img' alt={`${user?.username}'s profile picture`} />
          <input
            type="text"
            id="i-input"
            placeholder={`What's in your mind ${user?.username || 'User'}?`}
            required
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>

        <div className="file-upload">
          <div className="file-icons">
            <label htmlFor='file' className="pv-upload">
              <PhotoLibraryIcon className="input-svg" style={{ fontSize: '38px', color: 'orangered' }} />
              <span className='photo-dis'>Photo</span>
            </label>
            <div className="pv-upload">
              <PlayCircleFilledOutlinedIcon className="input-svg" style={{ fontSize: '38px', color: 'black' }} />
              <span className='photo-dis'>Video</span>
            </div>
            <div className="pv-upload">
              <KeyboardVoiceRoundedIcon className="input-svg" style={{ fontSize: '38px', color: 'green' }} />
              <span className='photo-dis'>Audio</span>
            </div>
            <div className="pv-upload">
              <FaSmile className="input-svg" style={{ fontSize: '30px', color: 'red' }} />
              <span className='photo-dis'>Location</span>
            </div>
          </div>
          <button type='submit'>Share</button>
        </div>

        <div style={{ display: 'none' }}>
          <input
            id='file'
            type="file"
            accept=".png,.jpeg,.jpg"
            onChange={(e) => setImages(e.target.files[0])}
          />
        </div>

        {images && (
          <div className="displayImg">
            <CloseRoundedIcon onClick={() => setImages(null)} />
            <img src={URL.createObjectURL(images)} alt="Uploaded post image" />
          </div>
        )}
      </form>
    </div>
  );
};

export default ProfileInputPost;