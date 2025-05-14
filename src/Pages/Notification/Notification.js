import React, { useState, useEffect } from 'react';
import '../Notification/Notification.css';
import { AiOutlineHome } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { getNotifications, markAsRead } from '../../api';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [profileImg, setProfileImg] = useState('');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await getNotifications(page);
        setNotifications(data.notifications);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to load notifications');
      }
    };
    fetchNotifications();

    const token = localStorage.getItem('token');
    if (token) {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      setProfileImg(decoded.profilePicture || '');
    }
  }, [page]);

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      const { data } = await getNotifications(page);
      setNotifications(data.notifications);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to mark as read');
    }
  };

  return (
    <div className="noti-overall">
      <div className='nav-section'>
        <Link to="/home" style={{ textDecoration: 'none' }} className='noti-div'>
          <AiOutlineHome className='noti-Home-Icon' />
        </Link>
        <Link to="/profile" style={{ textDecoration: 'none' }}>
          <img src={profileImg} alt="Profile" />
        </Link>
      </div>

      <div className="notification-group">
        <h1>Notification</h1>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        <div className="notification-section">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="notification-msg"
              style={{ backgroundColor: notification.isRead ? '#f0f0f0' : '#fff' }}
            >
              <img src={notification.relatedUser?.profilePicture || ''} alt="User" />
              <p>
                {notification.relatedUser?.username}{' '}
                {notification.type === 'follow' && 'followed you'}
                {notification.type === 'like' && 'liked your post'}
                {notification.type === 'comment' && 'commented on your post'}
                {notification.type === 'recommend' && 'recommended your post'}
                <br />
                <small>{new Date(notification.createdAt).toLocaleString()}</small>
              </p>
              {!notification.isRead && (
                <button
                  onClick={() => handleMarkAsRead(notification.id)}
                  style={{ padding: '5px 10px', marginLeft: '10px' }}
                >
                  Mark as Read
                </button>
              )}
            </div>
          ))}
        </div>
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            style={{ padding: '10px 20px', marginRight: '10px' }}
          >
            Previous
          </button>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            style={{ padding: '10px 20px' }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notification;