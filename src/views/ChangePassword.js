import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function ChangePassword() {
  const { user, changePassword } = useAuth();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // success o danger

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage('Todos los campos son obligatorios.');
      setMessageType('danger');
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('La nueva contraseña y la confirmación no coinciden.');
      setMessageType('danger');
      return;
    }

    if (newPassword === currentPassword) {
      setMessage('La nueva contraseña debe ser diferente a la actual.');
      setMessageType('danger');
      return;
    }

    const result = changePassword(user.username, currentPassword, newPassword);
    setMessage(result.message);
    setMessageType(result.success ? 'success' : 'danger');

    if (result.success) {
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }
  };

  if (!user) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">
          Debes iniciar sesión para cambiar tu contraseña.
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-center mb-4" style={{color: '#e11d48', fontWeight: 900}}>
                Cambiar contraseña
              </h2>
              <p className="text-muted text-center mb-4">
                Usuario: <b>{user.username}</b>
              </p>

              {message && (
                <div className={`alert alert-${messageType}`} role="alert">
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="currentPassword" className="form-label">
                    Contraseña actual
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Ingresa tu contraseña actual"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="newPassword" className="form-label">
                    Nueva contraseña
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Ingresa tu nueva contraseña"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirmar nueva contraseña
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirma tu nueva contraseña"
                  />
                </div>

                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary" style={{background: '#e11d48', border: 'none'}}>
                    Cambiar contraseña
                  </button>
                  <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/')}>
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
