import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

const STORAGE_KEY = 'notificationsByUser';

const NotificationsContext = createContext();

export function useNotifications() {
  return useContext(NotificationsContext);
}

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function NotificationsProvider({ children }) {
  const { user } = useAuth();
  const [byUser, setByUser] = useState(readAll);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(byUser));
  }, [byUser]);

  // When an authenticated user is available, fetch server-side notifications and merge
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!user) return;
      try {
        const resp = await api.get('/notifications/');
        if (!mounted) return;
        const serverNotifs = (resp.data || []).map(n => ({
          id: `sv_${n.id}`,
          message: n.message,
          type: n.tipo || 'info',
          read: !!n.read,
          createdAt: n.created_at,
        }));
        setByUser(prev => ({
          ...prev,
          [user.username]: [...(prev[user.username] || []), ...serverNotifs],
        }));
      } catch (err) {
        // ignore load errors; keep local notifications
      }
    };
    load();
    return () => { mounted = false; };
  }, [user]);

  const pushNotification = (username, message, type = 'info') => {
    const notif = {
      id: `ntf_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      message,
      type, // 'info' | 'success' | 'warning' | 'danger'
      read: false,
      createdAt: new Date().toISOString(),
    };
    setByUser(prev => ({
      ...prev,
      [username]: [...(prev[username] || []), notif],
    }));
  };

  const getUserNotifications = (username) => byUser[username] || [];

  const markAllAsRead = (username) => {
    // Update server and local cache
    (async () => {
      try {
        await api.post('/notifications/mark_all_read/');
      } catch (err) {
        // ignore server errors
      }
    })();
    setByUser(prev => ({
      ...prev,
      [username]: (prev[username] || []).map(n => ({ ...n, read: true })),
    }));
  };

  const markAsRead = (username, id) => {
    // Update local cache and try server-side mark if available
    setByUser(prev => ({
      ...prev,
      [username]: (prev[username] || []).map(n => n.id === id ? ({ ...n, read: true }) : n),
    }));
    (async () => {
      try {
        // best-effort: call server endpoint if exists
        await api.post(`/notifications/${String(id).replace(/^ntf_/, '')}/mark_read/`);
      } catch (err) {
        // ignore server errors
      }
    })();
  };

  const clearUser = (username) => {
    setByUser(prev => ({ ...prev, [username]: [] }));
  };

  const unreadCountFor = (username) => (byUser[username] || []).filter(n => !n.read).length;

  const value = useMemo(() => ({ byUser, pushNotification, getUserNotifications, markAllAsRead, markAsRead, clearUser, unreadCountFor }), [byUser]);

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}
