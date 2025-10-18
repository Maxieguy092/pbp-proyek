// ==================================================
// 📁 src/components/templates/DashboardLayout/DashboardLayout.jsx
// ==================================================
import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import MainLayout from "../MainLayout/MainLayout";
import ConfirmModal from "../../molecules/ConfirmModal/ConfirmModal";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch("/api/me", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then(setUser)
      .catch(() => navigate("/login"));
  }, [navigate]);

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
    <MainLayout>
      {/* Panggil modal dengan props yang sesuai */}
      <ConfirmModal
        open={isModalOpen}
        title="Sign Out"
        message="Apakah anda yakin ingin sign out?"
        onCancel={() => setIsModalOpen(false)}
        onConfirm={handleLogout}
        confirmText="Sign Out" // Gunakan prop confirmText
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <aside>
            <h2 className="text-2xl font-semibold mb-6 text-[#2b2b2b]">
              Hi, {user ? user.firstName : "..."}
            </h2>
            <nav className="flex flex-col space-y-4 text-[#2b2b2b]">
              <NavLink
                to="/dashboard/profile"
                className={({ isActive }) =>
                  `transition hover:opacity-80 ${
                    isActive ? "underline font-medium" : ""
                  }`
                }
              >
                Personal Information
              </NavLink>
              <NavLink
                to="/dashboard/orders"
                className={({ isActive }) =>
                  `transition hover:opacity-80 ${
                    isActive ? "underline font-medium" : ""
                  }`
                }
              >
                Orders
              </NavLink>

              <button
                onClick={() => setIsModalOpen(true)}
                className="text-left text-[#6b7280] hover:text-red-500 transition"
              >
                Sign out
              </button>
            </nav>
          </aside>

          <main className="md:col-span-3">
            {user && <Outlet context={{ user }} />}
          </main>
        </div>
      </div>
    </MainLayout>
  );
}
