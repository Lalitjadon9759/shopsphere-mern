import axios from "axios";

import {
  getToken,
  removeToken,
  removeUser,
} from "../utils/storage";

// ======================================================
// Axios Instance
// ======================================================

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ======================================================
// Request Interceptor
// ======================================================

api.interceptors.request.use(
  (config) => {
    const token = getToken();

    // Add JWT token automatically
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

// ======================================================
// Response Interceptor
// ======================================================

api.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    // ==================================================
    // Unauthorized
    // ==================================================

    if (error.response?.status === 401) {
      console.warn("⚠️ Session expired. Redirecting to login...");

      removeToken();
      removeUser();

      // Avoid redirect loop
      if (
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/register"
      ) {
        window.location.href = "/login";
      }
    }

    // ==================================================
    // Forbidden
    // ==================================================

    if (error.response?.status === 403) {
      console.warn(
        "⚠️ Access denied:",
        error.response?.data?.message
      );
    }

    // ==================================================
    // Network Error
    // ==================================================

    if (!error.response) {
      console.error(
        "❌ Network Error:",
        error.message
      );
    }

    return Promise.reject(error);
  }
);

// ======================================================
// Export
// ======================================================

export default api;