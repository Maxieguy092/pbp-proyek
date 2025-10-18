// src/contexts/CartContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useUser } from "./UserContext";
import {
  getCart,
  addItemToCart,
  updateItemQty,
  removeItemFromCart,
  clearCart,
} from "../api/cart";

const CartCtx = createContext(null);

export const formatIDR = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setLoading(true);
      getCart()
        .then((data) => {
          console.log("Data keranjang diterima dari backend:", data);

          if (Array.isArray(data)) {
            setItems(data);
          } else {
            console.error("Data keranjang bukan array!", data);
            setItems([]);
          }
        })
        .catch((err) => {
          console.error("Gagal mengambil keranjang:", err);
          setItems([]);
        })
        .finally(() => setLoading(false));
    } else {
      setItems([]);
    }
  }, [user]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const add = async (product, qty = 1, variant = null) => {
    if (!user) {
      return alert("Silakan login untuk menambahkan item ke keranjang.");
    }

    const existingItem = items.find(
      (item) => item.id === product.id && item.variant === variant
    );
    const qtyInCart = existingItem ? existingItem.qty : 0;

    if (qtyInCart + qty > product.stock) {
      return alert(
        `Tidak bisa menambahkan melebihi stok. Anda sudah punya ${qtyInCart} di keranjang, dan stok produk ini hanya ${product.stock}.`
      );
    }

    try {
      const updatedCart = await addItemToCart(product.id, qty, variant);
      setItems(updatedCart);
    } catch (error) {
      alert(error.message);
    }
  };

  const increment = async (cartItemId) => {
    const item = items.find((it) => it.cartItemId === cartItemId);
    if (!item) return;
    try {
      const updatedCart = await updateItemQty(cartItemId, item.qty + 1);
      setItems(updatedCart);
    } catch (error) {
      alert(error.message);
    }
  };

  const decrement = async (cartItemId) => {
    const item = items.find((it) => it.cartItemId === cartItemId);
    if (!item || item.qty <= 1) return;
    try {
      const updatedCart = await updateItemQty(cartItemId, item.qty - 1);
      setItems(updatedCart);
    } catch (error) {
      alert(error.message);
    }
  };

  const remove = async (cartItemId) => {
    try {
      const updatedCart = await removeItemFromCart(cartItemId);
      setItems(updatedCart);
    } catch (error) {
      alert(error.message);
    }
  };

  const clear = async () => {
    try {
      await clearCart();
      setItems([]);
    } catch (error) {
      alert(error.message);
    }
  };

  const total = useMemo(
    () => items.reduce((s, x) => s + x.price * x.qty, 0),
    [items]
  );
  const count = useMemo(() => items.reduce((s, x) => s + x.qty, 0), [items]);

  const value = {
    items,
    loading,
    add,
    increment,
    decrement,
    remove,
    clear,
    total,
    count,
    isCartOpen,
    openCart,
    closeCart,
  };

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export const useCart = () => {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
};
