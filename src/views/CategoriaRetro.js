import { useAuth } from '../context/AuthContext';
import React from 'react';
import { useCart } from '../context/CartContext';
import tromporetroImg from '../assets/tromporetro.jpg';
import barbieretroImg from '../assets/barbieretro.jpg';
import motoplasticoretroImg from '../assets/motoplasticoretro.jpg';
import soldaditosretroImg from '../assets/soldaditosretro.jpg';
import starwarsImg from '../assets/starwars.jpg';
import pistoladeaguaImg from '../assets/pistoladeagua.jpg';
import './CategoriaRetroModern.css';

export default function CategoriaRetro() {
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
    }
    setShowModal(false);
  };

  const handleClose = () => setShowModal(false);



  return (
    <div className="categoria-retro-bg">
      {showAlert && (
        <div className="alert alert-danger position-fixed top-0 start-50 translate-middle-x mt-3" style={{zIndex: 9999, minWidth: 320, textAlign: 'center'}}>
          {alertMsg}
        </div>
      )}
      <div className="container">
        <h2 className="categoria-retro-title">Juguetes retro o vintage</h2>
        <p className="categoria-retro-desc">Aquí podrás agregar y mostrar los productos de la categoría Juguetes retro o vintage.</p>
        <div className="row mt-4">
          {/* Trompo Retro Edición Limitada */}
          <div className="col-md-6 col-lg-4 mb-4">
            <div className="categoria-retro-card card h-100">
              <img src={tromporetroImg} className="card-img-top p-3" alt="Trompo Retro Edición Limitada" style={{height: 260, objectFit: 'contain'}} />
              <div className="card-body d-flex flex-column">
                <h5 className="categoria-retro-card-title">Trompo Retro Edición Limitada</h5>
                <div className="mb-2 categoria-retro-card-price">$8.500</div>
                <div className="mb-1 categoria-retro-card-envio">Envío Gratis</div>
                <button className="categoria-retro-btn w-100 mt-auto" onClick={() => handleAddToCartDirect({id: 'tromporetro', name: 'Trompo Retro Edición Limitada', price: 8500})}>Agregar al carrito</button>
              </div>
            </div>
          </div>
          {/* Barbie Retro Edición Limitada */}
          <div className="col-md-6 col-lg-4 mb-4">
            <div className="categoria-retro-card card h-100">
              <img src={barbieretroImg} className="card-img-top p-3" alt="Barbie Retro Edición Limitada" style={{height: 260, objectFit: 'contain'}} />
              <div className="card-body d-flex flex-column">
                <h5 className="categoria-retro-card-title">Barbie Retro Edición Limitada</h5>
                <div className="mb-2 categoria-retro-card-price">$9.000</div>
                <div className="mb-1 categoria-retro-card-envio">Envío Gratis</div>
                <button className="categoria-retro-btn w-100 mt-auto" onClick={() => handleAddToCartDirect({id: 'barbieretro', name: 'Barbie Retro Edición Limitada', price: 9000})}>Agregar al carrito</button>
              </div>
            </div>
          </div>
          {/* Moto Plástico Retro */}
          <div className="col-md-6 col-lg-4 mb-4">
            <div className="categoria-retro-card card h-100">
              <img src={motoplasticoretroImg} className="card-img-top p-3" alt="Moto Plástico Retro" style={{height: 260, objectFit: 'contain'}} />
              <div className="card-body d-flex flex-column">
                <h5 className="categoria-retro-card-title">Moto Plástico Retro</h5>
                <div className="mb-2 categoria-retro-card-price">$10.000</div>
                <div className="mb-1 categoria-retro-card-envio">Envío Gratis</div>
                <button className="categoria-retro-btn w-100 mt-auto" onClick={() => handleAddToCartDirect({id: 'motoplasticoretro', name: 'Moto Plástico Retro', price: 10000})}>Agregar al carrito</button>
              </div>
            </div>
          </div>
          {/* Soldaditos Retro */}
          <div className="col-md-6 col-lg-4 mb-4">
            <div className="categoria-retro-card card h-100">
              <img src={soldaditosretroImg} className="card-img-top p-3" alt="Soldaditos Retro" style={{height: 260, objectFit: 'contain'}} />
              <div className="card-body d-flex flex-column">
                <h5 className="categoria-retro-card-title">Soldaditos Retro</h5>
                <div className="mb-2 categoria-retro-card-price">$7.500</div>
                <div className="mb-1 categoria-retro-card-envio">Envío Gratis</div>
                <button className="categoria-retro-btn w-100 mt-auto" onClick={() => handleAddToCartDirect({id: 'soldaditosretro', name: 'Soldaditos Retro', price: 7500})}>Agregar al carrito</button>
              </div>
            </div>
          </div>
          {/* Star Wars Retro */}
          <div className="col-md-6 col-lg-4 mb-4">
            <div className="categoria-retro-card card h-100">
              <img src={starwarsImg} className="card-img-top p-3" alt="Star Wars Retro" style={{height: 260, objectFit: 'contain'}} />
              <div className="card-body d-flex flex-column">
                <h5 className="categoria-retro-card-title">Star Wars Retro</h5>
                <div className="mb-2 categoria-retro-card-price">$11.000</div>
                <div className="mb-1 categoria-retro-card-envio">Envío Gratis</div>
                <button className="categoria-retro-btn w-100 mt-auto" onClick={() => handleAddToCartDirect({id: 'starwars', name: 'Star Wars Retro', price: 11000})}>Agregar al carrito</button>
              </div>
            </div>
          </div>
          {/* Pistola de Agua Retro */}
          <div className="col-md-6 col-lg-4 mb-4">
            <div className="categoria-retro-card card h-100">
              <img src={pistoladeaguaImg} className="card-img-top p-3" alt="Pistola de Agua Retro" style={{height: 260, objectFit: 'contain'}} />
              <div className="card-body d-flex flex-column">
                <h5 className="categoria-retro-card-title">Pistola de Agua Retro</h5>
                <div className="mb-2 categoria-retro-card-price">$6.000</div>
                <div className="mb-1 categoria-retro-card-envio">Envío Gratis</div>
                <button className="categoria-retro-btn w-100 mt-auto" onClick={() => handleAddToCartDirect({id: 'pistoladeagua', name: 'Pistola de Agua Retro', price: 6000})}>Agregar al carrito</button>
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
    </div>
  );
}