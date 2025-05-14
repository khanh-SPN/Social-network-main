import React, { useState } from 'react';
import '../InfoProfile/Info.css';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import WorkOutlineRoundedIcon from '@mui/icons-material/WorkOutlineRounded';
import { LiaEdit } from 'react-icons/lia';
import { IoCameraOutline } from 'react-icons/io5';
import { BiLogOut } from 'react-icons/bi';
import { useRef } from 'react';
import ModelProfile from '../ModelProfile/ModelProfile';
import { Link } from 'react-router-dom';
import { updateUser } from '../../../../api';

const Info = ({
  userPostData,
  following,
  modelDetails,
  setModelDetails,
  profileImg,
  setProfileImg,
  coverImg,
  setCoverImg,
  name,
  setName,
  userName,
  setUserName,
}) => {
  const importProfile = useRef();
  const importCover = useRef();
  const [openEdit, setOpenEdit] = useState(false);
  const [countryName, setCountryName] = useState('');
  const [jobName, setJobName] = useState('');
  const [error, setError] = useState('');

  const handleFile1 = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImg(URL.createObjectURL(file));
      handleUpdateProfile({ profilePicture: file });
    }
  };

  const handleFile2 = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImg(URL.createObjectURL(file));
      handleUpdateProfile({ coverPicture: file });
    }
  };

  const handleUpdateProfile = async (updateData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const userId = decoded.id;
      await updateUser(userId, updateData);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update profile');
    }
  };

  const handleModel = (e) => {
    e.preventDefault();
    const ModelName = name;
    const ModelUserName = userName;
    const ModelCountryName = countryName || modelDetails.ModelCountryName;
    const ModelJobName = jobName || modelDetails.ModelJobName;

    const obj = {
      ModelName,
      ModelUserName,
      ModelCountryName,
      ModelJobName,
    };

    setModelDetails(obj);
    setOpenEdit(false);
    handleUpdateProfile({ bio: ModelName });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div className='info'>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <div className="info-cover">
        <img src={coverImg} alt="Cover" />
        <img src={profileImg} alt="Profile" />
        <div className='coverDiv'><IoCameraOutline className='coverSvg' onClick={() => importCover.current.click()} /></div>
        <div className='profileDiv'><IoCameraOutline className='profileSvg' onClick={() => importProfile.current.click()} /></div>
      </div>

      <input
        type="file"
        ref={importProfile}
        onChange={handleFile1}
        style={{ display: 'none' }}
      />
      <input
        type="file"
        ref={importCover}
        onChange={handleFile2}
        style={{ display: 'none' }}
      />

      <div className="info-follow">
        <h1>{modelDetails.ModelName}</h1>
        <p>{modelDetails.ModelUserName}</p>

        <Link to="/" className='logout' onClick={handleLogout}>
          <BiLogOut />Logout
        </Link>

        <button onClick={() => setOpenEdit(true)}><LiaEdit />Edit Profile</button>
        <ModelProfile
          name={name}
          setName={setName}
          userName={userName}
          setUserName={setUserName}
          countryName={countryName}
          setCountryName={setCountryName}
          jobName={jobName}
          setJobName={setJobName}
          handleModel={handleModel}
          openEdit={openEdit}
          setOpenEdit={setOpenEdit}
        />

        <div className="info-details">
          <div className="info-col-1">
            <div className="info-details-list">
              <LocationOnOutlinedIcon />
              <span>{modelDetails.ModelCountryName}</span>
            </div>
            <div className="info-details-list">
              <WorkOutlineRoundedIcon />
              <span>{modelDetails.ModelJobName}</span>
            </div>
            <div className="info-details-list">
              <CalendarMonthRoundedIcon />
              <span>Joined in 2023-08-12</span>
            </div>
          </div>
          <div className="info-col-2">
            <div>
              <h2>5,000</h2>
              <span>Followers</span>
            </div>
            <div>
              <h2>{userPostData.length}</h2>
              <span>Posts</span>
            </div>
            <div>
              <h2>{following}</h2>
              <span>Following</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Info;  