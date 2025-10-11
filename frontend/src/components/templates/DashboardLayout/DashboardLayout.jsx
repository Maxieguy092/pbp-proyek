// ==================================================
// 📁 src/components/templates/DashboardLayout/DashboardLayout.jsx
// ==================================================
import { useEffect, useState } from "react"; // ← 1. Impor hook
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import MainLayout from "../MainLayout/MainLayout";

export default function DashboardLayout() {
  const navigate = useNavigate();
  // 2. Buat state untuk menyimpan data user
  const [user, setUser] = useState(null);

  // 3. Ambil data user saat komponen dimuat
  useEffect(() => {
    fetch("/api/me", {
      // Asumsi endpoint ini ada dan mengembalikan data user
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Not authenticated");
        }
        return res.json();
      })
      .then((data) => {
        // Misal, data yang kembali adalah { firstName, lastName, email }
        setUser(data);
      })
      .catch(() => {
        // Jika gagal (sesi tidak valid), redirect ke login
        navigate("/login");
      });
  }, [navigate]);

  const logoutHandler = (e) => {
    e.preventDefault();
    fetch("/api/logout", {
      // ← Ganti URL ke path relatif
      method: "POST",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Logout failed");
        return res.json();
      })
      .then(() => {
        navigate("/login");
      })
      .catch((err) => {
        console.error("Error during logout:", err);
      });
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* sidebar */}
          <aside>
            <h2 className="text-2xl font-semibold mb-6 text-[#2b2b2b]">
              {/* 4. Tampilkan nama user secara dinamis */}
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
                onClick={logoutHandler}
                className="text-left text-[#6b7280] hover:text-red-500"
              >
                Sign out
              </button>
            </nav>
          </aside>

          {/* konten kanan */}
          <main className="md:col-span-3">
            {/* 5. Teruskan data user ke komponen anak */}
            {user && <Outlet context={{ user }} />}
          </main>
        </div>
      </div>
    </MainLayout>
  );
}
