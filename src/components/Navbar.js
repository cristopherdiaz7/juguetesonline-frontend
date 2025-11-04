import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationsContext';

export default function Navbar() {
  const { cart } = useCart();
  const location = useLocation();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const { user, logout } = useAuth();
  const { unreadCountFor } = useNotifications();
  const unread = user ? unreadCountFor(user.username) : 0;

  const [search, setSearch] = React.useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      window.location.href = `/buscar?q=${encodeURIComponent(search)}`;
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm mb-3">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">Juguetes Online</Link>
        <form className="d-flex me-3" onSubmit={handleSubmit} style={{maxWidth: 300}}>
          <input
            type="search"
            className="form-control me-2"
            placeholder="Buscar juguetes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Buscar"
          />
          <button className="btn btn-outline-success" type="submit">Buscar</button>
        </form>
        <div className="d-flex align-items-center">
          {user?.role === 'admin' && (
            <Link to="/admin" className="btn btn-outline-secondary me-2">Admin</Link>
          )}
          {user && user.role !== 'admin' && (
            <Link to="/mis-pedidos" className="btn btn-outline-success me-2">Mis pedidos</Link>
          )}
          {!user ? (
            <>
              <Link to="/login" className="btn btn-outline-primary me-2">Iniciar sesión</Link>
              <Link to="/register" className="btn btn-primary me-3">Registrarse</Link>
            </>
          ) : (
            <>
              <span className="me-2">Hola, <b>{user.username}</b></span>
              <Link to="/cambiar-contrasena" className="btn btn-outline-info me-2" title="Cambiar contraseña">
                🔑
              </Link>
              <Link to="/logout" className="btn btn-outline-dark me-3">Cerrar sesión</Link>
            </>
          )}
          {user && user.role !== 'admin' && (
            <Link to="/mis-pedidos" className="btn position-relative me-2" title="Notificaciones" style={{fontSize: 20}}>
              <span role="img" aria-label="campana">🔔</span>
              {unread > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {unread}
                </span>
              )}
            </Link>
          )}
          {user?.role !== 'admin' && (
            <Link to="/cart" className="btn position-relative me-3" style={{fontSize: 22}}>
              <span role="img" aria-label="carrito">🛒</span>
              {totalItems > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
          {location.pathname !== '/' && (
            <Link to="/" className="btn btn-outline-primary">Volver al menú principal</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
