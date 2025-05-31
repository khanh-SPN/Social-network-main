import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Base URL includes /api
});

// Thêm token vào header nếu có
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || localStorage.getItem('adminToken'); // Hỗ trợ cả token admin
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API functions
export const signup = (data) =>
  api.post('/auth/signup', data).then((res) => res.data);

export const login = (data) =>
  api.post('/auth/login', data).then((res) => res.data);

export const getUserProfile = (id) =>
  api.get(`/users/${id}`).then((res) => res.data);

export const updateUserProfile = (id, data) =>
  api.put(`/users/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((res) => res.data);

export const followUser = (id) =>
  api.post(`/users/${id}/follow`).then((res) => res.data);

export const unfollowUser = (id) =>
  api.post(`/users/${id}/unfollow`).then((res) => res.data);

export const searchUsers = (tag) =>
  api.get(`/users/search?tag=${tag}`).then((res) => res.data);

export const getSuggestions = () =>
  api.get('/users/suggestions').then((res) => res.data);

export const getFollowing = (id) =>
  api.get(`/users/${id}/following`).then((res) => res.data);

export const getFollowers = (id) =>
  api.get(`/users/${id}/followers`).then((res) => res.data);

export const createPost = (data) =>
  api.post('/posts', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((res) => res.data);

export const getPosts = (page = 1, limit = 10) =>
  api.get(`/posts?page=${page}&limit=${limit}`).then((res) => res.data);

export const deletePost = (id) =>
  api.delete(`/posts/${id}`).then((res) => res.data);

export const likePost = (id) =>
  api.post(`/posts/${id}/like`).then((res) => res.data);

export const getPostLikes = (id, page = 1, limit = 10) =>
  api.get(`/posts/${id}/likes?page=${page}&limit=${limit}`).then((res) => res.data);

export const getComments = (id, page = 1, limit = 10) =>
  api.get(`/posts/${id}/comments?page=${page}&limit=${limit}`).then((res) => res.data);

export const addComment = (id, data) =>
  api.post(`/posts/${id}/comment`, data).then((res) => res.data);

export const recommendPost = (id) =>
  api.post(`/posts/${id}/recommend`).then((res) => res.data);

export const getNotifications = (page = 1, limit = 10) =>
  api.get(`/notifications?page=${page}&limit=${limit}`).then((res) => res.data);

export const markNotificationRead = (id) =>
  api.put(`/notifications/${id}/read`).then((res) => res.data);

export const likeComment = (id) =>
  api.post(`/comments/${id}/like`).then((res) => res.data);

// Chat APIs
export const getMessages = (recipientId, page = 1, limit = 20) =>
  api.get(`/messages?recipientId=${recipientId}&page=${page}&limit=${limit}`).then((res) => res.data);

export const sendMessage = (data) =>
  api.post('/messages', data).then((res) => res.data);

export const getConversations = () =>
  api.get('/messages/conversations').then((res) => res.data);

// Admin APIs
export const adminLogin = (data) =>
  api.post('/admin/auth/admin-login', data).then((res) => res.data);

export const getUsers = () =>
  api.get('/admin/users').then((res) => res.data);

export const createUser = (data) =>
  api.post('/admin/users', data).then((res) => res.data);

export const updateUser = (id, data) =>
  api.put(`/admin/users/${id}`, data).then((res) => res.data);

export const deleteUser = (id) =>
  api.delete(`/admin/users/${id}`).then((res) => res.data);

export default api;