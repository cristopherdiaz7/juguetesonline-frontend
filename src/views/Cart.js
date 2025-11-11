import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { useOrders } from '../context/OrdersContext';
import { useNotifications } from '../context/NotificationsContext';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, total, clearCart } = useCart();
  const { syncPrices } = useCart();

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nombre: '', direccion: '', ciudad: '', telefono: '' });
  const [submitted, setSubmitted] = useState(false);
  const { user } = useAuth();
  const { addOrder } = useOrders();
  const { pushNotification } = useNotifications();

  if (cart.length === 0) {
    return (
      <div className="container mt-4">
        <h2 style={{color: '#e11d48', fontWeight: 900}}>Carrito de compras</h2>
        <p>Tu carrito está vacío.</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 style={{color: '#e11d48', fontWeight: 900}}>Carrito de compras</h2>
      <table className="table align-middle mt-3">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio unitario</th>
            <th>Subtotal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {cart.map(item => (
            <tr key={item.id}>
              <td>{item.name ?? item.nombre}</td>
              <td>
                <input type="number" min="1" value={item.quantity} onChange={e => updateQuantity(item.id, parseInt(e.target.value))} style={{width: 60}} />
              </td>
              <td>${(Number(item.price ?? item.precio) || 0).toLocaleString()}</td>
              <td>${((Number(item.price ?? item.precio) || 0) * item.quantity).toLocaleString()}</td>
              <td>
                <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(item.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="d-flex justify-content-between align-items-center mt-3">
        <h4>Total: ${total.toLocaleString()}</h4>
        <div>
          <button className="btn btn-outline-danger me-2" onClick={clearCart}>Vaciar carrito</button>
          {user?.role === 'admin' || user?.is_staff ? (
            <button className="btn btn-success" disabled title="Los administradores no pueden comprar">Finalizar compra</button>
          ) : (
            <button className="btn btn-success" onClick={async () => {
              // Antes de finalizar, sincronizar precios desde el servidor para reflejar cambios hechos por admin
              try {
                await syncPrices();
              } catch (e) {
                // ignore errors, igualmente abrimos el modal
              }
              setShowModal(true);
            }}>Finalizar compra</button>
          )}
        </div>
      </div>

      {/* Modal de formulario de envío */}
      {showModal && (
        <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Datos de envío</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                {submitted ? (
                  <div className="alert alert-success">gracias por tu compra, pronto te contactaremos.</div>
                ) : (
                  <form onSubmit={async e => {
                    e.preventDefault();
                    // Crear pedido en backend
                    const payload = {
                      items: cart.map(it => ({ id: it.id, cantidad: it.quantity, precio: it.price ?? it.precio ?? 0 })),
                      total,
                      estado: 'pendiente',
                      shipping: { ...form }
                    };
                    try {
                      const resp = await api.post('/pedidos/', payload);
                      setSubmitted(true);
                      // add a local representation so the buyer immediately sees the pending pedido
                      try {
                        const created = resp.data;
                        const local = {
                          id: created.id,
                          username: user?.username,
                          createdAt: created.fecha || new Date().toISOString(),
                          total: created.total || total,
                          status: created.estado || 'pendiente',
                          items: (created.items_out || []).map((it, idx) => ({ id: it.producto_id || idx, name: it.nombre || '', quantity: it.cantidad || 1, price: it.precio || it.price || 0 })),
                          shipping: payload.shipping,
                        };
                        addOrder(local);
                        // Clear the user's cart now that the pedido was created (estado pendiente)
                        // This removes the cart from localStorage as well via CartContext persistence.
                        try { clearCart(); } catch (e) { /* ignore */ }
                      } catch (e) {
                        // ignore mapping errors
                      }
                      // Nota: el carrito se vacía arriba tras la creación exitosa del pedido.
                    } catch (err) {
                      console.error('Error creando pedido', err);
                      // intentar mostrar mensaje del backend si existe
                      const serverMsg = err?.response?.data || err?.message || err;
                      let text = '';
                      try {
                        if (typeof serverMsg === 'string') text = serverMsg;
                        else if (serverMsg && typeof serverMsg === 'object') {
                          // prefer detail, items, or first string value
                          if (serverMsg.detail) text = serverMsg.detail;
                          else if (serverMsg.items) text = serverMsg.items;
                          else {
                            const vals = Object.values(serverMsg).filter(v => typeof v === 'string');
                            if (vals.length > 0) text = vals[0];
                            else text = JSON.stringify(serverMsg);
                          }
                        } else text = String(serverMsg);
                      } catch (e) {
                        text = 'No se pudo crear el pedido. Intente nuevamente.';
                      }

                      // Mostrar una notificación bonita usando NotificationsContext
                      try {
                        const username = user?.username || 'guest';
                        pushNotification(username, `No se pudo crear el pedido: ${text}`, 'danger');
                      } catch (e) {
                        // Fallback: alert if notifications context fails
                        try { alert(`No se pudo crear el pedido: ${text}`); } catch (er) { console.error(er); }
                      }
                    }
                  }}>
                    <div className="mb-3">
                      <label className="form-label">Nombre completo</label>
                      <input type="text" className="form-control" required value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Dirección</label>
                      <input type="text" className="form-control" required value={form.direccion} onChange={e => setForm({ ...form, direccion: e.target.value })} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Ciudad</label>
                      <input type="text" className="form-control" required value={form.ciudad} onChange={e => setForm({ ...form, ciudad: e.target.value })} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Teléfono</label>
                      <input type="tel" className="form-control" required value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} />
                    </div>
                    <button type="submit" className="btn btn-success">Confirmar compra</button>
                  </form>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => { setShowModal(false); setSubmitted(false); }}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
