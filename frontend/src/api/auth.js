const API_BASE_PATH = import.meta.env.VITE_API_URL;

export async function registerUser(userData) {
  const response = await fetch(`${API_BASE_PATH}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to register");
  }

  return data;
}

export async function checkAdminSession() {
  const res = await fetch("/api/admin/dashboard", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Not authenticated or not admin");
  }

  return res.json();
}
