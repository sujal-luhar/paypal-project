// src/lib/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/v1", // Replace with your actual backend URL
});

// Add a request interceptor
// This automatically adds the token to every request if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Assuming you store token here
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;