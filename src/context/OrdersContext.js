import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationsContext';

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
