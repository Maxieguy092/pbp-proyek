// ==================================================
// 📁 src/components/templates/DashboardLayout/DashboardLayout.jsx
// ==================================================
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import MainLayout from "../MainLayout/MainLayout"; // ← pakai layout yang sama

export default function DashboardLayout() {
  const navigate = useNavigate();
  const logoutHandler = (e) => {
    e.preventDefault();

    fetch("http://localhost:5000/api/logout", {
      method: "POST",
      credentials: "include", // include cookies/session
    })
      .then((res) => {
        if (!res.ok) throw new Error("Logout failed");
        return res.json();
      })
      .then((data) => {
        console.log("Logged out:", data);
        // Optionally redirect to login or homepage
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
              Hi, Example
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
              <button onClick={logoutHandler} className="text-left text-[#6b7280] hover:opacity-80">
                Sign out
              </button>
            </nav>
          </aside>

          {/* konten kanan */}
          <main className="md:col-span-3">
            <Outlet />
          </main>
        </div>
      </div>
    </MainLayout>
  );
}
