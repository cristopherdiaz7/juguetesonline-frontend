import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api, { getMediaUrl } from '../services/api';
import camionetaFallback from '../assets/4x4rojo.jpg';

export default function CategoriaVehiculos() {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalProduct, setModalProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const resp = await api.get('/productos/?categoria=vehiculos');
        if (mounted) {
          const items = resp.data || [];
          setProducts(items.filter(p => (p.categoria || '').toLowerCase() === 'vehiculos'));
        }
      } catch (e) {
        console.error('Error cargando vehiculos', e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const openAddModal = (product) => {
    if (!user) {
      setAlertMsg('Debes registrarte o iniciar sesión.');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
      return;
    }
    if (user.role === 'admin') {
      setAlertMsg('Los administradores no pueden comprar productos.');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
      return;
    }
    setModalProduct(product);
    setQuantity(1);
    setShowModal(true);
  };

  const handleQuickAdd = (product) => {
    if (!user) {
      setAlertMsg('Debes registrarte o iniciar sesión.');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
      return;
    }
    if (user.role === 'admin') {
      setAlertMsg('Los administradores no pueden comprar productos.');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
      return;
    }
    const normalized = {
      id: product.id,
      name: product.nombre ?? product.name,
      price: Number(product.precio ?? product.price) || 0,
    };
    addToCart(normalized, 1);
    setAlertMsg(`Se agregó 1 unidad de "${normalized.name}" al carrito.`);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 2000);
  };

  const handleConfirm = () => {
    if (modalProduct) {
      const normalized = {
        id: modalProduct.id,
        name: modalProduct.nombre ?? modalProduct.name,
        price: Number(modalProduct.precio ?? modalProduct.price) || 0,
      };
      addToCart(normalized, quantity);
    }
    setShowModal(false);
  };

  const handleClose = () => setShowModal(false);

  return (
    <div className="container mt-4">
      {showAlert && (
        <div className="alert alert-danger position-fixed top-0 start-50 translate-middle-x mt-3" style={{zIndex: 9999, minWidth: 320, textAlign: 'center'}}>
          {alertMsg}
        </div>
      )}
      <h2 style={{color: '#e11d48', fontWeight: 900, letterSpacing: 2}}>Vehículos coleccionables</h2>
      <p>Aquí podrás agregar y mostrar los productos de la categoría Vehículos coleccionables.</p>
      <div className="row mt-4">
        {loading ? (
          <div>Cargando productos...</div>
        ) : products.length === 0 ? (
          <p>No hay productos en esta categoría.</p>
        ) : (
          products.map((p) => (
            <div className="col-md-6 col-lg-4 mb-4" key={p.id}>
              <div className="card h-100 shadow-sm border-2" style={{borderColor: '#fbbf24', borderRadius: 18}}>
                {p.imagen ? (
                  <img src={getMediaUrl(p.imagen)} className="card-img-top p-3" alt={p.nombre ?? p.name} style={{height: 260, objectFit: 'contain'}} />
                ) : (
                  <img src={camionetaFallback} className="card-img-top p-3" alt={p.nombre ?? p.name} style={{height: 260, objectFit: 'contain'}} />
                )}
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title" style={{fontWeight: 700}}>{p.nombre ?? p.name}</h5>
                  <div className="mb-2">
                    <span style={{fontWeight: 900, color: '#222', fontSize: '1.3rem'}}>${(Number(p.precio ?? p.price) || 0).toLocaleString()}</span>
                  </div>
                  <div className="mb-1" style={{color: '#22c55e', fontWeight: 600}}>Envío Gratis</div>
                  {user?.role !== 'admin' && (
                    <>
                      <button className="btn w-100 mt-auto mb-2" style={{background: '#e11d48', color: '#fff', fontWeight: 700, borderRadius: 12, fontSize: '1.1rem'}} onClick={() => openAddModal(p)}>Agregar al carrito</button>
                      <button className="btn btn-outline-secondary w-100" onClick={() => handleQuickAdd(p)}>Agregar 1 unidad</button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Modal Bootstrap */}
      {showModal && (
        <div className="modal fade show" style={{display: 'block'}} tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Agregar al carrito</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={handleClose}></button>
              </div>
              <div className="modal-body">
                <p><strong>{modalProduct?.nombre ?? modalProduct?.name}</strong></p>
                <p>Precio unitario: ${(Number(modalProduct?.precio ?? modalProduct?.price) || 0).toLocaleString()}</p>
                <div className="mb-3">
                  <label htmlFor="cantidad" className="form-label">Cantidad:</label>
                  <input type="number" id="cantidad" className="form-control" min="1" value={quantity} onChange={e => setQuantity(Math.max(1, parseInt(e.target.value)||1))} style={{width: 100}} />
                </div>
                <p className="fw-bold">Total: ${( (Number(modalProduct?.precio ?? modalProduct?.price) || 0) * quantity).toLocaleString()}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleClose}>Cancelar</button>
                <button type="button" className="btn btn-primary" onClick={handleConfirm}>Agregar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
