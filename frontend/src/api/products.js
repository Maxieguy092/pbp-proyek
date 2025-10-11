const API_BASE_PATH = import.meta.env.VITE_API_URL; // Ini akan bernilai "/api"

export async function fetchProducts({ category }) {
  let urlString = `${API_BASE_PATH}/products`;
  if (category) {
    urlString += `?category=${encodeURIComponent(category)}`;
  }

  const response = await fetch(urlString);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  return response.json();
}

export async function fetchProductById(id) {
  const urlString = `${API_BASE_PATH}/products/${id}`;

  const response = await fetch(urlString);

  if (!response.ok) {
    throw new Error("Failed to fetch product by ID");
  }
  return response.json();
}
