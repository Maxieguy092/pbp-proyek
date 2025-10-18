import { useMemo, useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import MainLayout from "../templates/MainLayout/MainLayout";
import ProductCard from "../molecules/ProductCard/ProductCard";
import { fetchProducts } from "../../api/products";

// normalizer simpel buat pencarian case-insensitive
const norm = (s) => (s || "").toString().toLowerCase().trim();

export default function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get("q") || "";

  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ambil semua produk dari backend saat halaman dimuat
  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchProducts(); // panggil API backend
        setAllProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  // Filter produk sesuai query pencarian
  const filtered = useMemo(() => {
    if (!q) return [];
    const term = norm(q);
    return allProducts.filter((p) => {
      const inName = norm(p.name).includes(term);
      const inCat = norm(p.category).includes(term);
      const inDesc = norm(p.description || "").includes(term);
      return inName || inCat || inDesc;
    });
  }, [q, allProducts]);

  const resultsCount = filtered.length;

  if (loading) {
    return (
      <MainLayout>
        <p className="text-center py-10">Loading products...</p>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <p className="text-center text-red-600 py-10">
          Error loading products: {error}
        </p>
      </MainLayout>
    );
  }

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
