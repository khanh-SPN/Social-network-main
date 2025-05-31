import React, { useState, useEffect, useContext } from 'react';
import '../Notification/Notification.css';
import { getNotifications, markNotificationRead } from '../../api';
import { AuthContext } from '../../index';

const BASE_URL = 'http://localhost:5000'; // Có thể lấy từ biến môi trường

const Notification = () => {
  const { userId } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await getNotifications(page, limit);
        console.log('Notifications fetched:', response); // Debug log
        setNotifications(response.notifications);
      } catch (error) {
        console.error('Failed to fetch notifications:', error.response?.data?.msg || error.message);
        setError(error.response?.data?.msg || 'Không thể tải thông báo');
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchNotifications();
  }, [userId, page]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationRead(notificationId);
      setNotifications(notifications.map(notif =>
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      ));
      console.log(`Notification ${notificationId} marked as read`); // Debug log
    } catch (error) {
      console.error('Failed to mark notification as read:', error.response?.data?.msg || error.message);
      setError(error.response?.data?.msg || 'Không thể đánh dấu thông báo đã đọc');
    }
  };

  return (
    <div className="notification-container">
      <h2>Thông báo</h2>
      {loading ? (
        <p style={{ textAlign: 'center', padding: '20px' }}>Đang tải...</p>
      ) : error ? (
        <p style={{ textAlign: 'center', padding: '20px', color: 'red' }}>{error}</p>
      ) : notifications.length === 0 ? (
        <p style={{ textAlign: 'center', padding: '20px' }}>Chưa có thông báo nào</p>
      ) : (
        <div className="notification-list">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`notification-item ${notif.isRead ? 'read' : 'unread'}`}
              onClick={() => !notif.isRead && handleMarkAsRead(notif.id)}
            >
              <div className="notification-content">
                
                <div className="notification-text">
                  <p>
                    <strong>{notif.RelatedUser?.username || 'User'}</strong>{' '}
                    {notif.type === 'like'
                      ? 'đã thích bài viết của bạn'
                      : notif.type === 'comment'
                      ? 'đã bình luận bài viết của bạn'
                      : 'đã theo dõi bạn'}
                  </p>
                  {notif.relatedPost?.content && (
                    <p className="post-content">{notif.relatedPost.content.substring(0, 50)}...</p>
                  )}
                  
                  <span className="notification-time">
                    {new Date(notif.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
              {!notif.isRead && (
                <button className="mark-read-btn">Đánh dấu đã đọc</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notification;