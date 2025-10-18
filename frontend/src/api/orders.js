const API_BASE_PATH = import.meta.env.VITE_API_URL || "/api";

export async function fetchOrders() {
  const response = await fetch(`${API_BASE_PATH}/admin/orders`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Gagal mengambil data pesanan");
  return response.json();
}

export async function fetchOrderById(id) {
  const response = await fetch(`${API_BASE_PATH}/admin/orders/${id}`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Gagal mengambil detail pesanan");
  return response.json();
}

export async function updateOrderStatus(id, status) {
  const response = await fetch(`${API_BASE_PATH}/admin/orders/${id}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
    credentials: "include",
  });
  if (!response.ok) throw new Error("Gagal memperbarui status");
  return response.json();
}

export async function createOrder(orderData) {
  const response = await fetch(`${API_BASE_PATH}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Gagal membuat pesanan.");
  }

  return response.json();
}
