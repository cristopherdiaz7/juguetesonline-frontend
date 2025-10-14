import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import grogu from "../assets/grogu.jpg";
import stitch from "../assets/stitch.jpg";
import mufasa from "../assets/mufasa.jpg";
import harrypotter from "../assets/harrypotter.jpg";
import strangerthings from "../assets/strangerthings.jpg";

const peluches = [
  {
    id: 1,
    nombre: "Grogu",
    precio: 5000,
    imagen: grogu,
    descripcion: "Peluchito de Grogu (Baby Yoda) de Star Wars.",
  },
  {
    id: 2,
    nombre: "Stitch",
    precio: 4500,
    imagen: stitch,
    descripcion: "Peluchito de Stitch de Lilo & Stitch.",
  },
  {
    id: 3,
    nombre: "Mufasa",
    precio: 6000,
    imagen: mufasa,
    descripcion: "Peluchito de Mufasa de El Rey León.",
  },
  {
    id: 4,
    nombre: "Harry Potter",
    precio: 5500,
    imagen: harrypotter,
    descripcion: "Peluchito de Harry Potter.",
  },
  {
    id: 5,
    nombre: "Stranger Things",
    precio: 5200,
    imagen: strangerthings,
    descripcion: "Peluchito de Stranger Things.",
  },
];

function CategoriaPeluches() {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [showAlert, setShowAlert] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = (peluche) => {
    if (!user) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
      return;
    }
    setSelectedProduct(peluche);
    setShowModal(true);
  };

  const handleConfirmAdd = () => {
    addToCart(selectedProduct, quantity);
    setShowModal(false);
    setQuantity(1);
  };

  return (
    <div className="container mt-4">
      <h2>Peluches</h2>
      {showAlert && (
        <div className="alert alert-warning" role="alert">
          Debes iniciar sesión para agregar al carrito.
        </div>
      )}
      <div className="row">
        {peluches.map((peluche) => (
          <div className="col-md-4 mb-4" key={peluche.id}>
            <div className="card h-100">
              <img
                src={peluche.imagen}
                className="card-img-top"
                alt={peluche.nombre}
                style={{ height: "250px", objectFit: "contain", backgroundColor: "#f8f9fa" }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{peluche.nombre}</h5>
                <p className="card-text">{peluche.descripcion}</p>
                <p className="card-text fw-bold">${peluche.precio}</p>
                <button
                  className="btn btn-primary mt-auto"
                  onClick={() => handleAddToCart(peluche)}
                >
                  Agregar al carrito
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de confirmación */}
      {showModal && (
        <div
          className="modal show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Agregar al carrito</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  ¿Cuántos <b>{selectedProduct?.nombre}</b> quieres agregar?
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
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button className="btn btn-primary" onClick={handleConfirmAdd}>
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

export default CategoriaPeluches;
