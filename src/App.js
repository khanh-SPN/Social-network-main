import React, { useContext, useState } from 'react';
import { Route, Routes, Link, Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from './index';
import Home from './Pages/Home/Home';
import Profile from './Pages/Profile/Profile';
import FriendsId from './Pages/FriendsId/FriendsId';
import Notification from './Pages/Notification/Notification';
import Login from './Pages/RegisterPage/Login';
import SignUp from './Pages/RegisterPage/SignUp';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Đang tải...</div>;
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return children;
};

const App = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [friendProfile, setFriendsProfile] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setFriendsProfile([]);
    navigate('/');
  };

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Đang tải...</div>;

  return (
    <div className="App" style={{ maxWidth: '2308px', margin: '0 auto' }}>
      {isAuthenticated && (
        <nav
          style={{
            padding: '10px',
            background: '#f0f0f0',
            display: 'flex',
            gap: '15px',
            alignItems: 'center',
            marginBottom: '20px',
            borderRadius: '4px',
          }}
        >
          <Link to="/home" style={{ textDecoration: 'none', color: '#333', fontWeight: '500' }}>
            Home
          </Link>
          <Link to="/profile" style={{ textDecoration: 'none', color: '#333', fontWeight: '500' }}>
            Profile
          </Link>
          <Link to="/notification" style={{ textDecoration: 'none', color: '#333', fontWeight: '500' }}>
            Notifications
          </Link>
          <Link to="/friendsId" style={{ textDecoration: 'none', color: '#333', fontWeight: '500' }}>
            Friends
          </Link>
          <button
            onClick={handleLogout}
            style={{
              padding: '5px 15px',
              cursor: 'pointer',
              background: '#ff4d4f',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontWeight: '500',
            }}
          >
            Đăng xuất
          </button>
        </nav>
      )}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home setFriendsProfile={setFriendsProfile} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/friendsId"
          element={
            <ProtectedRoute>
              <FriendsId friendProfile={friendProfile} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notification"
          element={
            <ProtectedRoute>
              <Notification />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<div style={{ padding: '20px', textAlign: 'center' }}>404 - Không tìm thấy trang</div>} />
      </Routes>
    </div>
  );
};

export default App;