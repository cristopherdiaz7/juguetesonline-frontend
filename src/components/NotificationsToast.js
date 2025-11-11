import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationsContext';

// Simple toasts container — shows unread notifications for current user
export default function NotificationsToast() {
  const { user } = useAuth();
  const { getUserNotifications, markAsRead } = useNotifications();
  const [visible, setVisible] = useState([]);

  const all = useMemo(() => (user ? getUserNotifications(user.username) : []), [user, getUserNotifications]);
  const unread = useMemo(() => (all || []).filter(n => !n.read), [all]);

  useEffect(() => {
    if (!unread || unread.length === 0) return;
    // show new unread items that aren't already visible
    setVisible(prev => {
      const ids = new Set(prev.map(p => p.id));
      const news = unread.filter(n => !ids.has(n.id));
      return [...prev, ...news];
    });
  }, [unread]);

  useEffect(() => {
    // auto-dismiss each visible toast after 3s
    const timers = visible.map(n => {
      const t = setTimeout(() => {
        handleClose(n.id);
      }, 3000 + (n.type === 'danger' ? 1500 : 0));
      return { id: n.id, t };
    });
    return () => timers.forEach(x => clearTimeout(x.t));
  }, [visible]);

  const handleClose = (id) => {
    if (!user) return;
    setVisible(prev => prev.filter(p => p.id !== id));
    try {
      markAsRead(user.username, id);
    } catch (e) {
      // ignore
    }
  };

  if (!visible || visible.length === 0) return null;

  return (
    <div style={{position: 'fixed', top: 16, right: 16, zIndex: 1050, display: 'flex', flexDirection: 'column', gap: 8}}>
      {visible.map(n => (
        <div key={n.id} className={`p-2 rounded shadow-sm border`} style={{minWidth: 240, background: n.type === 'success' ? '#d1fae5' : n.type === 'danger' ? '#fee2e2' : '#eef2ff', borderColor: '#e5e7eb'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <strong style={{fontSize: 14}}>{n.type === 'success' ? 'Éxito' : n.type === 'danger' ? 'Error' : 'Info'}</strong>
            <button className="btn btn-sm btn-link" onClick={() => handleClose(n.id)} style={{textDecoration: 'none'}}>✕</button>
          </div>
          <div style={{fontSize: 14}}>{n.message}</div>
        </div>
      ))}
    </div>
  );
}
