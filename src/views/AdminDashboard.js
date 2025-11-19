import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrdersContext';

export default function AdminDashboard() {
  const { users, user } = useAuth();
  const { orders, updateOrderStatus } = useOrders();

  // Estado editable para carritos guardados
  const [cartsByUser, setCartsByUser] = React.useState({});
  const [showOnlyWithItems, setShowOnlyWithItems] = React.useState(false);
  const [sortOrder, setSortOrder] = React.useState('none'); // none | totalAsc | totalDesc

  const loadCarts = () => {
    try {
      const raw = localStorage.getItem('cartsByUser');
      setCartsByUser(raw ? JSON.parse(raw) : {});
    } catch {
      setCartsByUser({});
    }
  };

  React.useEffect(() => {
    loadCarts();
  }, []);

  const computeTotal = (items) => (items || []).reduce((sum, it) => sum + ((it.price ?? it.precio ?? 0) * (it.quantity ?? 0)), 0);

  const entries = React.useMemo(() => {
    const pairs = Object.entries(cartsByUser)
      .filter(([username]) => username !== 'admin')
      .map(([username, items]) => ({ username, items, total: computeTotal(items) }));
    const filtered = showOnlyWithItems ? pairs.filter(p => (p.items?.length || 0) > 0) : pairs;
    const sorted = [...filtered];
    if (sortOrder === 'totalAsc') sorted.sort((a, b) => a.total - b.total);
    if (sortOrder === 'totalDesc') sorted.sort((a, b) => b.total - a.total);
    return sorted;
  }, [cartsByUser, showOnlyWithItems, sortOrder]);

  const customers = (users || []).filter(u => u.username !== 'admin');

  const [statusFilter, setStatusFilter] = React.useState('all');
  const filteredOrders = React.useMemo(() => {
    let list = orders || [];
    if (statusFilter !== 'all') list = list.filter(o => o.status === statusFilter);
    return [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [orders, statusFilter]);

  return (
    <div className="container mt-4">
      <h2 style={{color: '#e11d48', fontWeight: 900}}>Panel de Administración</h2>
      <p className="text-muted">Usuario actual: <b>{user?.username}</b> ({user?.role})</p>

      <div className="row">
        <div className="col-12">
          <div className="card mb-4">
            <div className="card-body">
              <h4 className="card-title">Usuarios registrados</h4>
              {customers.length === 0 ? (
                <p className="mb-0">No hay usuarios compradores registrados.</p>
              ) : (
                <ul className="list-group">
                  {customers.map((u) => (
                    <li key={u.username} className="list-group-item d-flex justify-content-between align-items-center">
                      <span><b>{u.username}</b> <span className="badge bg-secondary ms-2">{u.role || 'customer'}</span></span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Carritos por usuario</h4>
              <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="onlyWithItems" checked={showOnlyWithItems} onChange={e => setShowOnlyWithItems(e.target.checked)} />
                  <label className="form-check-label" htmlFor="onlyWithItems">Mostrar solo con productos</label>
                </div>
                <div>
                  <select className="form-select form-select-sm" style={{width: 220}} value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
                    <option value="none">Sin ordenar</option>
                    <option value="totalAsc">Ordenar por total (asc)</option>
                    <option value="totalDesc">Ordenar por total (desc)</option>
                  </select>
                </div>
              </div>
              {entries.length === 0 && <p className="mb-0">No hay carritos registrados aún.</p>}
              {entries.map(({ username, items, total }) => (
                <div key={username} className="mb-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="fw-bold mb-0">{username}</h6>
                  </div>
                  {(!items || items.length === 0) ? (
                    <p className="text-muted">Carrito vacío</p>
                  ) : (
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
                          {items.map((it) => (
                            <tr key={it.id}>
                              <td>{it.name || it.nombre}</td>
                              <td>{it.quantity}</td>
                              <td>${(it.price || it.precio || 0).toLocaleString()}</td>
                              <td>${(((it.price || it.precio || 0) * it.quantity) || 0).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colSpan={3} className="text-end fw-bold">Total</td>
                            <td className="fw-bold">${total.toLocaleString()}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-12 mt-4">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h4 className="card-title mb-0">Pedidos</h4>
                <div style={{minWidth: 240}}>
                  <select className="form-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                    <option value="all">Todos</option>
                    <option value="pendiente">Pendientes</option>
                    <option value="aprobado">Aprobados</option>
                    <option value="rechazado">Rechazados</option>
                  </select>
                </div>
              </div>
              {filteredOrders.length === 0 ? (
                <p className="mb-0">No hay pedidos.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Pedido</th>
                        <th>Usuario</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map(o => (
                        <tr key={o.id}>
                          <td>{new Date(o.createdAt).toLocaleString()}</td>
                          <td>{o.id}</td>
                          <td>{o.username}</td>
                          <td>{o.items.reduce((sum, it) => sum + it.quantity, 0)}</td>
                          <td>${o.total.toLocaleString()}</td>
                          <td>
                            <span className={`badge bg-${o.status==='pendiente'?'warning':o.status==='aprobado'?'success':'danger'}`}>{o.status}</span>
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm" role="group">
                              <button className="btn btn-outline-success" disabled={o.status==='aprobado'} onClick={() => updateOrderStatus(o.id, 'aprobado')}>Aprobar</button>
                              <button className="btn btn-outline-danger" disabled={o.status==='rechazado'} onClick={() => updateOrderStatus(o.id, 'rechazado')}>Rechazar</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
