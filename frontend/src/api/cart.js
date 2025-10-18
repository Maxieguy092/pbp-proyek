// src/api/cart.js
const API_BASE_PATH = import.meta.env.VITE_API_URL || "/api";

export async function getCart() {
  const response = await fetch(`${API_BASE_PATH}/cart`, {
    credentials: "include",
  });
  if (!response.ok) {
    if (response.status === 401) return [];
    throw new Error("Gagal mengambil data keranjang");
  }
  return response.json();
}

export async function addItemToCart(productId, qty, variant = null) {
  const response = await fetch(`${API_BASE_PATH}/cart/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId, qty, variant }),
    credentials: "include",
  });
  if (!response.ok) throw new Error("Gagal menambahkan item ke keranjang");
  return response.json();
}

export async function updateItemQty(cartItemId, qty) {
  const response = await fetch(`${API_BASE_PATH}/cart/items/${cartItemId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ qty }),
    credentials: "include",
  });
  if (!response.ok) throw new Error("Gagal memperbarui kuantitas item");
  return response.json();
}

export async function removeItemFromCart(cartItemId) {
  const response = await fetch(`${API_BASE_PATH}/cart/items/${cartItemId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) throw new Error("Gagal menghapus item dari keranjang");
  return response.json();
}

export async function clearCart() {
  const response = await fetch(`${API_BASE_PATH}/cart`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) throw new Error("Gagal mengosongkan keranjang");
  return response.json();
}
