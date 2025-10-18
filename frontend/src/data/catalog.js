const BASE_URL = "http://localhost:5000/api";

export async function getAllProducts() {
  const res = await fetch(`${BASE_URL}/products/`);
  if (!res.ok) throw new Error("Gagal memuat produk");
  return await res.json();
}

export async function getProductById(id) {
  const res = await fetch(`${BASE_URL}/products/${id}`);
  if (!res.ok) throw new Error("Produk tidak ditemukan");
  return await res.json();
}
