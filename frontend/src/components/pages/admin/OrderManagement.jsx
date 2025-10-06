// ==================================================
// 📁 src/components/pages/admin/OrderManagement.jsx
// ==================================================
import { useState } from "react";
import AdminLayout from "../../templates/AdminLayout/AdminLayout";
import { formatIDR } from "../../../contexts/CartContext";

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

const STATUS_OPTIONS = [
  "Pending",
  "Processing",
  "Delivering",
  "Done",
  "Cancelled",
];

export default function OrderManagement() {
  const [orders, setOrders] = useState(MOCK_ORDERS);

  const changeStatus = (id, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
    // TODO: panggil API PUT /orders/:id utk update status
  };

  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-semibold">Order Management</h1>
        <p className="mt-2 text-[#3b6aa8]">
          Lihat dan kelola status pesanan pelanggan.
        </p>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-sm border border-[#d3e0a9]">
            <thead className="bg-[#eef3d7]">
              <tr>
                <th className="text-left py-3 px-4 border-b border-[#d3e0a9]">
                  Order ID
                </th>
                <th className="text-left py-3 px-4 border-b border-[#d3e0a9]">
                  Customer
                </th>
                <th className="text-left py-3 px-4 border-b border-[#d3e0a9]">
                  Date
                </th>
                <th className="text-left py-3 px-4 border-b border-[#d3e0a9]">
                  Address
                </th>
                <th className="text-left py-3 px-4 border-b border-[#d3e0a9]">
                  Total
                </th>
                <th className="text-left py-3 px-4 border-b border-[#d3e0a9] w-40">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-[#d3e0a9]">
                  <td className="py-3 px-4 font-medium">{o.id}</td>
                  <td className="py-3 px-4">{o.customer}</td>
                  <td className="py-3 px-4">{o.date}</td>
                  <td className="py-3 px-4">{o.address}</td>
                  <td className="py-3 px-4">{formatIDR(o.total)}</td>
                  <td className="py-3 px-4">
                    <select
                      value={o.status}
                      onChange={(e) => changeStatus(o.id, e.target.value)}
                      className="rounded-lg border border-[#d3e0a9] bg-[#fbfcee] px-2 py-1 outline-none focus:border-[#3971b8]"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
