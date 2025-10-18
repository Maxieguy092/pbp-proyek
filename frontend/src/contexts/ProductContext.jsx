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
      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("category_id", newProduct.category_id || newProduct.category);
      formData.append("price", newProduct.price);
      formData.append("stock", newProduct.stock);
      formData.append("description", newProduct.description);

      if (newProduct.sizes && newProduct.sizes.length > 0) {
        const formattedSizes = newProduct.sizes.map((s) => ({
          size: s.size,
          stock: Number(s.stock) || 0,
        }));
        formData.append("sizes", JSON.stringify(formattedSizes));
      }

      // Tambahkan file gambar (maksimal 4)
      newProduct.images.forEach((img) => {
        if (img.file) {
          formData.append("images", img.file);
        }
      });

      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        body: formData, 
      });

      const data = await res.json();
      setProducts((prev) => [...prev, data]);
    } catch (err) {
      console.error("Gagal tambah produk:", err);
    }
  };


  const updateProduct = async (id, updatedProduct) => {
    try {
      const formData = new FormData();
      formData.append("name", updatedProduct.name);
      formData.append("category_id", updatedProduct.category_id || updatedProduct.category);
      formData.append("price", updatedProduct.price);
      formData.append("stock", updatedProduct.stock);
      formData.append("description", updatedProduct.description);

      if (updatedProduct.sizes && updatedProduct.sizes.length > 0) {
        const formattedSizes = updatedProduct.sizes.map((s) => ({
          size: s.size,
          stock: Number(s.stock) || 0,
        }));
        formData.append("sizes", JSON.stringify(formattedSizes));
      }
      updatedProduct.images.forEach((img) => {
        if (img.file) {
          formData.append("images", img.file);
        } else if (img.url) {
          formData.append("existingImages", img.url); // biar backend tahu mana gambar lama
        }
      });

      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Update gagal:", err);
        return;
      }

      const updated = await res.json();
      setProducts((prev) =>
        prev.map((p) => (p.id === Number(id) ? { ...p, ...updated } : p))
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
