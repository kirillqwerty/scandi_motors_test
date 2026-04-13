import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const api = {
  // Cars
  getCars: () => axios.get(`${API}/cars`).then(r => r.data),
  getCar: (id) => axios.get(`${API}/cars/${id}`).then(r => r.data),
  createCar: (data, token) => axios.post(`${API}/cars`, data, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.data),
  updateCar: (id, data, token) => axios.put(`${API}/cars/${id}`, data, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.data),
  deleteCar: (id, token) => axios.delete(`${API}/cars/${id}`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.data),

  // Articles
  getArticles: (all = false) => axios.get(`${API}/articles`, { params: { all } }).then(r => r.data),
  getArticle: (id) => axios.get(`${API}/articles/${id}`).then(r => r.data),
  createArticle: (data, token) => axios.post(`${API}/articles`, data, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.data),
  updateArticle: (id, data, token) => axios.put(`${API}/articles/${id}`, data, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.data),
  deleteArticle: (id, token) => axios.delete(`${API}/articles/${id}`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.data),

  // Submissions
  createSubmission: (data) => axios.post(`${API}/submissions`, data).then(r => r.data),
  getSubmissions: (token) => axios.get(`${API}/submissions`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.data),
  deleteSubmission: (id, token) => axios.delete(`${API}/submissions/${id}`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.data),
  markRead: (id, token) => axios.put(`${API}/submissions/${id}/read`, {}, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.data),

  // Admin
  adminLogin: (password) => axios.post(`${API}/admin/login`, { password }).then(r => r.data),

  // Seed
  seed: () => axios.post(`${API}/seed`).then(r => r.data),
};

export default api;
