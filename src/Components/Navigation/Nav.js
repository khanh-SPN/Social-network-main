import React, { useState, useEffect, useContext } from 'react';
import '../Navigation/Nav.css';
import SearchIcon from '@mui/icons-material/Search';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineHome } from 'react-icons/ai';
import { LiaUserFriendsSolid } from 'react-icons/lia';
import { IoNotificationsOutline } from 'react-icons/io5';
import { TbMessage } from 'react-icons/tb';
import { getUserProfile } from '../../api';
import { AuthContext } from '../../index';

const Nav = ({ search, setSearch, setShowMenu }) => {
  const { userId } = useContext(AuthContext);
  const navigate = useNavigate();
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

  return (
    <nav>
      <div className="n-logo">
        <Link to="/home" className='logo' style={{ color: 'black', textDecoration: 'none' }}>
          <h1>Face <span>Gram</span></h1>
        </Link>
      </div>

      <div className="n-form-button">
        <form className='n-form' onSubmit={(e) => e.preventDefault()}>
          <SearchIcon className='search-icon' />
          <input
            type="text"
            placeholder='Search post or user'
            id='n-search'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
      </div>

      <div className="social-icons">
        <Link to="/home" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', color: 'white' }}>
          <AiOutlineHome className='nav-icons' />
        </Link>
        <Link to="/notification" id='notifi' style={{ marginTop: '8px' }}>
          <IoNotificationsOutline className='nav-icons' />
          <span>5</span>
        </Link>
        <TbMessage className='nav-icons' />
        <LiaUserFriendsSolid
          className='nav-icons'
          onClick={() => setShowMenu(true)}
        />
        <button
          onClick={handleLogout}
          style={{
            marginLeft: '10px',
            padding: '5px 10px',
            background: '#ff4d4d',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Đăng xuất
        </button>
      </div>

      <div className="n-profile">
        <Link to="/profile">
          <img
            src={user?.profilePicture || '/default-profile.jpg'}
            className='n-img'
            style={{ marginBottom: '-7px' }}
            alt="Profile picture"
          />
        </Link>
      </div>
    </nav>
  );
};

export default Nav;