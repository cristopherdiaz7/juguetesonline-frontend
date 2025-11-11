import React, { useEffect, useState, useRef } from 'react';
import api from '../services/api';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const mounted = useRef(true);

  const fetchUsuarios = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await api.get('/user/usuarios/');
      if (mounted.current) setUsuarios(resp.data || []);
    } catch (err) {
      console.error('Error fetching usuarios', err);
      if (mounted.current) setError(err.response?.data || err.message);
    } finally {
      if (mounted.current) setLoading(false);
    }
  };

  useEffect(() => {
    mounted.current = true;
    fetchUsuarios();
    return () => { mounted.current = false; };
  }, []);

  if (loading) return (
    <div className="container mt-4">
      <div className="d-flex align-items-center">
        <div className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></div>
        <strong>Cargando usuarios...</strong>
      </div>
    </div>
  );

  if (error) return (
    <div className="container mt-4">
      <div className="alert alert-danger" role="alert">
        <div className="fw-bold">Error al obtener usuarios</div>
        <div className="small mt-1">{typeof error === 'string' ? error : (error.detail || JSON.stringify(error))}</div>
        <div className="mt-2">
          <button className="btn btn-secondary btn-sm" onClick={fetchUsuarios}>Reintentar</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mt-4">
      <h3>Listado de usuarios</h3>
      {usuarios.length === 0 ? (
        <div>
          <p>No hay usuarios para mostrar.</p>
          <button className="btn btn-outline-secondary btn-sm" onClick={fetchUsuarios}>Reintentar</button>
        </div>
      ) : (
        <ul className="list-group">
          {usuarios.map((u) => (
            <li key={u.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{u.username}</strong>
                {u.email && <div className="text-muted small">{u.email}</div>}
              </div>
              <span className="badge bg-primary rounded-pill">{u.tipo || '—'}</span>
            </li>
          ))}
        </ul>
      )}
        {/* Removed dev-only Authorization header display to avoid exposing tokens in the UI */}
    </div>
  );
}
