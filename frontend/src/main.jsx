// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

// --- Impor semua komponen halaman Anda ---
import HomePage from "./components/pages/HomePage.jsx";
import ShirtsPage from "./components/pages/ShirtsPage.jsx";
import TShirtsPage from "./components/pages/TShirtsPage.jsx";
import PantsPage from "./components/pages/PantsPage.jsx";
import OuterwearPage from "./components/pages/OuterwearPage.jsx";
import LoginPage from "./components/pages/LoginPage.jsx";
import SignupPage from "./components/pages/SignupPage.jsx";
import SearchPage from "./components/pages/SearchPage.jsx";
import CheckoutPage from "./components/pages/CheckoutPage.jsx";
import ProductDetailPage from "./components/pages/ProductDetailPage.jsx";

import DashboardLayout from "./components/templates/DashboardLayout/DashboardLayout.jsx";
import ProfilePage from "./components/pages/Dashboard/ProfilePage.jsx";
import OrdersPage from "./components/pages/Dashboard/OrdersPage.jsx";
// import OrderDetail from "./components/pages/admin/OrderDetail.jsx";

import AdminHome from "./components/pages/admin/AdminHome.jsx";
import ProductManagementList from "./components/pages/admin/ProductManagementList.jsx";
import ProductForm from "./components/pages/admin/ProductForm.jsx";
import OrderManagement from "./components/pages/admin/OrderManagement.jsx";
import OrderDetail from "./components/pages/admin/OrderDetail.jsx";

// --- Impor semua Provider Anda ---
import { CartProvider } from "./contexts/CartContext.jsx";
import { UserProvider } from "./contexts/UserContext.jsx";
import { ProductProvider } from "./contexts/ProductContext.jsx";

// --- Komponen Error & 404 ---
function GlobalError() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 text-center">
      <div>
        <h1 className="text-2xl font-semibold">Terjadi kesalahan</h1>
        <p className="text-gray-600 mt-2">Coba muat ulang halaman ya.</p>
      </div>
    </div>
  );
}
function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 text-center">
      <div>
        <h1 className="text-3xl font-semibold">
          404 — Halaman tidak ditemukan
        </h1>
      </div>
    </div>
  );
}

// --- Konfigurasi Router (tidak ada perubahan di sini) ---
const router = createBrowserRouter(
  [
    { path: "/", element: <HomePage /> },
    { path: "/shirts", element: <ShirtsPage /> },
    { path: "/t-shirts", element: <TShirtsPage /> },
    { path: "/pants", element: <PantsPage /> },
    { path: "/outerwear", element: <OuterwearPage /> },

    { path: "/login", element: <LoginPage /> },
    { path: "/signup", element: <SignupPage /> },

    { path: "/search", element: <SearchPage /> },
    { path: "/checkout", element: <CheckoutPage /> },

    { path: "/products/:id", element: <ProductDetailPage /> },

    {
      path: "/dashboard",
      element: <DashboardLayout />,
      children: [
        { path: "profile", element: <ProfilePage /> },
        { path: "orders", element: <OrdersPage /> },
      ],
    },

    // Admin
    { path: "/admin/dashboard", element: <AdminHome /> },
    { path: "/admin/products", element: <ProductManagementList /> },
    { path: "/admin/products/new", element: <ProductForm /> },
    { path: "/admin/products/:id/edit", element: <ProductForm /> },
    { path: "/admin/orders", element: <OrderManagement /> },
    { path: "/admin/orders/:id", element: <OrderDetail /> },

    { path: "*", element: <NotFound /> },
  ],
  { basename: import.meta.env.BASE_URL || "/" }
);

// ================================================================
// BAGIAN YANG DIPERBAIKI
// ================================================================

// Buat komponen App untuk membungkus semua Provider di satu tempat
function App() {
  return (
    <UserProvider>
      <ProductProvider>
        <CartProvider>
          <RouterProvider router={router} fallbackElement={<GlobalError />} />
        </CartProvider>
      </ProductProvider>
    </UserProvider>
  );
}

// Render komponen App yang sudah berisi semua Provider
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);