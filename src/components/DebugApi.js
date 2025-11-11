import React, { useState } from 'react';
import api from '../services/api';

export default function DebugApi() {
  const [out, setOut] = useState('');

  const doToken = async () => {
    setOut('Calling /token/ ...');
    try {
      const resp = await api.post('/token/', { username: 'noexiste', password: 'nope' });
      setOut(JSON.stringify(resp.data, null, 2));
    } catch (err) {
      const status = err?.response?.status;
      const data = err?.response?.data;
      setOut(`Error ${status || ''}: ${JSON.stringify(data || err.message)}`);
    }
  };

  const doMe = async () => {
    setOut('Calling /user/me/ ...');
    try {
      const resp = await api.get('/user/me/');
      setOut(JSON.stringify(resp.data, null, 2));
    } catch (err) {
      const status = err?.response?.status;
      const data = err?.response?.data;
      setOut(`Error ${status || ''}: ${JSON.stringify(data || err.message)}`);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Debug API</h3>
      <p>API baseURL: <strong>{api.defaults.baseURL}</strong></p>
      <div className="mb-2">
        <button className="btn btn-primary me-2" onClick={doToken}>POST /token/ (test)</button>
        <button className="btn btn-secondary" onClick={doMe}>GET /user/me/</button>
      </div>
      <pre style={{whiteSpace: 'pre-wrap', background:'#f8f9fa', padding: '1rem', borderRadius:6}}>{out}</pre>
      <p className="text-muted small">Si ves "Network Error" aquí, fijate en la pestaña Network (F12) para ver la URL exacta y el error.</p>
    </div>
  );
}
