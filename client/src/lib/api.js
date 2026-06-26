// What: Creates the shared Axios client for backend API calls.
// Why: A single client keeps the API base URL and auth token behavior consistent.
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api"
});

api.interceptors.request.use((config) => {
  // Why: Attach the JWT automatically so protected admin requests stay simple.
  const token = localStorage.getItem("portfolio_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
