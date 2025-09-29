// ==================================================
// 📁 File: src/components/pages/Dashboard/OrdersPage.jsx
// ==================================================
export default function OrdersPage() {
  const orders = [
    {
      id: "XYZ123",
      product: "Baju Baju Baju – Warna",
      date: "25 Sep 2025",
      price: 999999,
      status: "Done",
    },
    {
      id: "XYZ123",
      product: "Baju baju baju – warna…",
      date: "26 Sep 2025",
      price: 999999,
      status: "Delivering",
    },
    {
      id: "XYZ123",
      product: "Baju – warna, celana – warna",
      date: "26 Sep 2025",
      price: 999999,
      status: "Delivering",
    },
  ];

  const formatIDR = (n) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(n);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold border-b border-[#d3e0a9] pb-2">
          Orders
        </h1>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-[#d3e0a9]">
              <th className="text-left py-2 px-3 font-medium">Order Id</th>
              <th className="text-left py-2 px-3 font-medium">Product</th>
              <th className="text-left py-2 px-3 font-medium">Date</th>
              <th className="text-left py-2 px-3 font-medium">Price</th>
              <th className="text-left py-2 px-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o, i) => (
              <tr key={i} className="border-b border-[#d3e0a9]">
                <td className="py-2 px-3">{o.id}</td>
                <td className="py-2 px-3">{o.product}</td>
                <td className="py-2 px-3">{o.date}</td>
                <td className="py-2 px-3">{formatIDR(o.price)}</td>
                <td className="py-2 px-3">
                  {o.status === "Done" ? (
                    <span className="px-3 py-1 rounded-full bg-[#c8d69b] text-[#2b2b2b] text-xs">
                      Done
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-[#d0e0f5] text-[#2b2b2b] text-xs">
                      Delivering
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
