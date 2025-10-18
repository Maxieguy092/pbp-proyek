// ==================================================
// 📁 File: src/components/pages/ProductDetailPage.jsx
// ==================================================
import { useParams, Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import MainLayout from "../templates/MainLayout/MainLayout";
import { useCart } from "../../contexts/CartContext";
import { fetchProductById } from "../../api/products";
import { useUser } from "../../contexts/UserContext";
import LoginPromptModal from "../molecules/LoginPromptModal/LoginPromptModal";
import AddToCartSuccessModal from "../molecules/AddToCartSuccessModal/AddToCartSuccessModal";

// Formatter IDR
const formatIDR = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

const FALLBACK_IMG = "/images/fallback.jpg";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { add, openCart } = useCart();
  const { user, loading: userLoading } = useUser(); // Ambil status user
  const [showLoginModal, setShowLoginModal] = useState(false); // State untuk modal

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [addedProductInfo, setAddedProductInfo] = useState(null); // Untuk menyimpan info produk

  // --- data state ---
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);

  // --- ui state ---
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState(null);

  // fetch product dari backend
  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchProductById(id)
      .then((p) => {
        if (!alive) return;
        setProduct(p);

        // ✅ Pilih otomatis size pertama yang stoknya masih tersedia
        const availableSize = Array.isArray(p?.sizes)
          ? p.sizes.find((s) => s.stock > 0)?.size || null
          : null;

          setSize(availableSize);
        })
      .catch(() => {
        if (!alive) return;
        setProduct(null);
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [id]);

  // guard
  if (loading) {
    return (
      <MainLayout>
        <div className="mx-auto max-w-7xl px-4 py-14 text-center">
          <h1 className="text-2xl font-semibold">Memuat produk…</h1>
        </div>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <div className="mx-auto max-w-7xl px-4 py-14 text-center">
          <h1 className="text-2xl font-semibold">Produk tidak ditemukan</h1>
          <p className="mt-2 text-gray-600">
            Mungkin ID salah atau produk sudah tidak tersedia.
          </p>
          <Link to="/" className="inline-block mt-6 underline">
            Kembali ke beranda
          </Link>
        </div>
      </MainLayout>
    );
  }

  // stok & kondisi
  // stok & kondisi
  const selectedSizeStock = Array.isArray(product.sizes)
    ? product.sizes.find((s) => s.size === size)?.stock ?? 0
    : product.stock;

  const maxQty = Number.isFinite(selectedSizeStock) ? selectedSizeStock : 10;
  const outOfStock = maxQty <= 0;


  // galeri gambar: pakai images[] kalo ada, fallback ke imageUrl
  const gallery = product.images?.length
    ? product.images
    : [product.imageUrl].filter(Boolean);

  const onAddToCart = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    if (outOfStock) {
      alert("Stok habis");
      return;
    }
    if (product.sizes?.length && !size) {
      alert("Pilih size dulu ya");
      return;
    }
    if (qty < 1 || qty > maxQty) {
      alert(`Qty harus 1–${maxQty}`);
      return;
    }

    // Panggil fungsi 'add' dari context
    add(product, qty, size);

    // Hapus alert lama
    // alert("Ditambahkan ke keranjang (demo)");

    // Simpan info produk dan kuantitas, lalu tampilkan modal sukses
    setAddedProductInfo({ ...product, qty });
    setShowSuccessModal(true);
  };

  const onViewCartClick = () => {
    setShowSuccessModal(false); // Tutup modal sukses
    openCart(); // Buka cart drawer
  };

  return (
    <MainLayout>
      <LoginPromptModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />

      <AddToCartSuccessModal
        open={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        onViewCart={onViewCartClick} // Teruskan handler baru ke props
        product={addedProductInfo}
        qty={addedProductInfo?.qty}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Kiri: Galeri */}
          <div className="grid grid-cols-2 gap-6">
            {gallery.map((src, idx) => (
              <div
                key={idx}
                className="aspect-[1/1] rounded-2xl overflow-hidden bg-[#f2f2f2] border border-[#e8e8e8]"
              >
                <img
                  src={src}
                  alt={`${product.name} ${idx + 1}`}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_IMG;
                  }}
                />
              </div>
            ))}
          </div>

          {/* Kanan: Detail */}
          <div>
            <h1 className="text-3xl font-semibold text-[#2b2b2b]">
              {product.name}
            </h1>

            <p className="mt-2 text-xl text-[#3971b8] font-medium">
              {formatIDR(product.price)}
            </p>

            {/* Size (opsional) */}
            {Array.isArray(product.sizes) && product.sizes.length > 0 && (
            <div className="mt-6">
              <p className="text-sm text-[#2b2b2b] mb-2">Size</p>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((sObj) => (
                  <button
                    key={sObj.size}
                    onClick={() => {
                      setSize(sObj.size);
                      setQty(1); // reset qty ke 1 setiap kali ganti ukuran
                    }}
                    className={`px-3 py-2 rounded-lg border ${
                      size === sObj.size
                        ? "bg-[#e1eac4] border-[#c8d69b]"
                        : "border-[#d3e0a9]"
                    }`}
                  >
                    {sObj.size}
                  </button>
                ))}
              </div>
            </div>
          )}


            {/* Stok berdasarkan size */}
          {Array.isArray(product.sizes) && product.sizes.length > 0 ? (
            <p className="mt-6 italic font-semibold text-sm text-gray-600">
              {size
                ? `Stok: ${
                    product.sizes.find((s) => s.size === size)?.stock ?? 0
                  }`
                : "Pilih ukuran terlebih dahulu."}
            </p>
          ) : (
            <p className="mt-6 italic font-semibold text-sm text-gray-600">
              {outOfStock ? "Stok habis" : `Stok: ${product.stock}`}
            </p>
          )}


            {/* Qty */}
            <div className="mt-2 inline-flex items-center border border-[#d3e0a9] rounded-lg overflow-hidden">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={outOfStock}
                className={`px-4 py-2 ${
                  outOfStock
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-[#e1eac4]"
                }`}
              >
                -
              </button>
              <span className="px-6 py-2 border-x border-[#d3e0a9] select-none">
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                disabled={outOfStock || qty >= maxQty}
                className={`px-4 py-2 ${
                  outOfStock || qty >= maxQty
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-[#e1eac4]"
                }`}
              >
                +
              </button>
            </div>
            {!outOfStock && (
              <p className="text-xs text-gray-500 mt-2">
                {size
                  ? `Maksimal ${maxQty} per pesanan (size ${size}).`
                  : `Maksimal ${maxQty} per pesanan.`}
              </p>
            )}

            {/* CTA */}
            <div className="mt-6">
              <button
                onClick={onAddToCart}
                disabled={outOfStock || userLoading}
                className={`w-full sm:w-64 rounded-xl px-6 py-3 font-medium transition ${
                  outOfStock || userLoading
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-[#3971b8] text-[#fbfcee] hover:opacity-95 active:scale-[.99]"
                }`}
              >
                {userLoading
                  ? "Loading..."
                  : outOfStock
                  ? "Stok Habis"
                  : "Add to cart"}
              </button>
            </div>

            {/* Deskripsi (opsional) */}
            {product.description ? (
              <div className="mt-8">
                <h2 className="text-sm font-semibold text-[#2b2b2b] mb-2">
                  Description
                </h2>
                <p className="max-w-prose text-[#2b2b2b]/80 leading-relaxed">
                  {product.description}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
