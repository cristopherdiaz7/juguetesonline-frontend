
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import spidermanImg from '../assets/spiderman.jpg';
import deadpoolImg from '../assets/deadpool.jpg';
import iromanImg from '../assets/iroman.jpg';
import groguImg from '../assets/grogu.jpg';
import batmanImg from '../assets/batman.jpg';
import messiImg from '../assets/messi.jpg';

export default function CategoriaFiguras() {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [modalProduct, setModalProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

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

  const handleConfirm = () => {
    if (modalProduct) {
      addToCart({ ...modalProduct }, quantity);
      setAlertMsg(`Se agregó${quantity > 1 ? `n` : ''} ${quantity} unidad${quantity > 1 ? 'es' : ''} de "${modalProduct.name}" al carrito.`);
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
        {/* Spiderman */}
        <div className="col-md-6 col-lg-4 mb-4">
          <div className="card h-100 shadow-sm border-2" style={{borderColor: '#fbbf24', borderRadius: 18}}>
            <img src={spidermanImg} className="card-img-top p-3" alt="Spiderman Titan Hero Figura De 30 Cm." style={{height: 260, objectFit: 'contain'}} />
            <div className="card-body d-flex flex-column">
              <h5 className="card-title" style={{fontWeight: 700}}>Spiderman Titan Hero Figura De 30 Cm.</h5>
              <div className="mb-2">
                <span style={{fontWeight: 900, color: '#222', fontSize: '1.3rem'}}>$52.000</span>
              </div>
              <div className="mb-1" style={{color: '#22c55e', fontWeight: 600}}>Envío Gratis</div>
              <button className="btn w-100 mt-auto" style={{background: '#e11d48', color: '#fff', fontWeight: 700, borderRadius: 12, fontSize: '1.1rem'}} onClick={() => handleAddClick({id: 'spiderman', name: 'Spiderman Titan Hero Figura De 30 Cm.', price: 52000})}>Agregar al carrito</button>
            </div>
          </div>
        </div>
        {/* Deadpool */}
        <div className="col-md-6 col-lg-4 mb-4">
          <div className="card h-100 shadow-sm border-2" style={{borderColor: '#fbbf24', borderRadius: 18}}>
            <img src={deadpoolImg} className="card-img-top p-3" alt="Figura Articulado De Marvel Deadpool 30 Cm" style={{height: 260, objectFit: 'contain'}} />
            <div className="card-body d-flex flex-column">
              <h5 className="card-title" style={{fontWeight: 700}}>Figura Articulado De Marvel Deadpool 30 Cm</h5>
              <div className="mb-2">
                <span style={{fontWeight: 900, color: '#222', fontSize: '1.3rem'}}>$46.000</span>
              </div>
              <div className="mb-1" style={{color: '#22c55e', fontWeight: 600}}>Envío Gratis</div>
              <button className="btn w-100 mt-auto" style={{background: '#e11d48', color: '#fff', fontWeight: 700, borderRadius: 12, fontSize: '1.1rem'}} onClick={() => handleAddClick({id: 'deadpool', name: 'Figura Articulado De Marvel Deadpool 30 Cm', price: 46000})}>Agregar al carrito</button>
            </div>
          </div>
        </div>
        {/* Iron Man */}
        <div className="col-md-6 col-lg-4 mb-4">
          <div className="card h-100 shadow-sm border-2" style={{borderColor: '#fbbf24', borderRadius: 18}}>
            <img src={iromanImg} className="card-img-top p-3" alt="Figura Ironman Titan Hero" style={{height: 260, objectFit: 'contain'}} />
            <div className="card-body d-flex flex-column">
              <h5 className="card-title" style={{fontWeight: 700}}>Figura Ironman Titan Hero</h5>
              <div className="mb-2">
                <span style={{fontWeight: 900, color: '#222', fontSize: '1.3rem'}}>$51.000</span>
              </div>
              <div className="mb-1" style={{color: '#22c55e', fontWeight: 600}}>Envío Gratis</div>
              <button className="btn w-100 mt-auto" style={{background: '#e11d48', color: '#fff', fontWeight: 700, borderRadius: 12, fontSize: '1.1rem'}} onClick={() => handleAddClick({id: 'iroman', name: 'Figura Ironman Titan Hero', price: 51000})}>Agregar al carrito</button>
            </div>
          </div>
        </div>
        {/* Grogu */}
        <div className="col-md-6 col-lg-4 mb-4">
          <div className="card h-100 shadow-sm border-2" style={{borderColor: '#fbbf24', borderRadius: 18}}>
            <img src={groguImg} className="card-img-top p-3" alt="Figura Grogu Star Wars" style={{height: 260, objectFit: 'contain'}} />
            <div className="card-body d-flex flex-column">
              <h5 className="card-title" style={{fontWeight: 700}}>Figura Grogu Star Wars</h5>
              <div className="mb-2">
                <span style={{fontWeight: 900, color: '#222', fontSize: '1.3rem'}}>$47.000</span>
              </div>
              <div className="mb-1" style={{color: '#22c55e', fontWeight: 600}}>Envío Gratis</div>
              <button className="btn w-100 mt-auto" style={{background: '#e11d48', color: '#fff', fontWeight: 700, borderRadius: 12, fontSize: '1.1rem'}} onClick={() => handleAddClick({id: 'grogu', name: 'Figura Grogu Star Wars', price: 47000})}>Agregar al carrito</button>
            </div>
          </div>
        </div>
        {/* Batman */}
        <div className="col-md-6 col-lg-4 mb-4">
          <div className="card h-100 shadow-sm border-2" style={{borderColor: '#fbbf24', borderRadius: 18}}>
            <img src={batmanImg} className="card-img-top p-3" alt="Figura Batman DC Comics" style={{height: 260, objectFit: 'contain'}} />
            <div className="card-body d-flex flex-column">
              <h5 className="card-title" style={{fontWeight: 700}}>Figura Batman DC Comics</h5>
              <div className="mb-2">
                <span style={{fontWeight: 900, color: '#222', fontSize: '1.3rem'}}>$53.000</span>
              </div>
              <div className="mb-1" style={{color: '#22c55e', fontWeight: 600}}>Envío Gratis</div>
              <button className="btn w-100 mt-auto" style={{background: '#e11d48', color: '#fff', fontWeight: 700, borderRadius: 12, fontSize: '1.1rem'}} onClick={() => handleAddClick({id: 'batman', name: 'Figura Batman DC Comics', price: 53000})}>Agregar al carrito</button>
            </div>
          </div>
        </div>
        {/* Messi */}
        <div className="col-md-6 col-lg-4 mb-4">
          <div className="card h-100 shadow-sm border-2" style={{borderColor: '#fbbf24', borderRadius: 18}}>
            <img src={messiImg} className="card-img-top p-3" alt="Figura Messi Selección Argentina" style={{height: 260, objectFit: 'contain'}} />
            <div className="card-body d-flex flex-column">
              <h5 className="card-title" style={{fontWeight: 700}}>Figura Messi Selección Argentina</h5>
              <div className="mb-2">
                <span style={{fontWeight: 900, color: '#222', fontSize: '1.3rem'}}>$55.000</span>
              </div>
              <div className="mb-1" style={{color: '#22c55e', fontWeight: 600}}>Envío Gratis</div>
              <button className="btn w-100 mt-auto" style={{background: '#e11d48', color: '#fff', fontWeight: 700, borderRadius: 12, fontSize: '1.1rem'}} onClick={() => handleAddClick({id: 'messi', name: 'Figura Messi Selección Argentina', price: 55000})}>Agregar al carrito</button>
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

