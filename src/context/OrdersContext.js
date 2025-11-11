import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationsContext';
import api from '../services/api';

const OrdersContext = createContext();

export function useOrders() {
  return useContext(OrdersContext);
}

const STORAGE_KEY = 'orders';

export function OrdersProvider({ children }) {
  const { user } = useAuth();
  const { pushNotification } = useNotifications();
  const [orders, setOrders] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  const addOrder = (order) => {
    setOrders(prev => [{ ...order }, ...prev]);
  };

  // When an authenticated user is available, sync orders from the server so
  // statuses (aprobado/rechazado) are reflected even if they were changed by admin.
  // syncFromServer extracted so it can be triggered by both polling and an
  // external event (dispatched from admin UI or elsewhere). This avoids
  // circular imports between contexts by using a window CustomEvent.
  const syncFromServer = async () => {
    if (!user) return;
    try {
      const resp = await api.get('/pedidos/');
      const serverOrders = (resp.data || []).map(o => ({
        id: o.id,
        username: o.usuario_nombre || (o.usuario && o.usuario.nombre) || (o.usuario || null),
        createdAt: o.fecha || new Date().toISOString(),
        total: o.total || 0,
        status: o.estado || 'pendiente',
        items: (o.items_out || o.items || []).map(it => ({ id: it.producto_id || it.id, name: it.nombre || it.producto_nombre || '', quantity: it.cantidad || it.quantity || 0, price: it.precio || it.price || 0 })),
        shipping: o.envio || o.shipping || null,
      }));

      // Merge: prefer server status for orders with same id, keep local-only orders too
      setOrders(prev => {
        const byId = {};
        prev.forEach(p => { byId[p.id] = p; });
        serverOrders.forEach(s => {
          const existing = byId[s.id];
          if (existing) {
            // update status and any server-canonical fields
            byId[s.id] = { ...existing, ...s };
          } else {
            byId[s.id] = s;
          }
        });
        // keep the array sorted by createdAt desc
        return Object.values(byId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      });
    } catch (err) {
      // ignore sync errors
    }
  };

  useEffect(() => {
    let mounted = true;
    let intervalId = null;

    // Immediate sync, then poll every 15s for updates so buyer sees admin changes quickly
    syncFromServer();
    intervalId = setInterval(syncFromServer, 15000);

    return () => { mounted = false; if (intervalId) clearInterval(intervalId); };
  }, [user]);

  // Listen for a global event dispatched when an admin changes a pedido's estado.
  // Admin UI will dispatch a CustomEvent 'pedidoEstadoChanged' with details; when
  // received we trigger an immediate sync to reflect the change in the buyer UI.
  useEffect(() => {
    const handler = (ev) => {
      // small guard: only sync when user is present
      if (!user) return;
      // fire-and-forget
      syncFromServer();
    };
    window.addEventListener('pedidoEstadoChanged', handler);
    return () => { window.removeEventListener('pedidoEstadoChanged', handler); };
  }, [user]);

  const updateOrderStatus = (orderId, status) => {
    setOrders(prev => {
      const next = prev.map(o => o.id === orderId ? { ...o, status } : o);
      const current = prev.find(o => o.id === orderId);
      if (current && current.username) {
        const msg = status === 'aprobado'
          ? `Tu pedido ${orderId} fue aprobado`
          : status === 'rechazado'
            ? `Tu pedido ${orderId} fue rechazado`
            : `Tu pedido ${orderId} cambió a estado: ${status}`;
        // Notificar al dueño del pedido
        pushNotification(current.username, msg, status === 'aprobado' ? 'success' : status === 'rechazado' ? 'danger' : 'info');
      }
      return next;
    });
  };

  const getOrdersByUser = (username) => orders.filter(o => o.username === username);

  const value = useMemo(() => ({ orders, addOrder, updateOrderStatus, getOrdersByUser }), [orders]);

  return (
    <OrdersContext.Provider value={value}>
      {children}
    </OrdersContext.Provider>
  );
}
