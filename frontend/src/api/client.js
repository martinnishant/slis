import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
});

export const getStudents = () => api.get('/students');
export const getStudent = (id) => api.get(`/students/${id}`);
export const predictGrade = (data) => api.post('/predict/grade', data);
export const predictRisk = (data) => api.post('/predict/risk', data);
export const getRecommendation = (data) => api.post('/recommend', data);
export const getStats = () => api.get('/stats/overview');