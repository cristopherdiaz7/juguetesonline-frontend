import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Logout from './Logout';

const navButtonStyle = {
  fontWeight: 600,
  letterSpacing: 1,
  borderRadius: '20px',
  fontSize: '1rem',
  padding: '7px 22px',
  marginBottom: '6px',
};

function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="container-fluid min-vh-100 p-0" style={{background: '#f8fafc', fontFamily: 'Quicksand, Segoe UI, sans-serif'}}>
      <h1 className="text-center py-4" style={{
        color: '#e11d48',
        fontWeight: 900,
        letterSpacing: 2,
        textShadow: '3px 3px 0 #fbbf24, 6px 6px 0 #fff',
        fontSize: '2.7rem',
        WebkitTextStroke: '1px #fff',
        textTransform: 'uppercase',
        marginBottom: '2rem',
      }}>
        Tienda de juguetes coleccionables
      </h1>
      <div className="container bg-white shadow rounded-4 p-4" style={{border: '3px solid #fbbf24', maxWidth: 950}}>
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
          <div>
            <button className="btn me-2 mb-1" style={{...navButtonStyle, background: '#fbbf24', color: '#fff', border: 'none'}}>Inicio</button>
            <button className="btn me-2 mb-1" style={{...navButtonStyle, background: '#fbbf24', color: '#fff', border: 'none'}}>Productos</button>
          </div>
          <div className="d-flex align-items-center flex-wrap">
            {!user && (
              <>
                <button className="btn me-2 mb-1" style={{...navButtonStyle, background: '#fbbf24', color: '#fff', border: 'none'}} onClick={() => navigate('/register')}>Registrarse</button>
                <button className="btn me-2 mb-1" style={{...navButtonStyle, background: '#fbbf24', color: '#fff', border: 'none'}} onClick={() => navigate('/login')}>Iniciar sesión</button>
              </>
            )}
            {user && (
              <>
                <span className="me-2 mb-1" style={{fontWeight: 600, color: '#e11d48'}}>Hola, {user.username}!</span>
                <Logout />
              </>
            )}
            <input type="text" className="form-control ms-2 mb-1" placeholder="Buscar productos" style={{width: '170px', height: '36px', fontSize: '1rem', background: '#fef9c3', border: '2px solid #fbbf24', borderRadius: '20px', fontWeight: 500}} />
            <button className="btn ms-2 mb-1" style={{...navButtonStyle, background: '#fbbf24', color: '#fff', border: 'none'}}>Buscar</button>
          </div>
        </div>
        <div className="mb-4">
          <div className="rounded-4 p-4 d-flex align-items-center" style={{background: '#fbbf24', minHeight: '110px', border: '2.5px solid #fbbf24', boxShadow: '0 2px 12px #fbbf2440'}}>
            <span style={{fontSize: '2.2rem', marginRight: 18}}>🎉</span>
            <div>
              <strong className="fs-5 text-white">PROMOCIONES</strong>
              <p className="mt-2 text-white-50 mb-0">¡Descubre las mejores ofertas y descuentos en juguetes coleccionables!</p>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <div className="rounded-4 p-4 d-flex align-items-center" style={{background: '#38bdf8', minHeight: '110px', border: '2.5px solid #38bdf8', boxShadow: '0 2px 12px #38bdf840'}}>
            <span style={{fontSize: '2.2rem', marginRight: 18}}>⭐</span>
            <div>
              <strong className="fs-5 text-white">PRODUCTOS DE VENDEDORES DESTACADOS</strong>
              <p className="mt-2 text-white-50 mb-0">Explora los productos más populares de nuestros mejores vendedores.</p>
            </div>
          </div>
        </div>
        <div>
          <div className="rounded-4 p-4 d-flex align-items-center" style={{background: '#a3e635', minHeight: '110px', border: '2.5px solid #a3e635', boxShadow: '0 2px 12px #a3e63540'}}>
            <span style={{fontSize: '2.2rem', marginRight: 18}}>🧩</span>
            <div>
              <strong className="fs-5 text-white">CATEGORÍAS DE PRODUCTOS</strong>
              <p className="mt-2 text-white-50 mb-0">Encuentra juguetes por categoría y colecciona tus favoritos.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
