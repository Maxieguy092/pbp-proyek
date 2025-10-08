// src/components/pages/ShirtsPage.jsx
import { useEffect, useState } from "react";
import MainLayout from "../templates/MainLayout/MainLayout";
import ProductCard from "../molecules/ProductCard/ProductCard";
import { fetchProducts } from "../../api/products";

export default function ShirtsPage() {
  // 1. Siapkan state untuk data, loading, dan error
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // 2. Ambil data dari API saat komponen dimuat
  useEffect(() => {
    (async () => {
      try {
        // Panggil API dengan filter kategori "Shirts"
        const data = await fetchProducts({ category: "Shirts" });
        setItems(data);
      } catch (e) {
        setErr(String(e.message || e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="text-2xl font-semibold mb-8">Shirts</h1>

        {/* 3. Tampilkan UI berdasarkan kondisi state */}
        {loading && <p>Loading…</p>}
        {err && <p className="text-red-600">{err}</p>}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((p) => (
            <ProductCard key={p.id} {...p} to={`/products/${p.id}`} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
