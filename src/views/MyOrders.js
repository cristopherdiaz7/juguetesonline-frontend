import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrdersContext';
import { useNotifications } from '../context/NotificationsContext';

const StatusBadge = ({ status }) => {
  const map = {
    pendiente: 'warning',
    aprobado: 'success',
    rechazado: 'danger',
  };
  const cls = map[status] || 'secondary';
  return <span className={`badge bg-${cls} text-uppercase`}>{status}</span>;
};

export default function MyOrders() {
  const { user } = useAuth();
  const { getOrdersByUser } = useOrders();
  const { getUserNotifications, markAllAsRead, unreadCountFor } = useNotifications();
  const orders = React.useMemo(() => {
    if (!user) return [];
    return getOrdersByUser(user.username).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [user, getOrdersByUser]);

  const notifications = React.useMemo(() => {
    if (!user) return [];
    return [...getUserNotifications(user.username)].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [user, getUserNotifications]);

  return (
    <div className="container mt-4">
      <h2 style={{color: '#e11d48', fontWeight: 900}}>Mis pedidos</h2>
      {user && notifications.length > 0 && (
        <div className="alert alert-info d-flex justify-content-between align-items-center">
          <div>
            <div className="fw-bold">Notificaciones ({unreadCountFor(user.username)})</div>
            <ul className="mb-0">
              {notifications.slice(0, 3).map(n => (
                <li key={n.id}>
                  <span className={`badge me-1 bg-${n.type==='success'?'success':n.type==='danger'?'danger':n.type==='warning'?'warning':'secondary'}`}> </span>
                  {n.message} <small className="text-muted">({new Date(n.createdAt).toLocaleString()})</small> {n.read ? '' : <span className="badge bg-primary ms-1">nuevo</span>}
                </li>
              ))}
            </ul>
          </div>
          <button className="btn btn-sm btn-outline-primary" onClick={() => markAllAsRead(user.username)}>Marcar como leídas</button>
        </div>
      )}
      {orders.length === 0 ? (
        <p>No tenés pedidos todavía.</p>
      ) : (
        orders.map(order => (
          <div key={order.id} className="card mb-3">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div>
                  <b>Pedido:</b> {order.id} · <b>Fecha:</b> {new Date(order.createdAt).toLocaleString()} · <StatusBadge status={order.status} />
                </div>
                <div className="fw-bold">Total: ${order.total.toLocaleString()}</div>
              </div>
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Cantidad</th>
                      <th>Precio</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map(it => (
                      <tr key={it.id}>
                        <td>{it.name}</td>
                        <td>{it.quantity}</td>
                        <td>${it.price.toLocaleString()}</td>
                        <td>${(it.price * it.quantity).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-2">
                <div><b>Envío a:</b> {order.shipping?.nombre}</div>
                <div><b>Dirección:</b> {order.shipping?.direccion}, {order.shipping?.ciudad}</div>
                <div><b>Teléfono:</b> {order.shipping?.telefono}</div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
