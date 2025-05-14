import React from 'react';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import PlayCircleFilledOutlinedIcon from '@mui/icons-material/PlayCircleFilledOutlined';
import KeyboardVoiceRoundedIcon from '@mui/icons-material/KeyboardVoiceRounded';
import { FaSmile } from 'react-icons/fa';
import { createPost } from '../../../api'; // Sửa đường dẫn: từ src/Components/Profile/ProfileComponents/ lên src/

const ProfileInputPost = ({
  handleSubmit,
  setBody,
  body,
  images,
  setImages,
  profileImg,
  modelDetails,
  onPostCreated,
}) => {
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const postData = {
        content: body,
        image: images,
      };
      await createPost(postData);
      setBody('');
      setImages(null);
      onPostCreated();
    } catch (err) {
      console.error(err.response?.data?.msg || 'Failed to create post');
    }
  };

  return (
    <div className="i-form">
      <form onSubmit={handleFormSubmit}>
        <div className="i-input-box">
          <img src={profileImg} className='i-img' alt={`${modelDetails.ModelName}'s profile picture`} />
          <input
            type="text"
            id="i-input"
            placeholder={`What's in your mind ${modelDetails.ModelName}?`}
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