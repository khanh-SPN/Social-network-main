import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
});

// Thêm token vào header nếu có
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API functions
export const signup = (data) =>
  api.post('/api/auth/signup', data).then((res) => res.data);

export const login = (data) =>
  api.post('/api/auth/login', data).then((res) => res.data);

export const getUserProfile = (id) =>
  api.get(`/api/users/${id}`).then((res) => res.data);

export const updateUserProfile = (id, data) =>
  api.put(`/api/users/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((res) => res.data);

export const followUser = (id) =>
  api.post(`/api/users/${id}/follow`).then((res) => res.data);

export const unfollowUser = (id) =>
  api.post(`/api/users/${id}/unfollow`).then((res) => res.data);

export const searchUsers = (tag) =>
  api.get(`/api/users/search?tag=${tag}`).then((res) => res.data);

export const getSuggestions = () =>
  api.get('/api/users/suggestions').then((res) => res.data);

export const getFollowing = (id) =>
  api.get(`/api/users/${id}/following`).then((res) => res.data);

export const getFollowers = (id) =>
  api.get(`/api/users/${id}/followers`).then((res) => res.data);

export const createPost = (data) =>
  api.post('/api/posts', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((res) => res.data);

export const getPosts = (page = 1, limit = 10) =>
  api.get(`/api/posts?page=${page}&limit=${limit}`).then((res) => res.data);

export const deletePost = (id) =>
  api.delete(`/api/posts/${id}`).then((res) => res.data);

export const likePost = (id) =>
  api.post(`/api/posts/${id}/like`).then((res) => res.data);

export const getPostLikes = (id, page = 1, limit = 10) =>
  api.get(`/api/posts/${id}/likes?page=${page}&limit=${limit}`).then((res) => res.data);

export const getComments = (id, page = 1, limit = 10) =>
  api.get(`/api/posts/${id}/comments?page=${page}&limit=${limit}`).then((res) => res.data);

export const addComment = (id, data) =>
  api.post(`/api/posts/${id}/comment`, data).then((res) => res.data);

export const recommendPost = (id) =>
  api.post(`/api/posts/${id}/recommend`).then((res) => res.data);

export const getNotifications = (page = 1, limit = 10) =>
  api.get(`/api/notifications?page=${page}&limit=${limit}`).then((res) => res.data);

export const markNotificationRead = (id) =>
  api.put(`/api/notifications/${id}/read`).then((res) => res.data);

export const likeComment = (id) =>
  api.post(`/api/comments/${id}/like`).then((res) => res.data);

// New APIs for chat functionality
export const getMessages = (recipientId, page = 1, limit = 20) =>
  api.get(`/api/messages?recipientId=${recipientId}&page=${page}&limit=${limit}`).then((res) => res.data);

export const sendMessage = (data) =>
  api.post('/api/messages', data).then((res) => res.data);

export const getConversations = () =>
  api.get('/api/messages/conversations').then((res) => res.data);

export default api;