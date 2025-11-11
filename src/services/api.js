import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
if (process.env.NODE_ENV === 'development') {
  console.log('API Base URL:', api.defaults.baseURL);
}

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Response interceptor to handle access token refresh on 401
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        const resp = await axios.post(`${api.defaults.baseURL}/token/refresh/`, { refresh: refreshToken });
        const newAccess = resp.data.access;
        localStorage.setItem('access_token', newAccess);
        setAuthToken(newAccess);
        processQueue(null, newAccess);
        isRefreshing = false;
        originalRequest.headers['Authorization'] = 'Bearer ' + newAccess;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        isRefreshing = false;
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Helper to resolve media/image URLs returned by the API.
// If the `path` is an absolute URL, return as-is.
// If the `path` starts with a slash (e.g. "/media/.."), prepend the API host (without the /api suffix).
export const getMediaUrl = (path) => {
  if (!path) return null;
  if (typeof path !== 'string') return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  // api.defaults.baseURL is like 'http://127.0.0.1:8000/api'
  const base = api.defaults.baseURL.replace(/\/api\/?$/, '');
  if (path.startsWith('/')) return base + path;
  // Otherwise assume it's a relative media path; join with base + '/media/'
  return base + '/media/' + path;
};
