import { useAuth } from '../context/AuthContext';
import React from 'react';
import { useCart } from '../context/CartContext';
import camioneta4x4Img from '../assets/4x4rojo.jpg';
import spidermantruckImg from '../assets/spidermantruck.jpg';
import spidermaninvolcableImg from '../assets/spidermaninvolcable.jpg';
import autovolveralfuturoImg from '../assets/autovolveralfuturo.jpg';

export default function CategoriaVehiculos() {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertMsg, setAlertMsg] = React.useState('');
  const [showModal, setShowModal] = React.useState(false);
  const [modalProduct, setModalProduct] = React.useState(null);
  const [quantity, setQuantity] = React.useState(1);

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
  const handleAddToCartDirect = (product) => {
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
    addToCart({ ...product }, 1);
    setAlertMsg(`Se agregó 1 unidad de "${product.name}" al carrito.`);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 2000);
  };

  const handleConfirm = () => {
    if (modalProduct) {
      addToCart({ ...modalProduct }, quantity);
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
        {/* Camioneta 4x4 a Control Remoto con Luces Captor Speed Thunder Rojo */}
        <div className="col-md-6 col-lg-4 mb-4">
          <div className="card h-100 shadow-sm border-2" style={{borderColor: '#fbbf24', borderRadius: 18}}>
            <img src={camioneta4x4Img} className="card-img-top p-3" alt="Camioneta 4x4 a Control Remoto con Luces Captor Speed Thunder Rojo" style={{height: 260, objectFit: 'contain'}} />
            <div className="card-body d-flex flex-column">
              <h5 className="card-title" style={{fontWeight: 700}}>Camioneta 4x4 a Control Remoto con Luces Captor Speed Thunder Rojo</h5>
              <div className="mb-2">
                <span style={{fontWeight: 900, color: '#222', fontSize: '1.3rem'}}>$19.000</span>
                <span className="ms-2 text-decoration-line-through" style={{color: '#888', fontSize: '1rem'}}>$26.000</span>
              </div>
              <div className="mb-1" style={{color: '#22c55e', fontWeight: 600}}>Envío Gratis</div>
              {user?.role !== 'admin' && (
                <button className="btn w-100 mt-auto" style={{background: '#e11d48', color: '#fff', fontWeight: 700, borderRadius: 12, fontSize: '1.1rem'}} onClick={() => handleAddClick({id: 'camioneta4x4', name: 'Camioneta 4x4 a Control Remoto con Luces Captor Speed Thunder Rojo', price: 19000})}>Agregar al carrito</button>
              )}
            </div>
          </div>
        </div>
        {/* Camión Spiderman Edición Limitada */}
        <div className="col-md-6 col-lg-4 mb-4">
          <div className="card h-100 shadow-sm border-2" style={{borderColor: '#fbbf24', borderRadius: 18}}>
            <img src={spidermantruckImg} className="card-img-top p-3" alt="Camión Spiderman Edición Limitada" style={{height: 260, objectFit: 'contain'}} />
            <div className="card-body d-flex flex-column">
              <h5 className="card-title" style={{fontWeight: 700}}>Camión Spiderman Edición Limitada</h5>
              <div className="mb-2">
                <span style={{fontWeight: 900, color: '#222', fontSize: '1.3rem'}}>$21.000</span>
              </div>
              <div className="mb-1" style={{color: '#22c55e', fontWeight: 600}}>Envío Gratis</div>
              {user?.role !== 'admin' && (
                <button className="btn w-100 mt-auto" style={{background: '#e11d48', color: '#fff', fontWeight: 700, borderRadius: 12, fontSize: '1.1rem'}} onClick={() => handleAddClick({id: 'spidermantruck', name: 'Camión Spiderman Edición Limitada', price: 21000})}>Agregar al carrito</button>
              )}
            </div>
          </div>
        </div>
        {/* Auto a Fricción Spiderman Color Rojo Negro */}
        <div className="col-md-6 col-lg-4 mb-4">
          <div className="card h-100 shadow-sm border-2" style={{borderColor: '#fbbf24', borderRadius: 18}}>
            <img src={spidermaninvolcableImg} className="card-img-top p-3" alt="Auto a Fricción Spiderman Color Rojo Negro" style={{height: 260, objectFit: 'contain'}} />
            <div className="card-body d-flex flex-column">
              <h5 className="card-title" style={{fontWeight: 700}}>Auto a Fricción Spiderman Color Rojo Negro</h5>
              <div className="mb-2">
                <span style={{fontWeight: 900, color: '#222', fontSize: '1.3rem'}}>$10.900</span>
                <span className="ms-2 text-decoration-line-through" style={{color: '#888', fontSize: '1rem'}}>$13.600</span>
              </div>
              <div className="mb-1" style={{color: '#22c55e', fontWeight: 600}}>Envío Gratis</div>
              {user?.role !== 'admin' && (
                <button className="btn w-100 mt-auto" style={{background: '#e11d48', color: '#fff', fontWeight: 700, borderRadius: 12, fontSize: '1.1rem'}} onClick={() => handleAddClick({id: 'spidermaninvolcable', name: 'Auto a Fricción Spiderman Color Rojo Negro', price: 10900})}>Agregar al carrito</button>
              )}
            </div>
          </div>
        </div>
        {/* Auto Volver Al Futuro Back To The Future III Escala 1:24 */}
        <div className="col-md-6 col-lg-4 mb-4">
          <div className="card h-100 shadow-sm border-2" style={{borderColor: '#fbbf24', borderRadius: 18}}>
            <img src={autovolveralfuturoImg} className="card-img-top p-3" alt="Auto Volver Al Futuro Back To The Future III Escala 1:24" style={{height: 260, objectFit: 'contain'}} />
            <div className="card-body d-flex flex-column">
              <h5 className="card-title" style={{fontWeight: 700}}>Auto Volver Al Futuro Back To The Future III Escala 1:24</h5>
              <div className="mb-2">
                <span style={{fontWeight: 900, color: '#222', fontSize: '1.3rem'}}>$53.900</span>
                <span className="ms-2 text-decoration-line-through" style={{color: '#888', fontSize: '1rem'}}>$71.800</span>
              </div>
              <div className="mb-1" style={{color: '#22c55e', fontWeight: 600}}>Envío Gratis</div>
              {user?.role !== 'admin' && (
                <button className="btn w-100 mt-auto" style={{background: '#e11d48', color: '#fff', fontWeight: 700, borderRadius: 12, fontSize: '1.1rem'}} onClick={() => handleAddClick({id: 'autovolveralfuturo', name: 'Auto Volver Al Futuro Back To The Future III Escala 1:24', price: 53900})}>Agregar al carrito</button>
              )}
            </div>
          </div>
        </div>
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
                <p><strong>{modalProduct?.name}</strong></p>
                <p>Precio unitario: ${modalProduct?.price.toLocaleString()}</p>
                <div className="mb-3">
                  <label htmlFor="cantidad" className="form-label">Cantidad:</label>
                  <input type="number" id="cantidad" className="form-control" min="1" value={quantity} onChange={e => setQuantity(Math.max(1, parseInt(e.target.value)||1))} style={{width: 100}} />
                </div>
                <p className="fw-bold">Total: ${(modalProduct?.price * quantity).toLocaleString()}</p>
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
