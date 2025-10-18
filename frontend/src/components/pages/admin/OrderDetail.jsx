// ==================================================
// 📁 src/components/pages/admin/OrderDetail.jsx
// ==================================================
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../templates/AdminLayout/AdminLayout";
import { formatIDR } from "../../../contexts/CartContext";
import { fetchOrderById, updateOrderStatus } from "../../../api/orders";

export default function OrderDetail() {
  // Ambil ID pesanan dari URL
  const { id: orderId } = useParams();
  const navigate = useNavigate();

  // State untuk menyimpan data pesanan, loading, dan error
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Opsi untuk dropdown status
  const STATUS_OPTIONS = [
    "Pending",
    "Processing",
    "Delivering",
    "Done",
    "Cancelled",
  ];

  // Ambil data dari backend saat komponen dimuat
  useEffect(() => {
    if (!orderId) return;

    setLoading(true);
    fetchOrderById(orderId)
      .then((data) => {
        // Alamat dari backend adalah string JSON, kita parse di sini
        const parsedAddress = JSON.parse(data.address || "{}");
        setOrder({ ...data, addressData: parsedAddress });
      })
      .catch((err) => {
        console.error(err);
        setError("Gagal memuat data pesanan.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [orderId]);

  // Fungsi untuk mengubah state saat dropdown dipilih
  const handleStatusChange = (e) => {
    setOrder((prev) => ({ ...prev, status: e.target.value }));
  };

  // Fungsi untuk mengirim update status ke backend
  const handleUpdate = () => {
    updateOrderStatus(order.id, order.status)
      .then(() => alert("Status berhasil diupdate!"))
      .catch((err) => alert("Gagal update status: " + err.message));
  };

  if (loading) {
    return (
      <AdminLayout>
        <p className="text-center p-10">Loading order details...</p>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <p className="text-center p-10 text-red-600">{error}</p>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <p className="text-center p-10">Pesanan tidak ditemukan.</p>
      </AdminLayout>
    );
  }

  // Hitung total harga
  const total = order.items.reduce(
    (sum, item) => sum + item.qty * item.price,
    0
  );

  return (
    <AdminLayout>
      <div className="mx-auto max-w-6xl px-6 py-8 text-[#1f1f1f]">
        <h1 className="text-2xl font-semibold mb-3">Orders Detail</h1>
        <hr className="border-[#d3e0a9] mb-6" />

        <div className="border-b border-[#d3e0a9] pb-4 mb-6 text-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="grid grid-cols-2 gap-y-3 gap-x-8">
              <div>
                <p className="font-semibold">Order Id</p>
                <p>ORD-{String(order.id).padStart(3, "0")}</p>
              </div>
              <div className="pl-12">
                <p className="font-semibold">Order Date</p>
                <p>{order.date}</p>
              </div>
              <div>
                <p className="font-semibold">Nama</p>
                <p>{order.name}</p>
              </div>
              <div className="pl-12">
                <p className="font-semibold">Email</p>
                <p>{order.email}</p>
              </div>
              <div className="col-span-2">
                <p className="font-semibold">Phone Number</p>
                <p>{order.addressData.phone || "-"}</p>
              </div>
            </div>

            <div className="self-start mt-1 ml-12">
              <p className="font-semibold">Status</p>
              <select
                value={order.status}
                onChange={handleStatusChange}
                className="mt-1 rounded-lg border border-[#d3e0a9] bg-[#fbfcee] px-3 py-1 text-sm outline-none focus:border-[#3971b8]"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <table className="min-w-full text-sm border border-[#d3e0a9]">
              <thead className="bg-[#eef3d7]">
                <tr>
                  <th className="text-left py-3 px-4 border-b border-[#d3e0a9]">
                    Product
                  </th>
                  <th className="text-left py-3 px-4 border-b border-[#d3e0a9]">
                    Qty
                  </th>
                  <th className="text-left py-3 px-4 border-b border-[#d3e0a9]">
                    Price
                  </th>
                  <th className="text-left py-3 px-4 border-b border-[#d3e0a9]">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, i) => (
                  <tr key={i} className="border-b border-[#d3e0a9]">
                    <td className="py-3 px-4">{item.product}</td>
                    <td className="py-3 px-4">{item.qty}</td>
                    <td className="py-3 px-4">{formatIDR(item.price)}</td>
                    <td className="py-3 px-4">
                      {formatIDR(item.price * item.qty)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 text-right font-semibold text-base">
              Total: {formatIDR(total)}
            </div>
          </div>

          <div className="w-full lg:w-64 border border-[#d3e0a9] bg-[#fbfcee] rounded-lg p-4 text-sm">
            <p className="font-semibold mb-2">Address</p>
            <p>{order.addressData.name}</p>
            <p>{order.addressData.street}</p>
            <p>{order.addressData.district}</p>
            <p>{order.addressData.city}</p>
            <p>{order.addressData.province}</p>
            <p>{order.addressData.postal}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <button
            onClick={() => navigate(-1)}
            className="bg-[#f1f3e4] text-[#394b2b] px-5 py-2 rounded-md hover:bg-[#e6ead2] transition font-medium"
          >
            ← Back
          </button>
          <button
            onClick={handleUpdate}
            className="bg-[#394b2b] text-white px-5 py-2 rounded-md hover:bg-[#4f643a] transition font-semibold"
          >
            Update Status
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
