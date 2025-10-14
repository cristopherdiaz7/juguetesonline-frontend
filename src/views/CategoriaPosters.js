import { useAuth } from '../context/AuthContext';
import React from 'react';
import { useCart } from '../context/CartContext';
import posterbatmanImg from '../assets/posterbatman.jpg';
import strangerthingsImg from '../assets/strangerthings.jpg';
import venomImg from '../assets/venom.jpg';
import harrypotterImg from '../assets/harrypotter.jpg';
import narutoImg from '../assets/naruto.jpg';
import hulkcomicsImg from '../assets/hulkcomics.jpg';

export default function CategoriaPosters() {
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
    setModalProduct(product);
    setQuantity(1);
    setShowModal(true);
  };

  const handleConfirm = () => {
    if (modalProduct) {
      addToCart({ ...modalProduct }, quantity);
      setAlertMsg(`Se agregó${quantity > 1 ? 'n' : ''} ${quantity} unidad${quantity > 1 ? 'es' : ''} de "${modalProduct.name}" al carrito.`);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
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
      <h2 style={{color: '#e11d48', fontWeight: 900, letterSpacing: 2}}>Pósters Coleccionables</h2>
      <p>Aquí podrás agregar y mostrar los productos de la categoría Pósters Coleccionables.</p>
      <div className="row mt-4">
        {/* Poster Batman Edición Limitada */}
        <div className="col-md-6 col-lg-4 mb-4">
          <div className="card h-100 shadow-sm border-2" style={{borderColor: '#fbbf24', borderRadius: 18}}>
            <img src={posterbatmanImg} className="card-img-top p-3" alt="Póster Batman Edición Limitada" style={{height: 260, objectFit: 'contain'}} />
            <div className="card-body d-flex flex-column">
              <h5 className="card-title" style={{fontWeight: 700}}>Póster Batman Edición Limitada</h5>
              <div className="mb-2">
                <span style={{fontWeight: 900, color: '#222', fontSize: '1.3rem'}}>$12.000</span>
              </div>
              <div className="mb-1" style={{color: '#22c55e', fontWeight: 600}}>Envío Gratis</div>
              <button className="btn w-100 mt-auto" style={{background: '#e11d48', color: '#fff', fontWeight: 700, borderRadius: 12, fontSize: '1.1rem'}} onClick={() => handleAddToCartDirect({id: 'posterbatman', name: 'Póster Batman Edición Limitada', price: 12000})}>Agregar al carrito</button>
            </div>
          </div>
        </div>
        {/* Poster Stranger Things Edición Limitada */}
        <div className="col-md-6 col-lg-4 mb-4">
          <div className="card h-100 shadow-sm border-2" style={{borderColor: '#fbbf24', borderRadius: 18}}>
            <img src={strangerthingsImg} className="card-img-top p-3" alt="Póster Stranger Things Edición Limitada" style={{height: 260, objectFit: 'contain'}} />
            <div className="card-body d-flex flex-column">
              <h5 className="card-title" style={{fontWeight: 700}}>Póster Stranger Things Edición Limitada</h5>
              <div className="mb-2">
                <span style={{fontWeight: 900, color: '#222', fontSize: '1.3rem'}}>$13.000</span>
              </div>
              <div className="mb-1" style={{color: '#22c55e', fontWeight: 600}}>Envío Gratis</div>
              <button className="btn w-100 mt-auto" style={{background: '#e11d48', color: '#fff', fontWeight: 700, borderRadius: 12, fontSize: '1.1rem'}} onClick={() => handleAddToCartDirect({id: 'strangerthings', name: 'Póster Stranger Things Edición Limitada', price: 13000})}>Agregar al carrito</button>
            </div>
          </div>
        </div>
        {/* Poster Venom Edición Limitada */}
        <div className="col-md-6 col-lg-4 mb-4">
          <div className="card h-100 shadow-sm border-2" style={{borderColor: '#fbbf24', borderRadius: 18}}>
            <img src={venomImg} className="card-img-top p-3" alt="Póster Venom Edición Limitada" style={{height: 260, objectFit: 'contain'}} />
            <div className="card-body d-flex flex-column">
              <h5 className="card-title" style={{fontWeight: 700}}>Póster Venom Edición Limitada</h5>
              <div className="mb-2">
                <span style={{fontWeight: 900, color: '#222', fontSize: '1.3rem'}}>$14.000</span>
              </div>
              <div className="mb-1" style={{color: '#22c55e', fontWeight: 600}}>Envío Gratis</div>
              <button className="btn w-100 mt-auto" style={{background: '#e11d48', color: '#fff', fontWeight: 700, borderRadius: 12, fontSize: '1.1rem'}} onClick={() => handleAddToCartDirect({id: 'venom', name: 'Póster Venom Edición Limitada', price: 14000})}>Agregar al carrito</button>
            </div>
          </div>
        </div>
        {/* Poster Harry Potter Edición Limitada */}
        <div className="col-md-6 col-lg-4 mb-4">
          <div className="card h-100 shadow-sm border-2" style={{borderColor: '#fbbf24', borderRadius: 18}}>
            <img src={harrypotterImg} className="card-img-top p-3" alt="Póster Harry Potter Edición Limitada" style={{height: 260, objectFit: 'contain'}} />
            <div className="card-body d-flex flex-column">
              <h5 className="card-title" style={{fontWeight: 700}}>Póster Harry Potter Edición Limitada</h5>
              <div className="mb-2">
                <span style={{fontWeight: 900, color: '#222', fontSize: '1.3rem'}}>$15.000</span>
              </div>
              <div className="mb-1" style={{color: '#22c55e', fontWeight: 600}}>Envío Gratis</div>
              <button className="btn w-100 mt-auto" style={{background: '#e11d48', color: '#fff', fontWeight: 700, borderRadius: 12, fontSize: '1.1rem'}} onClick={() => handleAddToCartDirect({id: 'harrypotter', name: 'Póster Harry Potter Edición Limitada', price: 15000})}>Agregar al carrito</button>
            </div>
          </div>
        </div>
        {/* Poster Naruto Edición Limitada */}
        <div className="col-md-6 col-lg-4 mb-4">
          <div className="card h-100 shadow-sm border-2" style={{borderColor: '#fbbf24', borderRadius: 18}}>
            <img src={narutoImg} className="card-img-top p-3" alt="Póster Naruto Edición Limitada" style={{height: 260, objectFit: 'contain'}} />
            <div className="card-body d-flex flex-column">
              <h5 className="card-title" style={{fontWeight: 700}}>Póster Naruto Edición Limitada</h5>
              <div className="mb-2">
                <span style={{fontWeight: 900, color: '#222', fontSize: '1.3rem'}}>$16.000</span>
              </div>
              <div className="mb-1" style={{color: '#22c55e', fontWeight: 600}}>Envío Gratis</div>
              <button className="btn w-100 mt-auto" style={{background: '#e11d48', color: '#fff', fontWeight: 700, borderRadius: 12, fontSize: '1.1rem'}} onClick={() => handleAddToCartDirect({id: 'naruto', name: 'Póster Naruto Edición Limitada', price: 16000})}>Agregar al carrito</button>
            </div>
          </div>
        </div>
        {/* Poster Hulk Comics Edición Limitada */}
        <div className="col-md-6 col-lg-4 mb-4">
          <div className="card h-100 shadow-sm border-2" style={{borderColor: '#fbbf24', borderRadius: 18}}>
            <img src={hulkcomicsImg} className="card-img-top p-3" alt="Póster Hulk Comics Edición Limitada" style={{height: 260, objectFit: 'contain'}} />
            <div className="card-body d-flex flex-column">
              <h5 className="card-title" style={{fontWeight: 700}}>Póster Hulk Comics Edición Limitada</h5>
              <div className="mb-2">
                <span style={{fontWeight: 900, color: '#222', fontSize: '1.3rem'}}>$17.000</span>
              </div>
              <div className="mb-1" style={{color: '#22c55e', fontWeight: 600}}>Envío Gratis</div>
              <button className="btn w-100 mt-auto" style={{background: '#e11d48', color: '#fff', fontWeight: 700, borderRadius: 12, fontSize: '1.1rem'}} onClick={() => handleAddToCartDirect({id: 'hulkcomics', name: 'Póster Hulk Comics Edición Limitada', price: 17000})}>Agregar al carrito</button>
            </div>
          </div>
        </div>
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
                  ¿Cuántos <b>{modalProduct?.name}</b> quieres agregar?
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