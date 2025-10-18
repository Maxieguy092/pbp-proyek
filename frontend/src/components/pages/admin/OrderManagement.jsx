// src/components/pages/admin/OrderManagement.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminLayout from "../../templates/AdminLayout/AdminLayout";
import { formatIDR } from "../../../contexts/CartContext";
import { fetchOrders, updateOrderStatus } from "../../../api/orders";

const STATUS_OPTIONS = [
  "Pending",
  "Processing",
  "Delivering",
  "Done",
  "Cancelled",
];

export default function OrderManagement() {
  const [authorized, setAuthorized] = useState(false);
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verifyAdmin() {
      try {
        const res = await fetch("/api/admin/check-session", {
          credentials: "include",
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (data.role !== "admin") {
          navigate("/");
          return;
        }
        setAuthorized(true);
      } catch {
        navigate("/");
      } finally {
        setChecked(true);
      }
    }
    verifyAdmin();
  }, [navigate]);

  useEffect(() => {
    setLoading(true);
    fetchOrders()
      .then(setOrders)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const changeStatus = (id, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
    updateOrderStatus(id, newStatus).catch((err) => {
      console.error("Gagal update:", err);
      alert("Gagal memperbarui status. Coba lagi.");
    });
  };

  if (loading)
    return (
      <AdminLayout>
        <p>Loading...</p>
      </AdminLayout>
    );

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
                <th className="text-left py-3 px-4 border-b border-[#d3e0a9] w-28">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-[#d3e0a9]">
                  <td className="py-3 px-4 font-medium">
                    ORD-{String(o.id).padStart(3, "0")}
                  </td>
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
                  <td className="py-3 px-4">
                    <Link
                      to={`/admin/orders/${o.id}`}
                      className="text-[#3b6aa8] hover:underline font-medium"
                    >
                      View Detail
                    </Link>
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
