import React, { useState, useEffect, useContext } from 'react';
import '../LeftSide/Left.css';
import { AiOutlineHome, AiOutlineSearch } from 'react-icons/ai';
import { FiTrendingUp } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { BsBookmark } from 'react-icons/bs';
import { RiFileListLine } from 'react-icons/ri';
import { FiSettings } from 'react-icons/fi';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { getUserProfile } from '../../api';
import { AuthContext } from '../../index';

const Left = () => {
  const { userId } = useContext(AuthContext);
  const navigate = useNavigate();
  const [btnActive, setBtnActive] = useState('#');
  const [logOutExit, setLogOutExit] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await getUserProfile(userId);
        setUser(response);
      } catch (error) {
        console.error(error.response?.data?.msg || 'Failed to fetch user');
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchUser();
  }, [userId]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/');
  };

  if (loading) return <div style={{ padding: '20px' }}>Đang tải...</div>;

  return (
    <div className="L-features">
      <Link to="/home" style={{ textDecoration: 'none', color: 'black' }}>
        <div onClick={() => setBtnActive('#')} id='L-box' className={btnActive === '#' ? 'active' : ''}>
          <AiOutlineHome className='margin' />
          <span>Home</span>
        </div>
      </Link>
      <div id='L-box' onClick={() => setBtnActive('#explore')} className={btnActive === '#explore' ? 'active' : ''}>
        <AiOutlineSearch className='margin' />
        <span>Explore</span>
      </div>
      <div id='L-box' onClick={() => setBtnActive('#trending')} className={btnActive === '#trending' ? 'active' : ''}>
        <h1 className='notifi'>
          <FiTrendingUp className='margin' />
        </h1>
        <span>Trending</span>
      </div>
      <div id='L-box' onClick={() => setBtnActive('#lists')} className={btnActive === '#lists' ? 'active' : ''}>
        <RiFileListLine className='margin' />
        <span>Lists</span>
      </div>
      <div id='L-box' onClick={() => setBtnActive('#saved')} className={btnActive === '#saved' ? 'active' : ''}>
        <BsBookmark className='margin' />
        <span>Saved</span>
      </div>
      <div id='L-box' onClick={() => setBtnActive('#settings')} className={btnActive === '#settings' ? 'active' : ''}>
        <FiSettings className='margin' />
        <span>Settings</span>
      </div>
      <div className="left-user">
        <Link to="/profile" style={{ textDecoration: 'none', color: 'black' }}>
          <div className="user-name-userid">
            <img src={user?.profilePicture || '/default-profile.jpg'} alt="Profile picture" />
            <div className='L-user'>
              <h1>{user?.username || 'User'}</h1>
              <span>{user?.profileTag || '@user'}</span>
            </div>
          </div>
        </Link>
        <MoreHorizIcon onClick={() => setLogOutExit(!logOutExit)} className='vert' />
        {logOutExit && (
          <div className="logOutExitContainer">
            <button>Add an existing account</button>
            <button onClick={handleLogout}>Log out {user?.profileTag || '@user'}</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Left;