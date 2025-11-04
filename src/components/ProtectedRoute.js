import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  // No autenticado
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  // Si se especifican roles permitidos, validar
  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    if (!user.role || !allowedRoles.includes(user.role)) {
      return <Navigate to="/" replace />; // o a una página 403
    }
  }
  return children;
}
