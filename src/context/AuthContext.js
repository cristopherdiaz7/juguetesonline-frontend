import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const initialUsers = [
  { username: 'admin', password: 'admin' },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [users, setUsers] = useState(initialUsers);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = (username, password) => {
    const found = users.find(u => u.username === username && u.password === password);
    if (found) {
      setUser({ username });
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
    setUsers([...users, { username, password }]);
    setUser({ username });
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
