// ==================================================
// 📁 src/components/templates/AdminLayout/AdminLayout.jsx
// ==================================================
import HeaderBar from "../../organisms/HeaderBar/HeaderBar";
import { NavLink, Link } from "react-router-dom";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#fbfcee] text-[#2b2b2b]">
      {/* tetap pakai header hijau */}
      <HeaderBar />

      {/* second navbar khusus admin */}
      <nav className="bg-[#fbfcee] border-b border-[#d3e0a9]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ul className="flex justify-center items-center gap-10 py-3 text-sm sm:text-base text-[#3971b8]">
            <li>
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) =>
                  isActive ? "underline font-medium" : "hover:opacity-90"
                }
              >
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/orders"
                className={({ isActive }) =>
                  isActive ? "underline font-medium" : "hover:opacity-90"
                }
              >
                Order Management
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/products"
                className={({ isActive }) =>
                  isActive ? "underline font-medium" : "hover:opacity-90"
                }
              >
                Product Management
              </NavLink>
            </li>
            <li>
              <Link to="/login" className="hover:opacity-90">
                Sign Out
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <main>{children}</main>
      <div className="h-10" />
    </div>
  );
}
