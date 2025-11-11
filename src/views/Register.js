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

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { register, login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const payload = { username, password };
    const resp = await register(payload);
    if (resp && resp.ok) {
      // Registro exitoso: iniciar sesión automáticamente
      const ll = await login(username, password);
      if (ll && ll.ok) {
        navigate('/');
        return;
      }
      // si el login automático falla, redirigir a login para ingresar manualmente
      navigate('/login');
      return;
    } else {
      const msg = resp?.error?.detail || resp?.error || 'El usuario ya existe';
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    }
  };

  return (
    <div className="container-fluid min-vh-100 p-0" style={{background: '#f8fafc', fontFamily: 'Quicksand, Segoe UI, sans-serif'}}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h2 className="text-center mb-4" style={{color: '#e11d48', fontWeight: 900, letterSpacing: 2}}>Registro</h2>
        <input
          type="text"
          className="form-control"
          placeholder="Usuario"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={inputStyle}
        />
        <div style={{position: 'relative'}}>
          <input
            type={showPassword ? 'text' : 'password'}
            className="form-control"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={inputStyle}
          />
          <button
            type="button"
            onClick={() => setShowPassword(s => !s)}
            style={{
              position: 'absolute',
              right: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'transparent',
              border: 'none',
              padding: 4,
              cursor: 'pointer',
            }}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>
        <button type="submit" className="btn w-100" style={buttonStyle}>Registrarse</button>
        {error && <p className="text-center mt-3" style={{color:'#e11d48', fontWeight:600}}>{error}</p>}
      </form>
    </div>
  );
}
