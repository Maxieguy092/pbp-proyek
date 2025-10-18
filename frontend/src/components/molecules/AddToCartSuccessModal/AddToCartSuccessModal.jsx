// src/components/molecules/AddToCartSuccessModal/AddToCartSuccessModal.jsx
import { Link } from "react-router-dom";
import { formatIDR } from "../../../contexts/CartContext";

export default function AddToCartSuccessModal({
  open,
  onClose,
  onViewCart,
  product,
  qty,
}) {
  if (!open || !product) return null;

  return (
    <>
      {/* Latar belakang gelap */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Konten Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl bg-[#fbfcee] p-6 text-center shadow-xl">
          {/* Ikon Centang Hijau */}
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-[#e1eac4] flex items-center justify-center text-[#394b2b] text-4xl font-bold">
            ✓
          </div>
          <h3 className="text-2xl font-semibold text-[#2b2b2b]">
            Berhasil Ditambahkan!
          </h3>

          {/* Detail Produk yang Ditambahkan */}
          <div className="mt-4 flex items-center gap-4 text-left border-y border-[#e5e8d2] py-4">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-20 h-20 object-cover rounded-md"
            />
            <div className="flex-grow">
              <p className="font-semibold">{product.name}</p>
              <p className="text-sm text-gray-600">Qty: {qty}</p>
              <p className="text-sm font-medium">{formatIDR(product.price)}</p>
            </div>
          </div>

          <p className="mt-4 text-[#6b7280]">
            Anda dapat melanjutkan belanja atau melihat keranjang Anda.
          </p>

          {/* Tombol Aksi */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="w-full rounded-xl px-5 py-2 font-medium bg-transparent text-[#6b7280] hover:bg-[#e5e8d2]"
            >
              Lanjut Belanja
            </button>
            <button
              onClick={onViewCart}
              className="w-full rounded-xl px-5 py-2 font-medium bg-[#394b2b] text-white hover:opacity-95"
            >
              Lihat Keranjang
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
