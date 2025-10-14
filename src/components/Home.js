import React from 'react';
import { FaHome, FaShoppingCart, FaUser, FaSignOutAlt, FaUserPlus, FaSignInAlt, FaCubes, FaHeart, FaImage, FaGamepad, FaCar } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './HomeKids.css';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Logout from './Logout';
import { useCart } from '../context/CartContext';

function Home() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  return (
    <div className="home-kids-bg" style={{ backgroundImage: `url(${require('../assets/fondojuguetes.png')})`, backgroundSize: 'cover' }}>
      {/* Barra superior */}
      <div className="container-fluid py-3 px-4 d-flex justify-content-between align-items-center" style={{background: 'rgba(255,255,255,0.0)'}}>
        <div className="d-flex align-items-center gap-3">
          <h2 className="home-kids-title" style={{fontSize: '2.1rem', color: '#2979ff', marginBottom: 0, fontWeight: 700}}><FaHome style={{marginRight: 8}}/>Inicio</h2>
          {user && (
            <button className="home-kids-btn" style={{background: '#ffb300', color: '#fff', fontWeight: 700}} onClick={() => navigate('/cart')}><FaShoppingCart style={{marginRight: 6}}/>Carrito ({cart.reduce((sum, item) => sum + item.quantity, 0)})</button>
          )}
        </div>
        <div className="d-flex align-items-center gap-3">
          {!user && (
            <>
              <button className="home-kids-btn" style={{background: '#2979ff', color: '#fff', fontWeight: 700}} onClick={() => navigate('/register')}><FaUserPlus style={{marginRight: 6}}/>Registrarse</button>
              <button className="home-kids-btn" style={{background: '#2979ff', color: '#fff', fontWeight: 700}} onClick={() => navigate('/login')}><FaSignInAlt style={{marginRight: 6}}/>Iniciar sesión</button>
            </>
          )}
          {user && (
            <>
              <span className="home-kids-section-title" style={{color: '#2979ff', textShadow: 'none', fontWeight: 700}}><FaUser style={{marginRight: 6}}/>Hola, {user.username}!</span>
              <button className="home-kids-btn" style={{background: '#ffb300', color: '#2979ff', fontWeight: 700}} onClick={() => { logout(); navigate('/login'); }}><FaSignOutAlt style={{marginRight: 6}}/>Cerrar sesión</button>
            </>
          )}
        </div>
      </div>
      {/* Logo flotante */}
      <div className="d-flex justify-content-center align-items-center" style={{margin: '32px 0 40px 0'}}>
        <img src={require('../assets/logoprincipal.png')} alt="Logo principal" style={{maxWidth: 600, width: '100%', height: 'auto', position: 'relative', top: '-20px'}} />
      </div>
      {/* Categorías de juguetes */}
      <div className="container">
  <div className="home-kids-section categorias">
          <div>
            <div className="home-kids-section-title" style={{color: '#2979ff', textShadow: 'none', fontWeight: 700, fontSize: '1.4rem'}}><FaCubes style={{marginRight: 8}}/>Categorías de juguetes</div>
            <div className="d-flex flex-wrap gap-3 mt-2">
              <button className="home-kids-btn" style={{background: '#b2a4ff', color: '#2979ff', fontWeight: 700}} onClick={() => navigate('/categoria/figuras')}><FaCubes style={{marginRight: 6}}/>Figuras de acción</button>
              <button className="home-kids-btn" style={{background: '#ffd6e0', color: '#2979ff', fontWeight: 700}} onClick={() => navigate('/categoria/peluches')}><FaHeart style={{marginRight: 6}}/>Peluches</button>
              <button className="home-kids-btn" style={{background: '#f9f871', color: '#2979ff', fontWeight: 700}} onClick={() => navigate('/categoria/posters')}><FaImage style={{marginRight: 6}}/>Pósters</button>
              <button className="home-kids-btn" style={{background: '#a0e7e5', color: '#2979ff', fontWeight: 700}} onClick={() => navigate('/categoria/retro')}><FaGamepad style={{marginRight: 6}}/>Retro</button>
              <button className="home-kids-btn" style={{background: '#ffb300', color: '#2979ff', fontWeight: 700}} onClick={() => navigate('/categoria/vehiculos')}><FaCar style={{marginRight: 6}}/>Vehículos</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
