// src/components/pages/TShirtsPage.jsx
import { useEffect, useState } from "react";
import MainLayout from "../templates/MainLayout/MainLayout";
import ProductCard from "../molecules/ProductCard/ProductCard";
import { fetchProducts } from "../../api/products";

export default function TShirtsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchProducts({ category: "T-Shirts" });
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
        <h1 className="text-2xl font-semibold mb-8">T-Shirts</h1>

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
