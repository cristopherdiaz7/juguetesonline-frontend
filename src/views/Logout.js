import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <button onClick={handleLogout} className="btn" style={{background: '#e11d48', color: '#fff', border: 'none', borderRadius: '20px', fontWeight: 600, letterSpacing: 1, fontSize: '1rem', padding: '7px 22px', marginBottom: '6px'}}>
      Cerrar sesión
    </button>
  );
}
