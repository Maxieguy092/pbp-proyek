import { useState, useEffect } from "react"; // 1. Impor hooks
import MainLayout from "../templates/MainLayout/MainLayout";
import HeroBanner from "../organisms/HeroBanner/HeroBanner";
import NewArrivalsRow from "../organisms/NewArrivalsRow/NewArrivalsRow";
import ProductGridSection from "../organisms/ProductGridSection/ProductGridSection";
import { fetchProducts } from "../../api/products"; // 2. Impor fungsi API

export default function HomePage() {
  // 4. Siapkan state untuk produk, loading, dan error
  const [products, setProducts] = useState({
    shirts: [],
    tshirts: [],
    pants: [],
    outerwear: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 5. Gunakan useEffect untuk mengambil data saat komponen dimuat
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        // Ambil data untuk semua kategori secara paralel agar lebih cepat
        const [shirtsData, tshirtsData, pantsData, outerwearData] =
          await Promise.all([
            fetchProducts({ category: "Shirts" }),
            fetchProducts({ category: "T-Shirts" }),
            fetchProducts({ category: "Pants" }),
            fetchProducts({ category: "Outerwear" }),
          ]);

        // Simpan data ke state
        setProducts({
          shirts: shirtsData,
          tshirts: tshirtsData,
          pants: pantsData,
          outerwear: outerwearData,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []); // Array kosong berarti efek ini hanya berjalan sekali

  return (
    <MainLayout>
      <HeroBanner />
      <NewArrivalsRow />

      {/* 6. Tampilkan pesan loading atau error jika ada */}
      {loading && <p className="text-center py-10">Loading products...</p>}
      {error && (
        <p className="text-center py-10 text-red-600">Error: {error}</p>
      )}

      {/* Tampilkan section hanya jika tidak loading dan tidak ada error */}
      {!loading && !error && (
        <>
          {/* 7. Teruskan data dari state ke komponen */}
          <ProductGridSection
            id="shirts"
            title="Shirts"
            description="Kemeja premium untuk tampilan rapi, nyaman dipakai dari pagi hingga malam."
            to="/shirts"
            products={products.shirts}
            limit={5} // ⬅️ Anda bisa sesuaikan limitnya
          />
          <ProductGridSection
            id="tshirts"
            title="T-Shirts"
            description="Kaos simpel dan versatile, mudah dipadu-padankan setiap kesempatan."
            to="/t-shirts"
            products={products.tshirts}
            limit={5}
          />
          <ProductGridSection
            id="pants"
            title="Pants"
            description="Celana dengan potongan modern dah bahan nyaman, cocok untuk gaya formal maupun kasual."
            to="/pants"
            products={products.pants}
            limit={5}
          />
          <ProductGridSection
            id="outerwear"
            title="Outerwear"
            description="Lapisan stylish untuk melengkapi penampilan - hangat, ringan, dan penuh karakter."
            to="/outerwear"
            products={products.outerwear}
            limit={5}
          />
        </>
      )}
    </MainLayout>
  );
}
