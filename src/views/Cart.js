import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, total, clearCart } = useCart();

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nombre: '', direccion: '', ciudad: '', telefono: '' });
  const [submitted, setSubmitted] = useState(false);

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
              <td>{item.name}</td>
              <td>
                <input type="number" min="1" value={item.quantity} onChange={e => updateQuantity(item.id, parseInt(e.target.value))} style={{width: 60}} />
              </td>
              <td>${item.price.toLocaleString()}</td>
              <td>${(item.price * item.quantity).toLocaleString()}</td>
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
          <button className="btn btn-success" onClick={() => setShowModal(true)}>Finalizar compra</button>
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
                  <div className="alert alert-success">¡Compra finalizada! Pronto nos contactaremos para coordinar el envío.</div>
                ) : (
                  <form onSubmit={e => { e.preventDefault(); setSubmitted(true); clearCart(); }}>
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
