import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const initialUsers = [
  { username: 'admin', password: 'admin', role: 'admin' },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState(() => {
    const storedUsers = localStorage.getItem('users');
    return storedUsers ? JSON.parse(storedUsers) : initialUsers;
  });

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  const login = (username, password) => {
    const found = users.find(u => u.username === username && u.password === password);
    if (found) {
      setUser({ username: found.username, role: found.role || 'customer' });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const register = (username, password) => {
    if (users.find(u => u.username === username)) {
      return false; // usuario ya existe
    }
    const newUser = { username, password, role: 'customer' };
    setUsers([...users, newUser]);
    setUser({ username, role: 'customer' });
    return true;
  };

  const changePassword = (username, currentPassword, newPassword) => {
    const userToUpdate = users.find(u => u.username === username);
    if (!userToUpdate) {
      return { success: false, message: 'Usuario no encontrado.' };
    }
    if (userToUpdate.password !== currentPassword) {
      return { success: false, message: 'La contraseña actual es incorrecta.' };
    }
    if (newPassword.length < 3) {
      return { success: false, message: 'La nueva contraseña debe tener al menos 3 caracteres.' };
    }
    const updatedUsers = users.map(u => 
      u.username === username ? { ...u, password: newPassword } : u
    );
    setUsers(updatedUsers);
    return { success: true, message: 'Contraseña cambiada exitosamente.' };
  };

  return (
    <AuthContext.Provider value={{ user, users, login, logout, register, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
