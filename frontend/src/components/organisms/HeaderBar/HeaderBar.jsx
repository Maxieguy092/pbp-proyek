import { useState } from "react";
import { Link } from "react-router-dom";
import SearchDropdown from "../../molecules/SearchDropdown/SearchDropdown";
import CartDrawer from "../../molecules/CartDrawer/CartDrawer";
import { useUser } from "../../../contexts/UserContext";
import { useCart } from "../../../contexts/CartContext";

const IconSearch = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IconCart = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 12.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const IconUser = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M20 21a8 8 0 0 0-16 0" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export default function HeaderBar() {
  const [openSearch, setOpenSearch] = useState(false);
  const { user } = useUser();
  const { openCart, count } = useCart();

  const dashboardPath = user
    ? user.role === "admin"
      ? "/admin/dashboard"
      : "/dashboard/profile"
    : "/login";

  return (
    <header className="w-full bg-[#c8d69b] sticky top-0 z-50 border-b border-[#d3e0a9] text-[#3971b8]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <Link
            to="/"
            className="text-xl sm:text-2xl font-bold tracking-wide select-none"
          >
            Kelompok 1's Mini-Commerce
          </Link>
          <div className="flex items-center gap-4">
            <button
              aria-label="Cari"
              onClick={() => setOpenSearch(true)}
              className="p-2 rounded-xl hover:bg-[#e1eac4] transition"
            >
              <IconSearch />
            </button>

            {/* CART membuka drawer */}
            <button
              aria-label={`Keranjang dengan ${count} item`}
              onClick={openCart}
              className="p-2 rounded-xl hover:bg-[#e1eac4] transition relative"
            >
              <IconCart />
              {/* Tampilkan jumlah item di keranjang */}
              {count > 0 && (
                <span className="absolute -top-1 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#fbfcee] text-xs text-[#3971b8]">
                  {count}
                </span>
              )}
            </button>

            <Link
              to={dashboardPath}
              aria-label="Akun"
              className="p-2 rounded-xl hover:bg-[#e1eac4] transition"
            >
              <IconUser />
            </Link>
          </div>
        </div>
      </div>
      <div className="w-full bg-[#fbfcee] border-t border-[#d3e0a9]" />

      <SearchDropdown open={openSearch} onClose={() => setOpenSearch(false)} />
      <CartDrawer />
    </header>
  );
}
