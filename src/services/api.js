import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Board API calls
export const boardAPI = {
  getAll: async () => {
    const response = await api.get('/boards');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/boards/${id}`);
    return response.data;
  },

  create: async (boardData) => {
    const response = await api.post('/boards', boardData);
    return response.data;
  },

  update: async (id, boardData) => {
    const response = await api.put(`/boards/${id}`, boardData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/boards/${id}`);
    return response.data;
  },

  getTasks: async (boardId) => {
    const response = await api.get(`/boards/${boardId}/tasks`);
    return response.data;
  }
};

// Task API calls
export const taskAPI = {
  getById: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  create: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  update: async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  }
};

// Error interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || error.message || 'An error occurred';
    console.error('API Error:', message);
    return Promise.reject(new Error(message));
  }
);

export default api;