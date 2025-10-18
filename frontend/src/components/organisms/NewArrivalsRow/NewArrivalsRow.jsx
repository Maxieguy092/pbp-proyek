import { useEffect, useState, useMemo } from "react";
import ProductCard from "../../molecules/ProductCard/ProductCard";
import { fetchProducts } from "../../../api/products";

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

export default function NewArrivalsRow() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchProducts({});
        setItems(data);
      } catch (e) {
        setErr(String(e.message || e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const arrivals = useMemo(() => shuffle(items).slice(0, 5), [items]);

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-semibold">New Arrivals</h2>
        <p className="mt-2 text-sm sm:text-base text-[#3b6aa8]">
          Temukan koleksi terbaru dengan desain segar yang siap lengkapi gaya
          harianmu.
        </p>
      </div>

      {loading && <p className="text-center">Loading new arrivals…</p>}
      {err && <p className="text-center text-red-600">{err}</p>}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
        {arrivals.map((p) => (
          <ProductCard key={p.id} {...p} to={`/products/${p.id}`} />
        ))}
      </div>
    </section>
  );
}
