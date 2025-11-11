import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api, { getMediaUrl } from '../services/api';
import groguImg from '../assets/grogu.jpg';

function CategoriaPeluches() {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [showAlert, setShowAlert] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const resp = await api.get('/productos/?categoria=peluches');
        if (mounted) {
          const items = resp.data || [];
          setProducts(items.filter(p => (p.categoria || '').toLowerCase() === 'peluches'));
        }
      } catch (e) {
        console.error('Error cargando peluches', e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleAddToCart = (peluche) => {
    if (!user) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
      return;
    }
    if (user.role === 'admin') {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
      return;
    }
    setSelectedProduct(peluche);
    setShowModal(true);
  };

  const handleConfirmAdd = () => {
    if (!selectedProduct) return;
    const normalized = {
      id: selectedProduct.id,
      name: selectedProduct.nombre ?? selectedProduct.name,
      price: Number(selectedProduct.precio ?? selectedProduct.price) || 0,
    };
    addToCart(normalized, quantity);
    setShowModal(false);
    setQuantity(1);
  };

  return (
    <div className="container mt-4">
      <h2>Peluches</h2>
      {showAlert && (
        <div className="alert alert-warning" role="alert">
          {user?.role === 'admin' ? 'Los administradores no pueden comprar productos.' : 'Debes iniciar sesión para agregar al carrito.'}
        </div>
      )}
      <div className="row">
        {loading ? (
          <div>Cargando productos...</div>
        ) : products.length === 0 ? (
          <p>No hay productos en esta categoría.</p>
        ) : (
          products.map(peluche => (
            <div className="col-md-4 mb-4" key={peluche.id}>
              <div className="card h-100">
                <div style={{ height: 250, objectFit: 'contain', backgroundColor: '#f8f9fa', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  {peluche.imagen ? (
                    <img src={getMediaUrl(peluche.imagen)} alt={peluche.nombre ?? peluche.name} style={{maxHeight:'100%', maxWidth:'100%', objectFit:'contain'}} />
                  ) : (
                    <img src={groguImg} alt={peluche.nombre ?? peluche.name} style={{maxHeight:'100%', maxWidth:'100%', objectFit:'contain'}} />
                  )}
                </div>
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{peluche.nombre ?? peluche.name}</h5>
                  {peluche.descripcion && <p className="card-text">{peluche.descripcion}</p>}
                  <p className="card-text fw-bold">${(Number(peluche.precio ?? peluche.price) || 0).toLocaleString()}</p>
                  {user?.role !== 'admin' && (
                    <button className="btn btn-primary mt-auto" onClick={() => handleAddToCart(peluche)}>Agregar al carrito</button>
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
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>
                  ¿Cuántos <b>{selectedProduct?.nombre ?? selectedProduct?.name}</b> quieres agregar?
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
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button className="btn btn-primary" onClick={handleConfirmAdd}>Confirmar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoriaPeluches;
