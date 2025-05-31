import React, { useState, useEffect, useContext } from 'react';
import '../Notification/Notification.css';
import { getNotifications, markNotificationRead } from '../../api';
import { AuthContext } from '../../index';

const BASE_URL = 'http://localhost:5000';

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
        console.log('Notifications fetched:', response);
        setNotifications(response.notifications.filter(notif => !notif.isRead));
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
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
      setNotifications(notifications.filter(notif => notif.id !== notificationId));
      console.log(`Notification ${notificationId} marked as read and hidden`);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      setError(error.response?.data?.msg || 'Không thể đánh dấu thông báo đã đọc');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadIds = notifications.map(notif => notif.id);
      if (unreadIds.length === 0) return;
      await Promise.all(unreadIds.map(id => markNotificationRead(id)));
      setNotifications([]);
      console.log('All notifications marked as read and hidden');
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      setError(error.response?.data?.msg || 'Không thể đánh dấu tất cả thông báo đã đọc');
    }
  };

  return (
    <div className="notification-container">
      <div className="notification-header">
        <h2>Thông báo</h2>
        {notifications.length > 0 && (
          <button className="mark-all-read-btn" onClick={handleMarkAllAsRead}>
            Đánh dấu tất cả đã đọc
          </button>
        )}
      </div>
      {loading ? (
        <p className="notification-status">Đang tải...</p>
      ) : error ? (
        <p className="notification-status notification-error">{error}</p>
      ) : notifications.length === 0 ? (
        <p className="notification-status">Chưa có thông báo mới</p>
      ) : (
        <div className="notification-list">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className="notification-item"
              onClick={() => handleMarkAsRead(notif.id)}
            >
              <img
                src={notif.RelatedUser?.profilePicture ? `${BASE_URL}${notif.RelatedUser.profilePicture}` : '/images/default-profile.jpg'}
                alt={`${notif.RelatedUser?.username || 'User'}'s avatar`}
                className="notification-avatar"
                onError={(e) => (e.target.src = '/images/default-profile.jpg')}
              />
              <div className="notification-content">
                <p className="notification-text">
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
                  {new Date(notif.createdAt).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notification;