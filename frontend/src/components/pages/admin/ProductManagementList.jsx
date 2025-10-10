// ==================================================
// 📁 src/components/pages/admin/ProductManagementList.jsx
// ==================================================
import { Link } from "react-router-dom";
import AdminLayout from "../../templates/AdminLayout/AdminLayout";
import { formatIDR } from "../../../contexts/CartContext";
import { useProducts } from "../../../contexts/ProductContext";

// const MOCK = [
//   {
//     id: "p-001",
//     name: "Baju Baju baju baju – warna",
//     category: "Outerwear",
//     price: 999999,
//     stock: 45,
//   },
//   {
//     id: "p-002",
//     name: "Baju Baju baju baju – warna",
//     category: "Outerwear",
//     price: 999999,
//     stock: 45,
//   },
// ];

export default function ProductManagementList() {
  const { products } = useProducts();
  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold">Product Management</h1>
          <Link
            to="/admin/products/new"
            className="rounded-xl px-5 py-2 font-medium bg-[#3a4425] text-[#fbfcee] hover:opacity-95"
          >
            Add Product
          </Link>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-sm border border-[#d3e0a9]">
            <thead className="bg-[#eef3d7]">
              <tr>
                <th className="text-left py-3 px-4 border-b border-[#d3e0a9] w-16">
                  No
                </th>
                <th className="text-left py-3 px-4 border-b border-[#d3e0a9]">
                  Product Name
                </th>
                <th className="text-left py-3 px-4 border-b border-[#d3e0a9]">
                  Category
                </th>
                <th className="text-left py-3 px-4 border-b border-[#d3e0a9]">
                  Price
                </th>
                <th className="text-left py-3 px-4 border-b border-[#d3e0a9] w-20">
                  Stock
                </th>
                <th className="text-left py-3 px-4 border-b border-[#d3e0a9] w-28">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, idx) => (
                <tr key={p.id} className="border-b border-[#d3e0a9]">
                  <td className="py-3 px-4">{idx + 1}.</td>
                  <td className="py-3 px-4">{p.name}</td>
                  <td className="py-3 px-4 font-semibold">{p.category}</td>
                  <td className="py-3 px-4">{formatIDR(p.price)}</td>
                  <td className="py-3 px-4">{p.stock}</td>
                  <td className="py-3 px-4">
                    <Link
                      to={`/admin/products/${p.id}/edit`}
                      className="rounded-md px-4 py-1.5 bg-[#3971b8] text-[#fbfcee] hover:opacity-95"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
              {/* baris kosong buat vibe mockup */}
              {Array.from({ length: 10 - products.length }).map((_, i) => (
                <tr key={`empty-${i}`} className="border-b border-[#d3e0a9]">
                  <td className="py-6 px-4">&nbsp;</td>
                  <td className="py-6 px-4" colSpan="5">
                    &nbsp;
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
