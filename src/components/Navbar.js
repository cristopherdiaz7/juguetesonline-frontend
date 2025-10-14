import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { cart } = useCart();
  const location = useLocation();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

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
          <Link to="/cart" className="btn position-relative me-3" style={{fontSize: 22}}>
            <span role="img" aria-label="carrito">🛒</span>
            {totalItems > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {totalItems}
              </span>
            )}
          </Link>
          {location.pathname !== '/' && (
            <Link to="/" className="btn btn-outline-primary">Volver al menú principal</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
