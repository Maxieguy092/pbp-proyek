// ==================================================
// 📁 src/components/pages/admin/AdminHome.jsx
// ==================================================
import { useState, useEffect } from "react";
import AdminLayout from "../../templates/AdminLayout/AdminLayout";
import { formatIDR } from "../../../contexts/CartContext";

const IconOrder = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="42"
    height="42"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M8 12h8M12 8v8" />
  </svg>
);

const IconPending = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="42"
    height="42"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const IconDone = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="42"
    height="42"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

export default function AdminHome() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // ambil mock data order dari OrderManagement.jsx
    const MOCK_ORDERS = [
      {
        id: "ORD-001",
        customer: "Ganteng",
        total: 1999000,
        address: "Jl. Diponegoro No. 1",
        status: "Pending",
        date: "28 Sep 2025",
      },
      {
        id: "ORD-002",
        customer: "Andi",
        total: 2999000,
        address: "Jl. Pandanaran No. 5",
        status: "Processing",
        date: "28 Sep 2025",
      },
      {
        id: "ORD-003",
        customer: "Budi",
        total: 1599000,
        address: "Jl. Undip Raya",
        status: "Delivering",
        date: "27 Sep 2025",
      },
    ];
    setOrders(MOCK_ORDERS);
  }, []);

  const totalOrders = orders.length;
  const totalPending = orders.filter((o) => o.status === "Pending").length;
  const totalDone = orders.filter((o) => o.status === "Done").length;

  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-semibold mb-2">Admin Dashboard</h1>
        <p className="text-[#3b6aa8] mb-8">
          Ringkasan aktivitas dan jumlah pesanan terkini.
        </p>

        {/* --- Kartu Statistik --- */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {/* Total Orders */}
          <div className="rounded-2xl bg-[#eef3d7] border border-[#d3e0a9] p-6 flex items-center justify-between hover:shadow-md transition">
            <div>
              <h2 className="text-lg font-medium text-[#3a4425]">
                Total Orders
              </h2>
              <p className="text-3xl font-bold mt-2 text-[#3971b8]">
                {totalOrders}
              </p>
            </div>
            <IconOrder className="text-[#3a4425]/70" />
          </div>

          {/* Pending Orders */}
          <div className="rounded-2xl bg-[#eef3d7] border border-[#d3e0a9] p-6 flex items-center justify-between hover:shadow-md transition">
            <div>
              <h2 className="text-lg font-medium text-[#3a4425]">Pending</h2>
              <p className="text-3xl font-bold mt-2 text-[#e6a700]">
                {totalPending}
              </p>
            </div>
            <IconPending className="text-[#3a4425]/70" />
          </div>

          {/* Completed Orders */}
          <div className="rounded-2xl bg-[#eef3d7] border border-[#d3e0a9] p-6 flex items-center justify-between hover:shadow-md transition">
            <div>
              <h2 className="text-lg font-medium text-[#3a4425]">Completed</h2>
              <p className="text-3xl font-bold mt-2 text-[#3a8c3a]">
                {totalDone}
              </p>
            </div>
            <IconDone className="text-[#3a4425]/70" />
          </div>
        </div>

        {/* --- Recent Activity --- */}
        <div className="rounded-2xl border border-[#d3e0a9] bg-[#fbfcee] shadow-sm">
          <div className="p-6 border-b border-[#d3e0a9] flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[#3a4425]">
              Recent Activity
            </h2>
            <p className="text-sm text-[#3b6aa8]">
              {orders.length} latest orders
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#eef3d7] border-b border-[#d3e0a9]">
                <tr>
                  <th className="text-left py-3 px-4">Order ID</th>
                  <th className="text-left py-3 px-4">Customer</th>
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Address</th>
                  <th className="text-left py-3 px-4">Total</th>
                  <th className="text-left py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr
                    key={o.id}
                    className="border-b border-[#d3e0a9] hover:bg-[#f7f9ec]"
                  >
                    <td className="py-3 px-4 font-medium text-[#3971b8]">
                      {o.id}
                    </td>
                    <td className="py-3 px-4">{o.customer}</td>
                    <td className="py-3 px-4">{o.date}</td>
                    <td className="py-3 px-4">{o.address}</td>
                    <td className="py-3 px-4">{formatIDR(o.total)}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          o.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : o.status === "Processing"
                            ? "bg-blue-100 text-blue-800"
                            : o.status === "Delivering"
                            ? "bg-purple-100 text-purple-800"
                            : o.status === "Done"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
