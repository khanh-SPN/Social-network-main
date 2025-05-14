import { useState, useEffect } from 'react';
import Left from '../../Components/LeftSide/Left';
import ProfileMiddle from '../../Components/Profile/ProfileMiddle';
import Right from '../../Components/RightSide/Right';
import Nav from '../../Components/Navigation/Nav';
import '../Profile/Profile.css';
import { getUser, getFollowing } from '../../api';

const Profile = () => {
  const [following, setFollowing] = useState([]);
  const [search, setSearch] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [images, setImages] = useState(null);
  const [name, setName] = useState('');
  const [userName, setUserName] = useState('');
  const [profileImg, setProfileImg] = useState('');
  const [coverImg, setCoverImg] = useState('');
  const [modelDetails, setModelDetails] = useState({
    ModelName: '',
    ModelUserName: '',
    ModelCountryName: '',
    ModelJobName: '',
  });
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        setUserId(decoded.id);
      } catch (err) {
        setError('Token không hợp lệ, vui lòng đăng nhập lại');
        localStorage.removeItem('token');
        window.location.href = '/';
      }
    } else {
      setError('Vui lòng đăng nhập để xem hồ sơ');
      window.location.href = '/';
    }
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;
      try {
        const { data: userData } = await getUser(userId);
        setName(userData.username);
        setUserName(userData.profileTag || `@${userData.username}`);
        setProfileImg(userData.profilePicture || '');
        setCoverImg(userData.coverPicture || '');
        setModelDetails({
          ModelName: userData.username,
          ModelUserName: userData.profileTag || `@${userData.username}`,
          ModelCountryName: userData.countryName || 'India',
          ModelJobName: userData.jobName || 'Web Developer in Google',
        });

        const { data: followingData } = await getFollowing(userId);
        setFollowing(followingData);
      } catch (err) {
        setError(err.response?.data?.msg || 'Không thể tải hồ sơ');
      }
    };
    fetchUserData();
  }, [userId]);

  return (
    <div className='interface'>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <Nav
        search={search}
        setSearch={setSearch}
        showMenu={showMenu}
        setShowMenu={setShowMenu}
        profileImg={profileImg}
      />
      <div className="home">
        <Left
          following={following.length}
          setFollowing={setFollowing}
          profileImg={profileImg}
          modelDetails={modelDetails}
        />
        <ProfileMiddle
          following={following.length}
          search={search}
          images={images}
          setImages={setImages}
          name={name}
          setName={setName}
          userName={userName}
          setUserName={setUserName}
          profileImg={profileImg}
          setProfileImg={setProfileImg}
          coverImg={coverImg}
          setCoverImg={setCoverImg}
          modelDetails={modelDetails}
          setModelDetails={setModelDetails}
          error={error}
        />
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

export default Profile;