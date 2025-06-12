import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const formStyle = {
  background: '#fff',
  border: '3px solid #fbbf24',
  borderRadius: '24px',
  boxShadow: '0 2px 12px #fbbf2440',
  padding: '2.5rem 2rem',
  maxWidth: 400,
  margin: '40px auto',
};
const inputStyle = {
  background: '#fef9c3',
  border: '2px solid #fbbf24',
  borderRadius: '20px',
  fontWeight: 500,
  fontSize: '1rem',
  marginBottom: '1rem',
};
const buttonStyle = {
  background: '#fbbf24',
  color: '#fff',
  border: 'none',
  borderRadius: '20px',
  fontWeight: 600,
  letterSpacing: 1,
  fontSize: '1rem',
  padding: '7px 22px',
  marginTop: '0.5rem',
};

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(username, password)) {
      navigate('/');
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="container-fluid min-vh-100 p-0" style={{background: '#f8fafc', fontFamily: 'Quicksand, Segoe UI, sans-serif'}}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h2 className="text-center mb-4" style={{color: '#e11d48', fontWeight: 900, letterSpacing: 2}}>Iniciar sesión</h2>
        <input
          type="text"
          className="form-control"
          placeholder="Usuario"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={inputStyle}
        />
        <input
          type="password"
          className="form-control"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={inputStyle}
        />
        <button type="submit" className="btn w-100" style={buttonStyle}>Ingresar</button>
        {error && <p className="text-center mt-3" style={{color:'#e11d48', fontWeight:600}}>{error}</p>}
      </form>
    </div>
  );
}
