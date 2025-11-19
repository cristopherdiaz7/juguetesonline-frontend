import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';

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
    setByUser(prev => ({
      ...prev,
      [username]: (prev[username] || []).map(n => ({ ...n, read: true })),
    }));
  };

  const clearUser = (username) => {
    setByUser(prev => ({ ...prev, [username]: [] }));
  };

  const unreadCountFor = (username) => (byUser[username] || []).filter(n => !n.read).length;

  const value = useMemo(() => ({ byUser, pushNotification, getUserNotifications, markAllAsRead, clearUser, unreadCountFor }), [byUser]);

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}
