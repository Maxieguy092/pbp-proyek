// ==================================================
// 📁 src/components/pages/admin/OrderDetail.jsx
// ==================================================
import AdminLayout from "../../templates/AdminLayout/AdminLayout";
import { formatIDR } from "../../../contexts/CartContext";
import { useState } from "react";

export default function OrderDetail() {
  const [order, setOrder] = useState({
    id: "ORD-001",
    date: "25 September 2025",
    name: "Andi Anak Baik",
    email: "andibaik@example.com",
    phone: "0812-3456-7890",
    address: {
      name: "Andi Anak Baik",
      street: "Jalan Mulawarman Raya No. 02",
      district: "Tembalang",
      city: "Kota Semarang",
      province: "Jawa Tengah",
      postal: "50123",
    },
    status: "Processing",
    items: [
      { product: "Baju Baju Baju - Warna", qty: 1, price: 40000 },
      { product: "Baju Baju Baju - Warna", qty: 3, price: 50000 },
      { product: "Baju Baju Baju - Warna", qty: 2, price: 60000 },
    ],
  });

  const STATUS_OPTIONS = [
    "Pending",
    "Processing",
    "Delivering",
    "Done",
    "Cancelled",
  ];

  const handleStatusChange = (e) => {
    setOrder((prev) => ({ ...prev, status: e.target.value }));
  };

  const handleUpdate = () => {
    console.log("Status updated:", order.status);
    // TODO: PUT /orders/:id ke backend
  };

  const total = order.items.reduce((sum, item) => sum + item.qty * item.price, 0);

  return (
    <AdminLayout>
      <div className="mx-auto max-w-6xl px-6 py-8 text-[#1f1f1f]">
        <h1 className="text-2xl font-semibold mb-3">Orders Detail</h1>
        <hr className="border-[#d3e0a9] mb-6" />

        {/* Informasi utama */}
        <div className="border-b border-[#d3e0a9] pb-4 mb-6 text-sm">
        {/* Status dipisah pakai flex */}
        <div className="flex justify-between items-start mb-4">
            <div className="grid grid-cols-2 gap-y-3 gap-x-8">
            <div>
                <p className="font-semibold">Order Id</p>
                <p>{order.id}</p>
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
                <p>{order.phone}</p>
            </div>
            </div>

            {/* Status di kanan atas */}
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

        {/* Kontainer tabel + alamat */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Tabel Produk */}
          <div className="flex-1">
            <table className="min-w-full text-sm border border-[#d3e0a9]">
              <thead className="bg-[#eef3d7]">
                <tr>
                  <th className="text-left py-3 px-4 border-b border-[#d3e0a9]">Product</th>
                  <th className="text-left py-3 px-4 border-b border-[#d3e0a9]">Qty</th>
                  <th className="text-left py-3 px-4 border-b border-[#d3e0a9]">Price</th>
                  <th className="text-left py-3 px-4 border-b border-[#d3e0a9]">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, i) => (
                  <tr key={i} className="border-b border-[#d3e0a9]">
                    <td className="py-3 px-4">{item.product}</td>
                    <td className="py-3 px-4">{item.qty}</td>
                    <td className="py-3 px-4">{formatIDR(item.price)}</td>
                    <td className="py-3 px-4">{formatIDR(item.price * item.qty)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4 text-right font-semibold text-base">
              Total: {formatIDR(total)}
            </div>
          </div>

          {/* Alamat di samping tabel */}
          <div className="w-full lg:w-64 border border-[#d3e0a9] bg-[#fbfcee] rounded-lg p-4 text-sm">
            <p className="font-semibold mb-2">Address</p>
            <p>{order.address.name}</p>
            <p>{order.address.street}</p>
            <p>{order.address.district}</p>
            <p>{order.address.city}</p>
            <p>{order.address.province}</p>
            <p>{order.address.postal}</p>
          </div>
        </div>

        {/* Tombol navigasi & update */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={() => window.history.back()}
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
