// 📁 src/contexts/ProductContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Ambil data produk dari backend
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        const data = await res.json();
        console.log("Produk dari API:", data);
        setProducts(data);
      } catch (err) {
        console.error("Gagal fetch produk:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);



  // di ProductContext.jsx

const addProduct = async (newProduct) => {
  try {
    const payload = {
      ...newProduct,
      images: newProduct.images.map(img => img.url || img), // ambil hanya URL string
    };

    const res = await fetch("http://localhost:5000/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setProducts(prev => [...prev, data]);
  } catch (err) {
    console.error("Gagal tambah produk:", err);
  }
};

const updateProduct = async (id, updatedProduct) => {
  try {
    const payload = {
      ...updatedProduct,
      images: updatedProduct.images.map(img => img.url || img),
    };

    const res = await fetch(`http://localhost:5000/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error("Update gagal:", err);
      return;
    }

    const updated = await res.json();
    setProducts(prev =>
      prev.map(p => (p.id === Number(id) ? { ...p, ...updatedProduct } : p))
    );
  } catch (err) {
    console.error("Gagal update produk:", err);
  }
};



  // 🔹 Hapus produk (DELETE ke backend)
  const deleteProduct = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal menghapus produk");

      // Setelah delete berhasil → re-fetch semua produk biar list UI update otomatis
      const refreshed = await fetch("http://localhost:5000/api/products");
      const updatedList = await refreshed.json();
      setProducts(updatedList);

    } catch (err) {
      console.error(err);
    }
  };


  return (
    <ProductContext.Provider
      value={{ products, loading, addProduct, updateProduct, deleteProduct }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductContext);
}
