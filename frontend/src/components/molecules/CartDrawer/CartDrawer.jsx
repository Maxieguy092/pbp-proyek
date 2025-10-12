// src/components/organisms/CartDrawer/CartDrawer.jsx
import { useNavigate } from "react-router-dom";
import { useCart, formatIDR } from "../../../contexts/CartContext";

const FALLBACK_IMG = "/images/fallback.png";

export default function CartDrawer({ open, onClose }) {
  const nav = useNavigate();
  const { items, increment, decrement, remove, clear, total } = useCart();

  if (!open) return null;

  return (
    <>
      {/* overlay */}
      <button
        aria-label="Close cart overlay"
        onClick={onClose}
        className="fixed inset-0 bg-black/10 backdrop-blur-[1px] z-40"
      />
      {/* panel */}
      <aside className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-[#fbfcee] z-50 shadow-xl border-l border-[#d3e0a9] flex flex-col">
        <div className="flex items-center justify-between px-6 h-16 border-b border-[#d3e0a9]">
          <h2 className="text-2xl font-semibold text-[#2b2b2b]">Cart</h2>
          <button
            onClick={onClose}
            className="text-xl px-2 py-1 rounded-lg hover:bg-[#e1eac4] text-[#3971b8]"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* items */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {items.map((it) => (
            <div key={it.cartItemId} className="flex gap-4">
              {" "}
              {/* Gunakan cartItemId untuk key */}
              {/* thumbnail */}
              <div className="w-28 h-28 rounded-xl overflow-hidden bg-[#d9d9d9] border border-[#e8e8e8]">
                <img
                  src={it.imageUrl || FALLBACK_IMG}
                  alt={it.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_IMG;
                  }}
                />
              </div>
              {/* info + controls */}
              <div className="flex-1">
                <p className="text-[#2b2b2b] leading-snug">
                  {it.name}
                  <br />
                  {it.variant && (
                    <span className="text-[#6b7280] text-sm">{it.variant}</span>
                  )}
                </p>

                <p className="mt-1 text-[#3971b8] font-medium">
                  {formatIDR(it.price)}
                </p>

                <div className="mt-2 inline-flex items-center border border-[#d3e0a9] rounded-lg overflow-hidden">
                  {/* --- UBAH DI SINI --- */}
                  <button
                    onClick={() => decrement(it.cartItemId)}
                    disabled={it.qty <= 1}
                    className={`px-3 py-2 ${
                      it.qty <= 1
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-[#e1eac4]"
                    }`}
                    aria-label="Kurangi"
                  >
                    –
                  </button>

                  <span className="px-4 py-2 border-x border-[#d3e0a9] select-none">
                    {it.qty}
                  </span>

                  {/* --- UBAH DI SINI --- */}
                  <button
                    onClick={() => {
                      const max = Number.isFinite(it.stock) ? it.stock : 99;
                      if (it.qty < max) increment(it.cartItemId);
                    }}
                    className="px-3 py-2 hover:bg-[#e1eac4]"
                    aria-label="Tambah"
                  >
                    +
                  </button>
                </div>

                {/* --- UBAH DI SINI --- */}
                <button
                  onClick={() => remove(it.cartItemId)}
                  className="ml-5 mt-2 text-xs text-red-600 hover:underline"
                  title="Hapus item ini"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {!items.length && (
            <p className="text-sm text-[#6b7280]">Keranjang kosong.</p>
          )}
        </div>

        {/* footer */}
        <div className="border-t border-[#d3e0a9] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6b7280]">Total</p>
              <p className="text-2xl text-[#3971b8] font-semibold">
                {formatIDR(total)}
              </p>
            </div>

            <div className="flex gap-2">
              {/* clear semua */}
              <button
                onClick={clear}
                disabled={!items.length}
                className={`rounded-xl px-4 py-3 border border-[#d3e0a9] ${
                  !items.length
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-[#e1eac4]"
                }`}
                title="Kosongkan keranjang"
              >
                Clear
              </button>

              <button
                onClick={() => {
                  onClose();
                  nav("/checkout");
                }}
                className="rounded-xl px-6 py-3 font-medium transition bg-[#3971b8] text-[#fbfcee] hover:opacity-95 active:scale-[.99]"
                disabled={!items.length}
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
