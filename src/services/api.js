import axios from 'axios';

// Build base URL from environment variable. In production we warn loudly if
// the env var is missing so the app doesn't silently call localhost.
const RAW_API = process.env.REACT_APP_API_URL || '';
if (process.env.NODE_ENV === 'production' && !RAW_API) {
  // eslint-disable-next-line no-console
  console.error('REACT_APP_API_URL is not defined. Frontend will not be able to reach the API in production.');
}

// Ensure trailing slashes are normalized. If RAW_API is provided we append
// the `/api` suffix (the backend endpoints live under /api).
const baseUrl = RAW_API ? RAW_API.replace(/\/+$/, '') + '/api' : 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: baseUrl,
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
        // Use the configured baseUrl to post to the refresh endpoint. We use
        // the top-level axios to avoid triggering this instance's interceptors.
        const resp = await axios.post(`${baseUrl}/token/refresh/`, { refresh: refreshToken });
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
