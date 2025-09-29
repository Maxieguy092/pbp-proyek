// ==================================================
// 📁 src/components/pages/ProductDetailPage.jsx
// ==================================================
import { useParams } from "react-router-dom";
import { useState } from "react";
import MainLayout from "../templates/MainLayout/MainLayout";
import { useCart, formatIDR } from "../../contexts/CartContext";

const MOCK_PRODUCTS = {
  "baju-001": {
    id: "baju-001",
    name: "Baju Baju – Warna",
    price: 999000,
    stock: 7,
    sizes: ["S", "M", "L"],
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    images: [1, 2, 3, 4], // placeholder 4 kotak
  },
};

export default function ProductDetailPage() {
  const { id } = useParams();
  const product = MOCK_PRODUCTS[id] ?? MOCK_PRODUCTS["baju-001"]; // fallback demo
  const { addToCart } = useCart();
  const maxQty = product.stock ?? 10;
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState(product.sizes?.[0] ?? null);
  const [err, setErr] = useState("");

  const add = () => {
    if (product.sizes?.length && !size) {
      setErr("Please choose size");
      return;
    }
    if (qty < 1 || qty > maxQty) {
      setErr(`Qty must be 1–${maxQty}`);
      return;
    }
    setErr("");
    addToCart({
      id: product.id,
      name: product.name,
      variant: size ?? "-",
      price: product.price,
      qty,
      image: null,
    });
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* kiri: 4 gambar */}
          <div className="grid grid-cols-2 gap-6">
            {product.images.map((k) => (
              <div
                key={k}
                className="aspect-[1/1] rounded-2xl bg-[#d9d9d9] border border-[#e8e8e8]"
              />
            ))}
          </div>

          {/* kanan: detail */}
          <div>
            <h1 className="text-3xl font-semibold text-[#2b2b2b]">
              {product.name}
            </h1>
            <p className="mt-2 text-[#3971b8] font-medium">
              {formatIDR(product.price)}
            </p>

            <div className="mt-6">
              <p className="text-sm text-[#2b2b2b] mb-2">Size</p>
              <div className="flex gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`px-3 py-2 rounded-lg border ${
                      size === s
                        ? "bg-[#e1eac4] border-[#c8d69b]"
                        : "border-[#d3e0a9]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 inline-flex items-center border border-[#d3e0a9] rounded-lg overflow-hidden">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="px-4 py-2 hover:bg-[#e1eac4]"
              >
                -
              </button>
              <span className="px-6 py-2 border-x border-[#d3e0a9] select-none">
                {qty}
              </span>
              <button
                onClick={() => setQty(Math.min(maxQty, qty + 1))}
                className="px-4 py-2 hover:bg-[#e1eac4]"
              >
                +
              </button>
            </div>

            <div className="mt-6">
              <button
                onClick={add}
                className="w-full sm:w-64 rounded-xl px-6 py-3 font-medium transition bg-[#3971b8] text-[#fbfcee] hover:opacity-95 active:scale-[.99]"
              >
                Add to cart
              </button>
            </div>

            <div className="mt-8">
              <h2 className="text-sm font-semibold text-[#2b2b2b] mb-2">
                Description
              </h2>
              <p className="max-w-prose text-[#2b2b2b]/80 leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
