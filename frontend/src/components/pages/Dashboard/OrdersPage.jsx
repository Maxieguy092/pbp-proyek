// ==================================================
// 📁 File: src/components/pages/Dashboard/OrdersPage.jsx
// ==================================================
import { useState, useEffect } from "react";
import { useUser } from "../../../contexts/UserContext";

// Fungsi format mata uang
const formatIDR = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

// Komponen StatusBadge (tidak ada perubahan)
const StatusBadge = ({ status }) => {
  const statusStyles = {
    Pending: "bg-yellow-100 text-yellow-800",
    Processing: "bg-blue-100 text-blue-800",
    Delivering: "bg-indigo-100 text-indigo-800",
    Done: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        statusStyles[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
};

// ================================================================
// KOMPONEN BARU: Untuk menampilkan detail alamat yang sudah diparsing
// ================================================================
const AddressDetails = ({ addressText }) => {
  try {
    // Parsing string JSON menjadi objek JavaScript
    const address = JSON.parse(addressText);
    return (
      <div className="text-sm text-gray-700">
        <p className="font-semibold">{address.name}</p>
        <p>{address.street}</p>
        <p>
          {address.district}, {address.city}
        </p>
        <p>
          {address.province}, {address.postal}
        </p>
        <p className="mt-2">
          <strong>Phone:</strong> {address.phone}
        </p>
      </div>
    );
  } catch (error) {
    // Jika parsing gagal, tampilkan teks aslinya
    return <p className="text-sm text-red-500">Invalid address format.</p>;
  }
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  // useEffect untuk fetch data (tidak ada perubahan)
  useEffect(() => {
    if (user) {
      async function fetchOrders() {
        try {
          const response = await fetch("/api/my-orders", {
            credentials: "include",
          });
          if (!response.ok) {
            throw new Error("Gagal mengambil data pesanan");
          }
          const data = await response.json();
          setOrders(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <div>Loading your orders...</div>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold border-b border-[#d3e0a-9] pb-2">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <p className="mt-4 text-gray-600">You have no orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border border-[#d3e0a9] rounded-lg shadow-sm"
            >
              {/* Header Kartu */}
              <div className="bg-[#f8f9f2] p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-[#d3e0a9]">
                <div>
                  <p className="font-semibold text-lg">Order #{order.id}</p>
                  <p className="text-sm text-gray-600">Date: {order.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">{formatIDR(order.total)}</p>
                  <StatusBadge status={order.status} />
                </div>
              </div>

              {/* Body Kartu */}
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Kolom Kiri: Daftar Produk */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Items Purchased</h3>
                  {order.items.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-md border"
                      />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.qty} x {formatIDR(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Kolom Kanan: Detail Pengiriman & Pembayaran */}
                <div className="space-y-6 bg-gray-50 border border-[#d3e0a9] p-4 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      Shipping Details
                    </h3>
                    {/* Gunakan komponen AddressDetails */}
                    <AddressDetails addressText={order.addressText} />
                  </div>
                  <hr />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      Payment Information
                    </h3>
                    <div className="text-sm">
                      <p>
                        <strong>Method:</strong> {order.paymentOption}
                      </p>
                      {/* Tampilkan detail pembayaran jika ada */}
                      {order.paymentDetails && (
                        <p>
                          <strong>Details:</strong> {order.paymentDetails}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
