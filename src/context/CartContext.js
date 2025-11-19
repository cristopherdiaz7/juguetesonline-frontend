import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);

  // Helper para leer/escribir todos los carritos
  const readAllCarts = () => {
    try {
      const raw = localStorage.getItem('cartsByUser');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  };
  const writeAllCarts = (all) => {
    localStorage.setItem('cartsByUser', JSON.stringify(all));
  };

  // Cargar el carrito del usuario actual al iniciar o cuando cambia el usuario
  useEffect(() => {
    if (!user) {
      setCart([]);
      return;
    }
    const all = readAllCarts();
    setCart(all[user.username] || []);
  }, [user?.username]);

  function addToCart(product, quantity = 1) {
    setCart(prev => {
      const found = prev.find(item => item.id === product.id);
      if (found) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        return [...prev, { ...product, quantity }];
      }
    });
  }

  function removeFromCart(productId) {
    setCart(prev => prev.filter(item => item.id !== productId));
  }

  function updateQuantity(productId, quantity) {
    setCart(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  }

  function clearCart() {
    setCart([]);
  }

  const total = cart.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);

  // Persistir carrito del usuario actual cuando cambie
  useEffect(() => {
    if (!user) return;
    const all = readAllCarts();
    all[user.username] = cart;
    writeAllCarts(all);
  }, [cart, user?.username]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}
