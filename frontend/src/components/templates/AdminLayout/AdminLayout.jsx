// src/components/templates/AdminLayout/AdminLayout.jsx
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import HeaderBar from "../../organisms/HeaderBar/HeaderBar";
import ConfirmModal from "../../molecules/ConfirmModal/ConfirmModal";

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    fetch("/api/logout", {
      method: "POST",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Logout failed");
        navigate("/login");
      })
      .catch((err) => console.error("Error during logout:", err));
  };

  return (
    <div className="min-h-screen bg-[#fbfcee] text-[#2b2b2b]">
      <ConfirmModal
        open={isModalOpen}
        title="Sign Out"
        message="Apakah anda yakin ingin sign out?"
        onCancel={() => setIsModalOpen(false)}
        onConfirm={handleLogout}
        confirmText="Sign Out"
      />

      <HeaderBar />

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
              <button
                onClick={() => setIsModalOpen(true)}
                className="hover:text-red-500 transition"
              >
                Sign Out
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <main>{children}</main>
      <div className="h-10" />
    </div>
  );
}
