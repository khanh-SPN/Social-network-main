import React, { useState, useEffect, useContext } from 'react';
import Nav from '../../Components/Navigation/Nav';
import Left from '../../Components/LeftSide/Left';
import FriendsProfileMiddle from '../../Components/FriendsProfile/FriendsProfileMiddle';
import Right from '../../Components/RightSide/Right';
import '../FriendsId/FriendsId.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { getUserProfile, followUser, unfollowUser } from '../../api';
import { AuthContext } from '../../index';

const FriendsId = () => {
  const { userId } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [following, setFollowing] = useState(0);
  const [friendProfile, setFriendProfile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriendProfile = async () => {
      const params = new URLSearchParams(location.search);
      const friendId = params.get('id');
      if (!friendId) {
        setError('Friend ID not provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getUserProfile(friendId);
        setFriendProfile(response);
      } catch (error) {
        if (error.response?.status === 401) {
          setError('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          navigate('/');
        } else {
          setError(error.response?.data?.msg || 'Failed to load friend profile');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchFriendProfile();
  }, [location, navigate]);

  const handleFollow = async () => {
    if (!friendProfile) return;
    try {
      const response = await followUser(friendProfile.id);
      if (response.followed) {
        const updatedProfile = await getUserProfile(friendProfile.id);
        setFriendProfile(updatedProfile);
        setFollowing(following + 1);
      }
    } catch (error) {
      setError(error.response?.data?.msg || 'Failed to follow');
    }
  };

  const handleUnfollow = async () => {
    if (!friendProfile) return;
    try {
      await unfollowUser(friendProfile.id);
      const updatedProfile = await getUserProfile(friendProfile.id);
      setFriendProfile(updatedProfile);
      setFollowing(following - 1);
    } catch (error) {
      setError(error.response?.data?.msg || 'Failed to unfollow');
    }
  };

  return (
    <div className='interface'>
      <Nav
        search={search}
        setSearch={setSearch}
        showMenu={showMenu}
        setShowMenu={setShowMenu}
      />
      <div className="home">
        <Left />
        <div>
          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
          {loading ? (
            <p style={{ textAlign: 'center', padding: '20px' }}>Đang tải...</p>
          ) : (
            <>
              <FriendsProfileMiddle friendProfile={friendProfile} />
              {friendProfile && friendProfile.id !== parseInt(userId) && (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <button
                    onClick={handleFollow}
                    style={{
                      padding: '10px 20px',
                      marginRight: '10px',
                      background: 'linear-gradient(107deg, rgb(255, 67, 5) 11.1%, rgb(245, 135, 0) 95.3%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Follow
                  </button>
                  <button
                    onClick={handleUnfollow}
                    style={{
                      padding: '10px 20px',
                      background: '#f0f0f0',
                      color: '#333',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Unfollow
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        <Right
          showMenu={showMenu}
          setShowMenu={setShowMenu}
          following={following}
          setFollowing={setFollowing}
        />
      </div>
    </div>
  );
};

export default FriendsId;