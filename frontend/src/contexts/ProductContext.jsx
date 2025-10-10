// 📁 src/contexts/ProductContext.jsx
import { createContext, useContext, useState } from "react";

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([
    {
      id: "p-001",
      name: "Baju Baju baju baju – warna",
      category: "Outerwear",
      price: 999999,
      stock: 45,
    },
    {
      id: "p-002",
      name: "Baju Baju baju baju – warna",
      category: "Outerwear",
      price: 999999,
      stock: 45,
    },
  ]);

  // tambah produk baru
  const addProduct = (newProduct) => {
    setProducts((prev) => [...prev, { id: `p-${Date.now()}`, ...newProduct }]);
  };

  // edit produk
  const updateProduct = (id, updated) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
    );
  };

  // hapus produk
  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <ProductContext.Provider
      value={{ products, addProduct, updateProduct, deleteProduct }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductContext);
}
