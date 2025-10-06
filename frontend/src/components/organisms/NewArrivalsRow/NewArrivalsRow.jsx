// src/components/organisms/NewArrivalsRow/NewArrivalsRow.jsx
import ProductCard from "../../molecules/ProductCard/ProductCard";
import { allProducts, shuffle } from "../../../data/catalog";

export default function NewArrivalsRow() {
  // contoh: random 5 item dari semua kategori
  const arrivals = shuffle(allProducts).slice(0, 5);

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-semibold">New Arrivals</h2>
        <p className="mt-2 text-sm sm:text-base text-[#3b6aa8]">
          Temukan koleksi terbaru dengan desain segar yang siap lengkapi gaya
          harianmu.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
        {arrivals.map((p) => (
          <ProductCard key={p.id} {...p} to={`/products/${p.id}`} />
        ))}
      </div>
    </section>
  );
}
