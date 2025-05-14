import React, { useState, useEffect, useContext } from 'react';
import '../Notification/Notification.css';
import { AiOutlineHome } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { getNotifications, markNotificationRead, getUserProfile } from '../../api';
import { AuthContext } from '../../index';

const Notification = () => {
  const { userId } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        setError('Vui lòng đăng nhập để xem thông báo');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const [notificationsResponse, userResponse] = await Promise.all([
          getNotifications(page, 10),
          getUserProfile(userId)
        ]);
        setNotifications(notificationsResponse.notifications);
        setTotalPages(notificationsResponse.totalPages);
        setUser(userResponse);
      } catch (error) {
        setError(error.response?.data?.msg || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId, page]);

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationRead(id);
      const response = await getNotifications(page, 10);
      setNotifications(response.notifications);
    } catch (error) {
      setError(error.response?.data?.msg || 'Failed to mark as read');
    }
  };

  return (
    <div className="noti-overall">
      <div className='nav-section'>
        <Link to="/home" style={{ textDecoration: 'none' }} className='noti-div'>
          <AiOutlineHome className='noti-Home-Icon' />
        </Link>
        <Link to="/profile" style={{ textDecoration: 'none' }}>
          <img src={user?.profilePicture || '/default-profile.jpg'} alt="Profile" />
        </Link>
      </div>

      <div className="notification-group">
        <h1>Notification</h1>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        {loading ? (
          <p style={{ textAlign: 'center', padding: '20px' }}>Đang tải...</p>
        ) : notifications.length === 0 ? (
          <p style={{ textAlign: 'center' }}>Không có thông báo nào</p>
        ) : (
          <div className="notification-section">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="notification-msg"
                style={{ backgroundColor: notification.isRead ? '#f0f0f0' : '#fff' }}
              >
                <img src={notification.relatedUser?.profilePicture || '/default-profile.jpg'} alt="User" />
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
                    style={{
                      padding: '5px 10px',
                      marginLeft: '10px',
                      background: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            style={{
              padding: '10px 20px',
              marginRight: '10px',
              cursor: page === 1 ? 'not-allowed' : 'pointer',
            }}
          >
            Previous
          </button>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            style={{
              padding: '10px 20px',
              cursor: page === totalPages ? 'not-allowed' : 'pointer',
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notification;