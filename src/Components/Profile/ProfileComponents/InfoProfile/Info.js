import React, { useState, useEffect, useContext, useRef } from 'react';
import '../InfoProfile/Info.css';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import WorkOutlineRoundedIcon from '@mui/icons-material/WorkOutlineRounded';
import { LiaEdit } from 'react-icons/lia';
import { IoCameraOutline } from 'react-icons/io5';
import { BiLogOut } from 'react-icons/bi';
import { Link, useNavigate } from 'react-router-dom';
import ModelProfile from '../ModelProfile/ModelProfile';
import { getUserProfile, updateUserProfile } from '../../../../api';
import { AuthContext } from '../../../../index';

const BASE_URL = 'http://localhost:5000'; // Có thể lấy từ biến môi trường

const Info = () => {
  const { userId } = useContext(AuthContext);
  const navigate = useNavigate();
  const importProfile = useRef();
  const importCover = useRef();
  const [user, setUser] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [name, setName] = useState('');
  const [userName, setUserName] = useState('');
  const [countryName, setCountryName] = useState('');
  const [jobName, setJobName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await getUserProfile(userId);
        setUser(response);
        setName(response.bio || '');
        setUserName(response.profileTag || '');
        setCountryName(response.countryName || '');
        setJobName(response.jobName || '');
        console.log('Profile Picture URL:', response.profilePicture); // Debug
      } catch (error) {
        setError(error.response?.data?.msg || 'Failed to fetch user');
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchUser();
  }, [userId]);

  const handleFile1 = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('profilePicture', file);
      await handleUpdateProfile(formData);
    }
  };

  const handleFile2 = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('coverPicture', file);
      await handleUpdateProfile(formData);
    }
  };

  const handleUpdateProfile = async (formData) => {
    try {
      const response = await updateUserProfile(userId, formData);
      setUser(response);
      setError('');
      console.log('Updated profile:', response); // Debug
    } catch (error) {
      setError(error.response?.data?.msg || 'Failed to update profile');
    }
  };

  const handleModel = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (name) formData.append('bio', name);
    if (countryName) formData.append('countryName', countryName);
    if (jobName) formData.append('jobName', jobName);
    await handleUpdateProfile(formData);
    setOpenEdit(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/');
  };

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Đang tải...</div>;

  return (
    <div className="info">
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <div className="info-cover">
        <img
          src={user?.coverPicture ? `${BASE_URL}${user.coverPicture}` : '/images/default-cover.jpg'}
          alt="Cover"
          onError={(e) => (e.target.src = '/images/default-cover.jpg')}
        />
        <img
          src={user?.profilePicture ? `${BASE_URL}${user.profilePicture}` : '/images/default-profile.jpg'}
          alt="Profile"
          onError={(e) => (e.target.src = '/images/default-profile.jpg')}
        />
        <div className="coverDiv">
          <IoCameraOutline className="coverSvg" onClick={() => importCover.current.click()} />
        </div>
        <div className="profileDiv">
          <IoCameraOutline className="profileSvg" onClick={() => importProfile.current.click()} />
        </div>
      </div>

      <input
        type="file"
        ref={importProfile}
        onChange={handleFile1}
        style={{ display: 'none' }}
        accept=".png,.jpeg,.jpg"
      />
      <input
        type="file"
        ref={importCover}
        onChange={handleFile2}
        style={{ display: 'none' }}
        accept=".png,.jpeg,.jpg"
      />

      <div className="info-follow">
        <h1>{user?.username}</h1>
        <p>{user?.profileTag}</p>

        <Link to="/" className="logout" onClick={handleLogout}>
          <BiLogOut /> Logout
        </Link>

        <button onClick={() => setOpenEdit(true)}>
          <LiaEdit /> Edit Profile
        </button>
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
              <span>{user?.countryName || 'Unknown'}</span>
            </div>
            <div className="info-details-list">
              <WorkOutlineRoundedIcon />
              <span>{user?.jobName || 'Not specified'}</span>
            </div>
            <div className="info-details-list">
              <CalendarMonthRoundedIcon />
              <span>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}</span>
            </div>
          </div>
          <div className="info-col-2">
            <div>
              <h2>{user?.followers || 0}</h2>
              <span>Followers</span>
            </div>
            <div>
              <h2>{user?.posts || 0}</h2>
              <span>Posts</span>
            </div>
            <div>
              <h2>{user?.following || 0}</h2>
              <span>Following</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Info;