import { useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import MainLayout from "../templates/MainLayout/MainLayout";
import ProductCard from "../molecules/ProductCard/ProductCard";
import { allProducts } from "../../data/catalog"; // <- ambil data dari catalog.js

// normalizer simpel buat pencarian case-insensitive
const norm = (s) => (s || "").toString().toLowerCase().trim();

export default function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get("q") || "";

  const filtered = useMemo(() => {
    if (!q) return [];
    const term = norm(q);

    // filter by name, category, (opsional) description
    return allProducts.filter((p) => {
      const inName = norm(p.name).includes(term);
      const inCat = norm(p.category).includes(term);
      return inName || inCat;
    });
  }, [q]);

  const resultsCount = filtered.length;

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-center text-3xl font-semibold">Search</h1>

        {q ? (
          <p className="mt-2 text-center text-sm sm:text-base text-[#3b6aa8]">
            {resultsCount} result{resultsCount !== 1 ? "s" : ""} for “{q}”
          </p>
        ) : (
          <p className="mt-2 text-center text-sm text-gray-600">
            Ketik kata kunci di search bar.
          </p>
        )}

        {q && resultsCount === 0 && (
          <div className="text-center mt-12">
            <p className="text-gray-600">No results found.</p>
            <p className="text-sm text-gray-500 mt-1">
              Coba kata kunci lain atau cek ejaan.
            </p>
            <Link to="/" className="inline-block mt-4 underline">
              Kembali ke beranda
            </Link>
          </div>
        )}

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((p) => (
            <ProductCard key={p.id} {...p} to={`/products/${p.id}`} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
