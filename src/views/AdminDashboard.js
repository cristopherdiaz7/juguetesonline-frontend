import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationsContext';
import api from '../services/api';

export default function AdminDashboard() {
  const { users, user } = useAuth();
  const { pushNotification } = useNotifications();
  const [orders, setOrders] = React.useState([]);

  // Estado editable para carritos guardados
  const [cartsByUser, setCartsByUser] = React.useState({});
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
    const sorted = [...pairs];
    if (sortOrder === 'totalAsc') sorted.sort((a, b) => a.total - b.total);
    if (sortOrder === 'totalDesc') sorted.sort((a, b) => b.total - a.total);
    return sorted;
  }, [cartsByUser, sortOrder]);

  const customers = (users || []).filter(u => u.username !== 'admin');

  const [statusFilter, setStatusFilter] = React.useState('all');
  const filteredOrders = React.useMemo(() => {
    let list = orders || [];
    if (statusFilter !== 'all') list = list.filter(o => o.estado === statusFilter);
    // ordenar por fecha (campo 'fecha' devuelto por backend)
    return [...list].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  }, [orders, statusFilter]);

  // Map pedidos by username for quick lookup
  const pedidosByUser = React.useMemo(() => {
    const map = {};
    (orders || []).forEach(o => {
      const uname = o.usuario_nombre || o.usuario || (o.usuario && o.usuario.nombre) || null;
      if (!uname) return;
      map[uname] = map[uname] || [];
      map[uname].push(o);
    });
    return map;
  }, [orders]);

  const [expandedOrders, setExpandedOrders] = React.useState({});
  const toggleOrderExpanded = (orderId) => {
    setExpandedOrders(prev => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const fetchOrders = async () => {
    try {
      const resp = await api.get('/pedidos/');
      setOrders(resp.data || []);
    } catch (e) {
      console.error('Error fetching pedidos', e);
    }
  };

  React.useEffect(() => {
    fetchOrders();
  }, []);

  // Cambiar estado de un pedido (PATCH) y actualizar el listado local
  const changeOrderEstado = async (id, estado) => {
    try {
      const resp = await api.patch(`/pedidos/${id}/`, { estado });
      const updated = resp.data;
      setOrders(prev => prev.map(o => o.id === updated.id ? updated : o));
      try {
  pushNotification(user?.username || 'admin', 'Cambio guardado', 'success');
      } catch (e) {
        // fallback
        alert('Estado actualizado');
      }
      // notify other parts of the app (buyers) that a pedido estado changed so they
      // can sync immediately. Include basic details in the event.detail.
      try {
        window.dispatchEvent(new CustomEvent('pedidoEstadoChanged', { detail: { orderId: updated.id, usuario: updated.usuario_nombre || updated.usuario || null, estado: updated.estado } }));
      } catch (evErr) {
        // nothing to do if dispatch fails
      }
    } catch (e) {
      console.error('Error updating pedido', e);
      try {
        pushNotification(user?.username || 'admin', 'No se pudo actualizar el estado del pedido', 'danger');
      } catch (ex) {
        alert('No se pudo actualizar el estado del pedido');
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2 style={{color: '#e11d48', fontWeight: 900}}>Panel de Administración</h2>
      <p className="text-muted">Usuario actual: <b>{user?.username}</b> ({user?.role})</p>

      {/* Gestión de productos: editar nombre, stock y precio */}
      {user?.role === 'admin' && (
        <div className="card mb-4">
          <div className="card-body">
            <h4 className="card-title">Gestión de productos</h4>
            <ProductsManager />
          </div>
        </div>
      )}

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Pedidos por usuario</h4>
              <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                <div>
                  <select className="form-select form-select-sm" style={{width: 220}} value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
                    <option value="none">Sin ordenar</option>
                    <option value="totalAsc">Ordenar por total (asc)</option>
                    <option value="totalDesc">Ordenar por total (desc)</option>
                  </select>
                </div>
              </div>
              {/* Mostrar sólo pedidos por usuario; ocultar la vista de carritos locales */}
              {Object.keys(pedidosByUser || {}).length === 0 && <p className="mb-0">No hay pedidos registrados aún.</p>}
              {Object.keys(pedidosByUser || {}).map(username => (
                <div key={username} className="mb-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="fw-bold mb-0">{username} <span className="ms-2 badge bg-info">Pedidos: {pedidosByUser[username].length}</span></h6>
                  </div>
                  <div className="mb-2">
                    <small className="text-muted">Pedidos:</small>
                    <div className="accordion mt-1" id={`userOrders${username}`}>
                      {pedidosByUser[username].map(p => (
                        <div className="card mb-2" key={p.id}>
                          <div className="card-header d-flex justify-content-between align-items-center p-2">
                            <div>
                              <strong>Pedido {p.id}</strong>
                              <div className="small text-muted">{new Date(p.fecha).toLocaleString()}</div>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                              <span className={`badge bg-${p.estado==='pendiente'?'warning':p.estado==='aprobado'?'success':'danger'}`}>{p.estado}</span>
                              <strong className="ms-2">${(p.total || 0).toLocaleString()}</strong>
                              <button className="btn btn-sm btn-outline-primary ms-2" onClick={() => toggleOrderExpanded(p.id)} aria-expanded={!!expandedOrders[p.id]}>
                                {expandedOrders[p.id] ? 'Ocultar' : 'Ver'}
                              </button>
                            </div>
                          </div>
                          {expandedOrders[p.id] && (
                            <div className="card-body p-2">
                              <div className="table-responsive">
                                <table className="table table-sm mb-0">
                                  <thead>
                                    <tr>
                                      <th>Producto</th>
                                      <th>Cantidad</th>
                                      <th>Precio</th>
                                      <th>Subtotal</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {(() => {
                                      const items = Array.isArray(p.items_out) ? p.items_out : (Array.isArray(p.items) ? p.items : []);
                                      if (!items || items.length === 0) {
                                        return (
                                          <tr>
                                            <td colSpan={4} className="text-muted">Sin detalle de ítems</td>
                                          </tr>
                                        );
                                      }
                                      return items.map((it, idx) => {
                                        const name = it.nombre || it.name || it.producto_nombre || (it.producto && (it.producto.nombre || it.producto.name)) || `#${it.producto || ''}`;
                                        const qty = it.cantidad ?? it.quantity ?? it.qty ?? 0;
                                        const price = it.precio ?? it.price ?? it.unit_price ?? 0;
                                        const subtotal = (price || 0) * (qty || 0);
                                        return (
                                          <tr key={idx}>
                                            <td>{name || '—'}</td>
                                            <td>{qty || 0}</td>
                                            <td>${(price || 0).toLocaleString()}</td>
                                            <td>${subtotal.toLocaleString()}</td>
                                          </tr>
                                        );
                                      });
                                    })()}
                                  </tbody>
                                </table>
                              </div>
                              <div className="text-end mt-2"><strong>Total: ${(p.total || 0).toLocaleString()}</strong></div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
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
                          <td>{new Date(o.fecha).toLocaleString()}</td>
                          <td>{o.id}</td>
                          <td>{o.usuario_nombre || o.usuario}</td>
                          <td>{Array.isArray(o.items_out) ? o.items_out.reduce((sum, it) => sum + (it.cantidad || it.quantity || 0), 0) : 'N/A'}</td>
                          <td>${(o.total || 0).toLocaleString()}</td>
                          <td>
                            <span className={`badge bg-${o.estado==='pendiente'?'warning':o.estado==='aprobado'?'success':'danger'}`}>{o.estado}</span>
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm" role="group">
                              <button className="btn btn-outline-success" disabled={o.estado==='aprobado'} onClick={() => changeOrderEstado(o.id, 'aprobado')}>Aprobar</button>
                              <button className="btn btn-outline-danger" disabled={o.estado==='rechazado'} onClick={() => changeOrderEstado(o.id, 'rechazado')}>Rechazar</button>
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

function ProductsManager() {
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [usersMap, setUsersMap] = React.useState({});
  const [sellerFilter, setSellerFilter] = React.useState('all');
  const [categoryFilter, setCategoryFilter] = React.useState('all');
  const { user } = useAuth();
  const { pushNotification } = useNotifications();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const resp = await api.get('/productos/');
      // normalize numeric fields coming from backend and ensure consistent shapes
      const normalized = (resp.data || []).map(p => ({
        ...p,
        nombre: p.nombre || p.name || '',
        precio: p.precio !== undefined && p.precio !== null ? parseFloat(p.precio) : 0,
        stock: p.stock !== undefined && p.stock !== null ? parseInt(p.stock, 10) : 0,
        categoria: p.categoria || p.category || 'figuras',
      }));
      setProducts(normalized);
      // fetch users to map vendedor ids to nombres
      try {
        const uresp = await api.get('/usuarios/');
        const umap = {};
        (uresp.data || []).forEach(u => { umap[u.id] = u.username || u.nombre || u.email || u.correo; });
        setUsersMap(umap);
      } catch (err) {
        // ignore
      }
    } catch (e) {
      console.error('Error fetching products', e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => { fetchProducts(); }, []);

  const handleChange = (id, field, value) => {
    // normalize numeric fields
    let nextValue = value;
    if (field === 'stock') {
      nextValue = value === '' ? '' : parseInt(value, 10);
      if (Number.isNaN(nextValue)) nextValue = 0;
    }
    if (field === 'precio') {
      // accept comma as decimal separator
      const str = String(value).replace(/\./g, '').replace(/,/g, '.');
      const num = parseFloat(str);
      nextValue = Number.isNaN(num) ? value : num;
    }
    setProducts(prev => prev.map(p => p.id === id ? { ...p, [field]: nextValue } : p));
  };

  const handleSave = async (p) => {
    try {
      const precio = typeof p.precio === 'number' ? p.precio : parseFloat(String(p.precio).replace(/\./g, '').replace(/,/g, '.'));
      const stock = typeof p.stock === 'number' ? p.stock : parseInt(p.stock, 10) || 0;
      const payload = { nombre: p.nombre, precio: isNaN(precio) ? 0 : precio, stock: stock, categoria: p.categoria };
  // use PATCH to do a partial update and avoid server validation errors for required fields
      const resp = await api.patch(`/productos/${p.id}/`, payload);
      // update only the changed product in local state using server response
      const updated = resp.data;
      setProducts(prev => prev.map(item => item.id === updated.id ? ({ ...item, ...updated, precio: updated.precio !== undefined ? parseFloat(updated.precio) : item.precio, stock: updated.stock !== undefined ? parseInt(updated.stock,10) : item.stock }) : item));
      // mostrar notificación de éxito
      try {
        pushNotification(user?.username || 'admin', 'Cambio realizado con exito', 'success');
      } catch (e) {
        // fallback a alert si algo falla
        alert('Cambio realizado con exito');
      }
    } catch (e) {
      console.error('Error updating product:', e);
      const serverMsg = e?.response?.data ? JSON.stringify(e.response.data) : e.message || String(e);
      try {
        pushNotification(user?.username || 'admin', 'Error al actualizar producto: ' + serverMsg, 'danger');
      } catch (ex) {
        alert('Error al actualizar producto: ' + serverMsg);
      }
    }
  };

  if (loading) return <div>Cargando productos...</div>;

  const sellers = Array.from(new Set(products.map(p => p.usuario))).filter(Boolean);
  const categories = Array.from(new Set(products.map(p => p.categoria))).filter(Boolean);

  const visibleProducts = products
    .filter(p => (sellerFilter === 'all' ? true : String(p.usuario) === String(sellerFilter)))
    .filter(p => (categoryFilter === 'all' ? true : p.categoria === categoryFilter));

  return (
    <div>
      {products.length === 0 ? <p>No hay productos.</p> : (
        <div>
          <div className="mb-3 d-flex align-items-center gap-3">
            <div>
              <label className="form-label mb-0">Filtrar por vendedor</label>
              <select className="form-select" value={sellerFilter} onChange={e => setSellerFilter(e.target.value)}>
                <option value="all">Todos</option>
                {sellers.map(sid => (
                  <option key={sid} value={sid}>{usersMap[sid] || sid}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label mb-0">Filtrar por categoría</label>
              <select className="form-select" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
                <option value="all">Todas</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table">
              <thead>
                  <tr><th>Vendedor</th><th>Categoría</th><th>Nombre</th><th>Stock</th><th>Precio</th><th>Acciones</th></tr>
                </thead>
              <tbody>
                {visibleProducts.map(p => (
                  <tr key={p.id}>
                    <td>{usersMap[p.usuario] || p.usuario}</td>
                      <td>{p.categoria}</td>
                      <td><input className="form-control" value={p.nombre} onChange={e => handleChange(p.id, 'nombre', e.target.value)} /></td>
                      <td><input className="form-control" type="number" min="0" value={p.stock} onChange={e => handleChange(p.id, 'stock', e.target.value)} /></td>
                      <td><input className="form-control" type="number" step="0.01" min="0" value={p.precio} onChange={e => handleChange(p.id, 'precio', e.target.value)} /></td>
                    <td><button className="btn btn-sm btn-primary" onClick={() => handleSave(p)}>Guardar</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

async function changeOrderEstadoApi(id, estado) {
  try {
    const resp = await api.patch(`/pedidos/${id}/`, { estado });
    return resp.data;
  } catch (e) {
    throw e;
  }
}

// Add function inside module scope to allow changing estado from component
function changeOrderEstadoWrapper(id, estado, setOrders) {
  changeOrderEstadoApi(id, estado).then(updated => {
    setOrders(prev => prev.map(o => o.id === updated.id ? updated : o));
    alert('Estado actualizado');
  }).catch(e => {
    console.error('Error updating pedido', e);
    alert('No se pudo actualizar el estado del pedido');
  });
}
