import React, { useState, useEffect, useContext } from 'react';
import Left from '../../Components/LeftSide/Left';
import ProfileMiddle from '../../Components/Profile/ProfileMiddle';
import Right from '../../Components/RightSide/Right';
import Nav from '../../Components/Navigation/Nav';
import '../Profile/Profile.css';
import { getUserProfile, getFollowing } from '../../api';
import { AuthContext } from '../../index';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { userId } = useContext(AuthContext);
  const navigate = useNavigate();
  const [following, setFollowing] = useState(0);
  const [search, setSearch] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        setError('Vui lòng đăng nhập để xem hồ sơ');
        setLoading(false);
        navigate('/');
        return;
      }
      try {
        setLoading(true);
        const followingResponse = await getFollowing(userId);
        setFollowing(followingResponse.length);
      } catch (error) {
        if (error.response?.status === 401) {
          setError('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          navigate('/');
        } else {
          setError(error.response?.data?.msg || 'Không thể tải hồ sơ');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [userId, navigate]);

  return (
    <div className='interface'>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      {loading ? (
        <p style={{ textAlign: 'center', padding: '20px' }}>Đang tải...</p>
      ) : (
        <>
          <Nav
            search={search}
            setSearch={setSearch}
            showMenu={showMenu}
            setShowMenu={setShowMenu}
          />
          <div className="home">
            <Left />
            <ProfileMiddle />
            <Right
              showMenu={showMenu}
              setShowMenu={setShowMenu}
              following={following}
              setFollowing={setFollowing}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;