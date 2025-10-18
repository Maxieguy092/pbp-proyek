const API_BASE_PATH = import.meta.env.VITE_API_URL || "/api";

// Mengambil semua pesanan
export async function fetchOrders() {
  const response = await fetch(`${API_BASE_PATH}/admin/orders`, {
    credentials: "include", // <-- TAMBAHKAN INI
  });
  if (!response.ok) throw new Error("Gagal mengambil data pesanan");
  return response.json();
}

// Mengambil detail satu pesanan
export async function fetchOrderById(id) {
  const response = await fetch(`${API_BASE_PATH}/admin/orders/${id}`, {
    credentials: "include", // <-- TAMBAHKAN INI
  });
  if (!response.ok) throw new Error("Gagal mengambil detail pesanan");
  return response.json();
}

// Mengupdate status pesanan
export async function updateOrderStatus(id, status) {
  const response = await fetch(`${API_BASE_PATH}/admin/orders/${id}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
    credentials: "include", // <-- TAMBAHKAN INI
  });
  if (!response.ok) throw new Error("Gagal memperbarui status");
  return response.json();
}

// Mengirim data pesanan baru dari halaman checkout
export async function createOrder(orderData) {
  // Target URL: /api/orders, sesuai dengan yang didaftarkan di routes.go
  const response = await fetch(`${API_BASE_PATH}/orders`, {
    method: "POST", // Menggunakan metode POST untuk mengirim data baru
    headers: {
      "Content-Type": "application/json", // Memberi tahu backend bahwa kita mengirim JSON
    },
    body: JSON.stringify(orderData), // Mengubah objek JavaScript menjadi string JSON
    credentials: "include", // Penting untuk mengirim cookie sesi agar otentikasi berhasil
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Gagal membuat pesanan.");
  }

  return response.json();
}
