import { Link } from "react-router-dom";
import Button from "../../atoms/Button/Button";
import ProductCard from "../../molecules/ProductCard/ProductCard";

export default function ProductGridSection({
  id,
  title,
  description,
  to, // link "View All" (opsional)
  items = 5, // jumlah dummy kalau gak ada products
  products, // array produk dari catalog/API
  limit, // ⬅️ baru: batasi jumlah yang ditampilkan
}) {
  const cap = Number.isFinite(limit) ? limit : undefined;

  // kalau ada products → pakai itu; kalau nggak ada → bikin dummy
  const baseList =
    products ??
    Array.from({ length: items }).map((_, i) => ({
      id: i + 1,
      name: `Produk #${i + 1}`,
      category: title,
      price: 199000 + i * 10000,
      imageUrl: i % 2 === 0 ? "/images/shirt-1.jpg" : "/images/shirt-2.jpg",
    }));

  // terapkan limit kalau diset
  const list = cap ? baseList.slice(0, cap) : baseList;

  return (
    <section
      id={id}
      className="mt-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-semibold">{title}</h2>
        <p className="mt-2 text-sm sm:text-base text-[#3b6aa8]">
          {description}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
        {list.map((p) => (
          <ProductCard key={p.id} {...p} />
        ))}
      </div>

      {to && (
        <div className="flex justify-center">
          <Link to={to}>
            <Button className="mt-8">View All</Button>
          </Link>
        </div>
      )}
    </section>
  );
}
