import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Authentication
export const signup = (data) => API.post('/auth/signup', data);
export const login = (data) => API.post('/auth/login', data);

// Users
export const getUser = (id) => API.get(`/users/${id}`);
export const updateUser = (id, data) => {
  const formData = new FormData();
  if (data.bio) formData.append('bio', data.bio);
  if (data.profilePicture) formData.append('profilePicture', data.profilePicture);
  if (data.coverPicture) formData.append('coverPicture', data.coverPicture);
  return API.put(`/users/${id}`, formData);
};
export const followUser = (id) => API.post(`/users/${id}/follow`);
export const unfollowUser = (id) => API.post(`/users/${id}/unfollow`);
export const searchUsers = (tag) => API.get(`/users/search?tag=${tag}`);
export const getSuggestions = () => API.get('/users/suggestions');
export const getFollowing = (id) => API.get(`/users/${id}/following`);
export const getFollowers = (id) => API.get(`/users/${id}/followers`);

// Posts
export const createPost = (data) => {
  const formData = new FormData();
  if (data.content) formData.append('content', data.content);
  if (data.image) formData.append('image', data.image);
  return API.post('/posts', formData);
};
export const getPosts = (page = 1, limit = 10) => API.get(`/posts?page=${page}&limit=${limit}`);
export const deletePost = (id) => API.delete(`/posts/${id}`);
export const likePost = (id) => API.post(`/posts/${id}/like`);
export const commentPost = (id, content) => API.post(`/posts/${id}/comment`, { content });
export const recommendPost = (id) => API.post(`/posts/${id}/recommend`);

// Notifications
export const getNotifications = (page = 1, limit = 10) => API.get(`/notifications?page=${page}&limit=${limit}`);
export const markAsRead = (id) => API.put(`/notifications/${id}/read`);

export default API;