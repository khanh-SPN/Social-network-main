import React, { useState, useEffect, useContext } from 'react';
import './Admin.css';
import { adminLogin, getUsers, createUser, updateUser, deleteUser } from '../../api';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../../index';

const BASE_URL = 'http://localhost:5000';

const AdminPage = () => {
  const { setIsAdminAuthenticated } = useContext(AuthContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    profileTag: '',
    bio: '',
    profilePicture: null,
    coverPicture: null,
  });
  const [profilePreview, setProfilePreview] = useState('');
  const [coverPreview, setCoverPreview] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsLoggedIn(true);
      fetchUsers(token);
    }
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsers();
      setUsers(response);
      setError(null);
    } catch (error) {
      setError(error.response?.data?.msg || 'Không thể tải danh sách người dùng');
      toast.error(error.response?.data?.msg || 'Không thể tải danh sách người dùng');
      if (error.response?.status === 401) {
        localStorage.removeItem('adminToken');
        setIsLoggedIn(false);
        setIsAdminAuthenticated(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await adminLogin({ username, password });
      localStorage.setItem('adminToken', response.token);
      setIsLoggedIn(true);
      setIsAdminAuthenticated(true);
      setError(null);
      toast.success('Đăng nhập admin thành công');
      fetchUsers();
    } catch (error) {
      setError(error.response?.data?.msg || 'Sai username hoặc password');
      toast.error(error.response?.data?.msg || 'Sai username hoặc password');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, [type]: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'profilePicture') setProfilePreview(reader.result);
        else setCoverPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const form = new FormData();
      form.append('username', formData.username);
      form.append('email', formData.email);
      if (formData.password) form.append('password', formData.password);
      form.append('profileTag', formData.profileTag);
      form.append('bio', formData.bio);
      if (formData.profilePicture) form.append('profilePicture', formData.profilePicture);
      if (formData.coverPicture) form.append('coverPicture', formData.coverPicture);

      if (editUser) {
        await updateUser(editUser.id, form);
        toast.success('Cập nhật tài khoản thành công');
      } else {
        await createUser(form);
        toast.success('Tạo tài khoản thành công');
      }
      fetchUsers();
      setModalOpen(false);
      setEditUser(null);
      setFormData({
        username: '',
        email: '',
        password: '',
        profileTag: '',
        bio: '',
        profilePicture: null,
        coverPicture: null,
      });
      setProfilePreview('');
      setCoverPreview('');
      setError(null);
    } catch (error) {
      setError(error.response?.data?.msg || 'Không thể lưu tài khoản');
      toast.error(error.response?.data?.msg || 'Không thể lưu tài khoản');
      if (error.response?.status === 401) {
        localStorage.removeItem('adminToken');
        setIsLoggedIn(false);
        setIsAdminAuthenticated(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa tài khoản này?')) {
      try {
        setLoading(true);
        await deleteUser(id);
        toast.success('Xóa tài khoản thành công');
        fetchUsers();
        setError(null);
      } catch (error) {
        setError(error.response?.data?.msg || 'Không thể xóa tài khoản');
        toast.error(error.response?.data?.msg || 'Không thể xóa tài khoản');
        if (error.response?.status === 401) {
          localStorage.removeItem('adminToken');
          setIsLoggedIn(false);
          setIsAdminAuthenticated(false);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const openModal = (user = null) => {
    setEditUser(user);
    setFormData(
      user
        ? { ...user, password: '', profilePicture: null, coverPicture: null }
        : {
            username: '',
            email: '',
            password: '',
            profileTag: '',
            bio: '',
            profilePicture: null,
            coverPicture: null,
          }
    );
    setProfilePreview(user?.profilePicture ? `${BASE_URL}${user.profilePicture}` : '');
    setCoverPreview(user?.coverPicture ? `${BASE_URL}${user.coverPicture}` : '');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditUser(null);
    setError(null);
    setProfilePreview('');
    setCoverPreview('');
  };

  if (!isLoggedIn) {
    return (
      <div className="admin-container">
        <h2>Đăng nhập Admin</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleLogin} className="admin-login-form">
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Nhập username"
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Nhập password"
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="admin-container">
      <h2>Quản lý tài khoản</h2>
      <button className="add-user-btn" onClick={() => openModal()}>
        Thêm tài khoản
      </button>
      {error && <p className="error">{error}</p>}
      <div className="admin-table">
        {loading ? (
          <Skeleton count={5} height={50} style={{ marginBottom: '10px' }} />
        ) : users.length === 0 ? (
          <p>Chưa có tài khoản nào</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Avatar</th>
                <th>Username</th>
                <th>Email</th>
                <th>Profile Tag</th>
                <th>Bio</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>
                    <img
                      src={user.profilePicture ? `${BASE_URL}${user.profilePicture}` : '/images/default-profile.jpg'}
                      alt="Avatar"
                      className="admin-user-img"
                      onError={(e) => (e.target.src = '/images/default-profile.jpg')}
                    />
                  </td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.profileTag}</td>
                  <td>{user.bio || '-'}</td>
                  <td>
                    <button className="edit-btn" onClick={() => openModal(user)}>
                      Sửa
                    </button>
                    <button className="delete-btn" onClick={() => handleDeleteUser(user.id)}>
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editUser ? 'Sửa tài khoản' : 'Thêm tài khoản'}</h3>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label>Username:</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  placeholder="Nhập username"
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="Nhập email"
                />
              </div>
              <div className="form-group">
                <label>Password {editUser ? '(để trống nếu không đổi)' : ''}:</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Nhập password"
                  required={!editUser}
                />
              </div>
              <div className="form-group">
                <label>Profile Tag:</label>
                <input
                  type="text"
                  value={formData.profileTag}
                  onChange={(e) => setFormData({ ...formData, profileTag: e.target.value })}
                  placeholder="Nhập profile tag (VD: @username)"
                />
              </div>
              <div className="form-group">
                <label>Bio:</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Nhập bio"
                />
              </div>
              <div className="form-group">
                <label>Ảnh đại diện:</label>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={(e) => handleFileChange(e, 'profilePicture')}
                />
                {profilePreview && (
                  <img src={profilePreview} alt="Profile Preview" className="image-preview" />
                )}
              </div>
              <div className="form-group">
                <label>Ảnh bìa:</label>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={(e) => handleFileChange(e, 'coverPicture')}
                />
                {coverPreview && (
                  <img src={coverPreview} alt="Cover Preview" className="image-preview" />
                )}
              </div>
              <div className="modal-actions">
                <button type="submit" disabled={loading}>
                  {loading ? 'Đang lưu...' : editUser ? 'Cập nhật' : 'Tạo'}
                </button>
                <button type="button" onClick={closeModal} disabled={loading}>
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default AdminPage;