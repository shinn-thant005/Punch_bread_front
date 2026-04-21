import axios from 'axios';

// This is the bridge to your Spring Boot backend
const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
});

export default api;