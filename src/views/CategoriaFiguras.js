
import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api, { getMediaUrl } from '../services/api';
import spidermanImg from '../assets/spiderman.jpg';

export default function CategoriaFiguras() {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [modalProduct, setModalProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const resp = await api.get('/productos/?categoria=figuras');
        if (mounted) {
          const items = resp.data || [];
          // ensure client-side filter as fallback if backend doesn't filter
          setProducts(items.filter(p => (p.categoria || '').toLowerCase() === 'figuras'));
        }
      } catch (e) {
        console.error('Error cargando productos figuras', e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleAddClick = (product) => {
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

  const handleConfirm = () => {
    if (modalProduct) {
      // Use backend product id and backend fields
      addToCart({ id: modalProduct.id, name: modalProduct.nombre ?? modalProduct.name, price: Number(modalProduct.precio ?? modalProduct.price) || 0 }, quantity);
      setAlertMsg(`Se agregó${quantity > 1 ? `n` : ''} ${quantity} unidad${quantity > 1 ? 'es' : ''} de "${modalProduct.nombre ?? modalProduct.name}" al carrito.`);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
    }
    setShowModal(false);
  };

  const handleClose = () => setShowModal(false);

  return (
    <div className="container mt-4">
      <h2 style={{color: '#e11d48', fontWeight: 900, letterSpacing: 2}}>Figuras de acción</h2>
      {showAlert && (
        <div className="alert alert-danger position-fixed top-0 start-50 translate-middle-x mt-3" style={{zIndex: 9999, minWidth: 320, textAlign: 'center'}}>
          {alertMsg}
        </div>
      )}
      <div className="row mt-4">
        {loading ? (
          <div>Cargando productos...</div>
        ) : products.length === 0 ? (
          <p>No hay productos en esta categoría.</p>
        ) : (
          products.map(p => (
            <div className="col-md-6 col-lg-4 mb-4" key={p.id}>
              <div className="card h-100 shadow-sm border-2" style={{borderColor: '#fbbf24', borderRadius: 18}}>
                {/* If backend provides imagen url use it, otherwise fallback to empty box */}
                <div style={{height:260, display:'flex', alignItems:'center', justifyContent:'center', padding:16}}>
                  {p.imagen ? (
                    <img src={getMediaUrl(p.imagen)} alt={p.nombre ?? p.name} style={{maxHeight: '100%', maxWidth: '100%', objectFit:'contain'}} />
                  ) : (
                    <img src={spidermanImg} alt={p.nombre ?? p.name} style={{maxHeight: '100%', maxWidth: '100%', objectFit:'contain'}} />
                  )}
                </div>
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title" style={{fontWeight: 700}}>{p.nombre ?? p.name}</h5>
                  <div className="mb-2">
                    <span style={{fontWeight: 900, color: '#222', fontSize: '1.3rem'}}>${(Number(p.precio ?? p.price) || 0).toLocaleString()}</span>
                  </div>
                  <div className="mb-1" style={{color: '#22c55e', fontWeight: 600}}>Envío Gratis</div>
                  {user?.role !== 'admin' && (
                    <button className="btn w-100 mt-auto" style={{background: '#e11d48', color: '#fff', fontWeight: 700, borderRadius: 12, fontSize: '1.1rem'}} onClick={() => handleAddClick(p)}>Agregar al carrito</button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de confirmación */}
      {showModal && (
        <div className="modal show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Agregar al carrito</h5>
                <button type="button" className="btn-close" onClick={handleClose}></button>
              </div>
              <div className="modal-body">
                <p>
                  ¿Cuántos <b>{modalProduct?.nombre ?? modalProduct?.name}</b> quieres agregar?
                </p>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="form-control"
                  style={{ width: "100px" }}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={handleClose}>
                  Cancelar
                </button>
                <button className="btn btn-primary" onClick={handleConfirm}>
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

