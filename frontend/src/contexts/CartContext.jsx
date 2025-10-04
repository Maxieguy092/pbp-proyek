import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartCtx = createContext(null);
const STORAGE_KEY = "cart:v1";

export const formatIDR = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

/**
 * Bentuk item cart:
 * { id, name, price, imageUrl, qty, variant, stock }
 * - variant: mis. size / warna (optional)
 * - stock: optional (untuk batasi qty)
 */
export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const add = (product, qty = 1, variant = null) => {
    setItems((prev) => {
      const key = (x) => `${x.id}__${x.variant ?? ""}`;
      const idx = prev.findIndex(
        (x) => key(x) === key({ id: product.id, variant })
      );
      const max = Number.isFinite(product.stock) ? product.stock : 99;
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: Math.min(next[idx].qty + qty, max) };
        return next;
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          variant,
          stock: product.stock,
          qty: Math.min(qty, max),
        },
      ];
    });
  };

  const increment = (id, variant = null) => {
    setItems((prev) =>
      prev.map((x) => {
        if (x.id === id && (x.variant ?? null) === (variant ?? null)) {
          const max = Number.isFinite(x.stock) ? x.stock : 99;
          return { ...x, qty: Math.min(x.qty + 1, max) };
        }
        return x;
      })
    );
  };

  const decrement = (id, variant = null) => {
    setItems((prev) =>
      prev
        .map((x) => {
          if (x.id === id && (x.variant ?? null) === (variant ?? null)) {
            return { ...x, qty: x.qty - 1 };
          }
          return x;
        })
        .filter((x) => x.qty > 0)
    );
  };

  const remove = (id, variant = null) => {
    setItems((prev) =>
      prev.filter(
        (x) => !(x.id === id && (x.variant ?? null) === (variant ?? null))
      )
    );
  };

  const clear = () => setItems([]);

  const total = useMemo(
    () => items.reduce((s, x) => s + x.price * x.qty, 0),
    [items]
  );
  const count = useMemo(() => items.reduce((s, x) => s + x.qty, 0), [items]);

  const value = {
    items,
    add,
    increment,
    decrement,
    remove,
    clear,
    total,
    count,
  };
  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export const useCart = () => {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
};
