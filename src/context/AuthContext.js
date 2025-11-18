import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { setAuthToken } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('access_token'));
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem('refresh_token'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (accessToken) setAuthToken(accessToken);
    else setAuthToken(null);
  }, [accessToken]);

  // En entorno de desarrollo forzamos que no haya sesión persistente al recargar
  // Esto hace que la app requiera login cada vez que se abra durante pruebas.
  useEffect(() => {
    // NOTE: previously we cleared auth on development mount to force fresh sessions for testing.
    // That behavior was removed so registration/login persist across reloads during development.
  }, []);

  // En el arranque, si hay accessToken, verificar que sea válido.
  // Intentamos una llamada protegida; si obtenemos 401 tratamos de refrescar el token.
  useEffect(() => {
    let mounted = true;
    const validateSession = async () => {
      if (!accessToken) return;
      try {
        // llamar a /user/me/ para obtener datos del usuario autenticado
        const resp = await api.get('/user/me/');
        if (mounted) {
          localStorage.setItem('user', JSON.stringify(resp.data));
          setUser(resp.data);
        }
      } catch (err) {
        if (!mounted) return;
        const status = err?.response?.status;
        if (status === 401) {
          // intentar refresh
          const refreshed = await refreshAccessToken();
          if (!refreshed) {
            // el refresh falló -> salir de la sesión
            logout();
            // redirigir al login para que el usuario vuelva a autenticarse
            try { window.location.href = '/login'; } catch (e) { /* no hacemos nada si no está disponible */ }
          }
        }
        // otros errores de red se ignoran (puede ser servidor caído)
      }
    };
    validateSession();
    return () => { mounted = false; };
  }, []); // ejecutar sólo al montar

  const login = async (username, password) => {
    setLoading(true);
    try {
      const resp = await api.post('/token/', { username, password });
      const { access, refresh } = resp.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      setAccessToken(access);
      setRefreshToken(refresh);
      // obtener datos del usuario autenticado y poblar user
      try {
        const me = await api.get('/user/me/');
        localStorage.setItem('user', JSON.stringify(me.data));
        setUser(me.data);
      } catch (e) {
        // si falla, al menos guardamos el username
        localStorage.setItem('user', JSON.stringify({ username }));
        setUser({ username });
      }
      setLoading(false);
      return { ok: true };
    } catch (err) {
      setLoading(false);
      return { ok: false, error: err.response?.data || err.message };
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const resp = await api.post('/user/register/', payload);
      setLoading(false);
      return { ok: true, data: resp.data };
    } catch (err) {
      setLoading(false);
      return { ok: false, error: err.response?.data || err.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    setAuthToken(null);
  };

  const refreshAccessToken = async () => {
    if (!refreshToken) return false;
    try {
      const resp = await api.post('/token/refresh/', { refresh: refreshToken });
      const { access } = resp.data;
      localStorage.setItem('access_token', access);
      setAccessToken(access);
      // tras refrescar, actualizar los datos del usuario
      try {
        const me = await api.get('/user/me/');
        localStorage.setItem('user', JSON.stringify(me.data));
        setUser(me.data);
      } catch (e) {
        // ignorar si falla
      }
      return true;
    } catch (err) {
      logout();
      return false;
    }
  };

  const changePassword = async (username, currentPassword, newPassword) => {
    // username param kept for compatibility with UI, but server uses authenticated user
    if (!currentPassword || !newPassword) return { success: false, message: 'Missing passwords' };
    try {
      const resp = await api.post('/user/change_password/', { current_password: currentPassword, new_password: newPassword });
      return { success: true, message: resp.data?.message || 'Password changed' };
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data || err.message;
      return { success: false, message: typeof msg === 'string' ? msg : JSON.stringify(msg) };
    }
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, refreshToken, loading, login, register, logout, refreshAccessToken, changePassword, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
