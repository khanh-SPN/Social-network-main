import React, { useState } from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import Home from './Pages/Home/Home';
import Profile from './Pages/Profile/Profile';
import FriendsId from './Pages/FriendsId/FriendsId';
import Notification from './Pages/Notification/Notification';
import Login from './Pages/RegisterPage/Login';
import SignUp from './Pages/RegisterPage/SignUp';

const App = () => {
  const [friendProfile, setFriendsProfile] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/Social-Media-App-Frontend';
  };

  return (
    <div className='App'>
      <nav style={{ padding: '10px', background: '#f0f0f0' }}>
        <Link to="/home" style={{ marginRight: '10px' }}>Home</Link>
        <Link to="/profile" style={{ marginRight: '10px' }}>Profile</Link>
        <Link to="/notification" style={{ marginRight: '10px' }}>Notifications</Link>
        <button onClick={handleLogout} style={{ padding: '5px 10px' }}>Đăng xuất</button>
      </nav>
      <Routes>
        <Route path='/home' element={<Home setFriendsProfile={setFriendsProfile} />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/friendsId' element={<FriendsId friendProfile={friendProfile} />} />
        <Route path='/notification' element={<Notification />} />
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
      </Routes>
    </div>
  );
};

export default App;