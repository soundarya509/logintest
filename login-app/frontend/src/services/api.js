import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
  timeout: 8000,
});

// Attach JWT token automatically
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const loginUser = async (username, password) => {
  const response = await api.post("/login", { username, password });
  return response.data;
};

export const verifyToken = async () => {
  const response = await api.get("/verify");
  return response.data;
};

export default api;