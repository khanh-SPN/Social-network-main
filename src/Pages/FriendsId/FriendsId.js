import React, { useState, useEffect } from 'react';
import Nav from '../../Components/Navigation/Nav';
import Left from '../../Components/LeftSide/Left';
import FriendsProfileMiddle from '../../Components/FriendsProfile/FriendsProfileMiddle';
import Right from '../../Components/RightSide/Right';
import '../FriendsId/FriendsId.css';
import { useLocation } from 'react-router-dom';
import { getUser, followUser, unfollowUser } from '../../api';

const FriendsId = () => {
  const [search, setSearch] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [following, setFollowing] = useState([]);
  const [friendProfile, setFriendProfile] = useState(null);
  const [error, setError] = useState('');
  const location = useLocation();

  useEffect(() => {
    const fetchFriendProfile = async () => {
      const params = new URLSearchParams(location.search);
      const friendId = params.get('id');
      if (!friendId) {
        setError('Friend ID not provided');
        return;
      }

      try {
        const { data } = await getUser(friendId);
        setFriendProfile(data);
      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to load friend profile');
      }
    };
    fetchFriendProfile();
  }, [location]);

  const handleFollow = async () => {
    if (!friendProfile) return;
    try {
      await followUser(friendProfile.id);
      const { data } = await getUser(friendProfile.id);
      setFriendProfile(data);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to follow');
    }
  };

  const handleUnfollow = async () => {
    if (!friendProfile) return;
    try {
      await unfollowUser(friendProfile.id);
      const { data } = await getUser(friendProfile.id);
      setFriendProfile(data);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to unfollow');
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
          <FriendsProfileMiddle friendProfile={friendProfile} />
          {friendProfile && (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button onClick={handleFollow} style={{ padding: '10px 20px', marginRight: '10px' }}>Follow</button>
              <button onClick={handleUnfollow} style={{ padding: '10px 20px' }}>Unfollow</button>
            </div>
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