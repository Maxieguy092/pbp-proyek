import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import HomePage from "./components/pages/HomePage.jsx";
import ShirtsPage from "./components/pages/ShirtsPage.jsx";
import TShirtsPage from "./components/pages/TShirtsPage.jsx";
import PantsPage from "./components/pages/PantsPage.jsx";
import OuterwearPage from "./components/pages/OuterwearPage.jsx";
import LoginPage from "./components/pages/LoginPage.jsx";
import SignupPage from "./components/pages/SignupPage.jsx";
import SearchPage from "./components/pages/SearchPage.jsx";
import CheckoutPage from "./components/pages/CheckoutPage.jsx";
import { CartProvider } from "./contexts/CartContext.jsx";
import DashboardLayout from "./components/templates/DashboardLayout/DashboardLayout.jsx";
import ProfilePage from "./components/pages/Dashboard/ProfilePage.jsx";
import OrdersPage from "./components/pages/Dashboard/OrdersPage.jsx";
import ProductDetailPage from "./components/pages/ProductDetailPage.jsx";
import AdminHome from "./components/pages/admin/AdminHome.jsx";
import ProductManagementList from "./components/pages/admin/ProductManagementList.jsx";
import ProductForm from "./components/pages/admin/ProductForm.jsx";
import OrderManagement from "./components/pages/admin/OrderManagement.jsx";

const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/shirts", element: <ShirtsPage /> },
  { path: "/t-shirts", element: <TShirtsPage /> },
  { path: "/pants", element: <PantsPage /> },
  { path: "/outerwear", element: <OuterwearPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/signup", element: <SignupPage /> },
  { path: "/search", element: <SearchPage /> },
  { path: "/checkout", element: <CheckoutPage /> },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      { path: "profile", element: <ProfilePage /> },
      { path: "orders", element: <OrdersPage /> },
    ],
  },
  { path: "/products/:id", element: <ProductDetailPage /> },
  { path: "/admin/dashboard", element: <AdminHome /> },
  { path: "/admin/products", element: <ProductManagementList /> },
  { path: "/admin/products/new", element: <ProductForm /> },
  { path: "/admin/products/:id/edit", element: <ProductForm /> },
  { path: "/admin/orders", element: <OrderManagement /> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  </StrictMode>
);
