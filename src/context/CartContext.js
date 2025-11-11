import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const { user, setUser } = useAuth();
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

  // Al montar la app (recarga del navegador), intentar cargar el carrito del usuario
  // desde localStorage y sincronizar precios inmediatamente para que los compradores
  // vean las actualizaciones de admin sin acciones adicionales.
  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
      if (!storedUser || !storedUser.username) return;
      const all = readAllCarts();
      const initial = all[storedUser.username] || [];
      if (!initial || initial.length === 0) return;
      setCart(initial);
      (async () => {
        try {
          await syncPrices(initial);
        } catch (e) {
          // no bloquear la carga si falla
        }
      })();
    } catch (e) {
      // ignorar errores de parsing
    }
  }, []);

  // Cargar el carrito del usuario actual al iniciar o cuando cambia el usuario
  useEffect(() => {
    if (!user) {
      setCart([]);
      return;
    }
    const all = readAllCarts();
    const initial = all[user.username] || [];
    setCart(initial);
    // sincronizar precios automáticamente al cargar el carrito para reflejar cambios del admin
    if (initial.length > 0) {
      (async () => {
        try {
          await syncPrices(initial);
        } catch (e) {
          // ignorar errores de sincronización inicial
        }
      })();
    }
  }, [user?.username]);

  function addToCart(product, quantity = 1) {
    // Si no hay usuario autenticado, redirigir al login para obligar autenticación
    if (!user) {
      // navegar a /login y conservar la ruta actual para volver después
      const next = encodeURIComponent(window.location.pathname + window.location.search);
      window.location.href = `/login?next=${next}`;
      return;
    }
    // Si el objeto user no tiene info de role/is_staff, intentar refrescar desde /user/me/
    if (typeof user.role === 'undefined' && typeof user.is_staff === 'undefined') {
      api.get('/user/me/').then(resp => {
        localStorage.setItem('user', JSON.stringify(resp.data));
        setUser(resp.data);
        // si tras refrescar es admin, bloquear
        if (resp.data?.role === 'admin' || resp.data?.is_staff) {
          alert('Los administradores no pueden agregar productos al carrito.');
          return;
        }
        // si no es admin, proceder a añadir al carrito
        _doAdd(product, quantity);
      }).catch(() => {
        // si falla la llamada, como medida conservadora bloquear la acción
        alert('No se pudo verificar el usuario. Por seguridad, la acción ha sido cancelada.');
      });
      return;
    }
    // Los administradores no deben poder agregar productos al carrito
    if (user?.role === 'admin' || user?.is_staff) {
      alert('Los administradores no pueden agregar productos al carrito.');
      return;
    }
    _doAdd(product, quantity);
  }

  // Internal helper to actually add to cart (used after async user refresh)
  function _doAdd(product, quantity = 1) {
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

  // Sincronizar precios/nombres del carrito desde el servidor (útil cuando un admin cambia precios)
  // Si se pasa `itemsParam`, sincroniza esos items y luego actualiza el carrito;
  // si no, sincroniza el carrito actual en estado.
  async function syncPrices(itemsParam) {
    const itemsToSync = Array.isArray(itemsParam) ? itemsParam : cart;
    if (!itemsToSync || itemsToSync.length === 0) return;
    try {
      const updated = await Promise.all(itemsToSync.map(async item => {
        try {
          const resp = await api.get(`/productos/${item.id}/`);
          const p = resp.data;
          // normalizar campos y forzar número en price
          const resolvedPrice = Number(p.precio ?? p.price ?? item.price) || 0;
          const resolvedName = p.nombre ?? p.name ?? item.name ?? item.nombre;
          return { ...item, price: resolvedPrice, precio: p.precio ?? String(resolvedPrice), name: resolvedName, nombre: resolvedName };
        } catch (e) {
          // si falla la petición para un producto, mantener el item tal cual
          return item;
        }
      }));
      setCart(prev => {
        // Reconcile: replace existing items with updated ones by id, keep any other items
        const updatedById = Object.fromEntries(updated.map(it => [it.id, it]));
        const merged = prev.map(it => updatedById[it.id] ? { ...it, ...updatedById[it.id] } : it);
        // If itemsParam was provided and cart was empty (e.g., initial load), ensure we set the updated array
        if (prev.length === 0 && Array.isArray(itemsParam)) return updated;
        return merged;
      });
      // Persist updated cart to localStorage for current user
      try {
        if (user && user.username) {
          const all = readAllCarts();
          all[user.username] = Array.isArray(itemsParam) ? updated : (all[user.username] || []).map(it => {
            const u = updated.find(x => x.id === it.id);
            return u ? { ...it, ...u } : it;
          });
          writeAllCarts(all);
        }
      } catch (e) {
        // no bloquear por error de persistencia
      }
    } catch (e) {
      // no fallar por completo si algo falla
      console.error('Error sincronizando precios del carrito', e);
    }
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
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, total, syncPrices }}>
      {children}
    </CartContext.Provider>
  );
}
