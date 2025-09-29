// src/contexts/CartContext.jsx
import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const addToCart = (item) => {
    // gabungkan kalau sama id+variant
    setItems((prev) => {
      const i = prev.findIndex(
        (p) => p.id === item.id && p.variant === item.variant
      );
      if (i >= 0) {
        const copy = [...prev];
        copy[i] = { ...copy[i], qty: copy[i].qty + item.qty };
        return copy;
      }
      return [...prev, item];
    });
  };

  const increment = (id, variant) =>
    setItems((prev) =>
      prev.map((it) =>
        it.id === id && it.variant === variant ? { ...it, qty: it.qty + 1 } : it
      )
    );

  const decrement = (id, variant) =>
    setItems((prev) =>
      prev.map((it) =>
        it.id === id && it.variant === variant
          ? { ...it, qty: Math.max(1, it.qty - 1) }
          : it
      )
    );

  const remove = (id, variant) =>
    setItems((prev) =>
      prev.filter((it) => !(it.id === id && it.variant === variant))
    );

  const total = useMemo(
    () => items.reduce((s, it) => s + it.price * it.qty, 0),
    [items]
  );
  const count = useMemo(() => items.reduce((c, it) => c + it.qty, 0), [items]);

  const value = {
    items,
    addToCart,
    increment,
    decrement,
    remove,
    total,
    count,
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

export const formatIDR = (n) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(
    n
  );
