// ==================================================
// 📁 src/components/pages/admin/ProductForm.jsx
// ==================================================
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../templates/AdminLayout/AdminLayout";
import ConfirmModal from "../../molecules/ConfirmModal/ConfirmModal";
import { formatIDR } from "../../../contexts/CartContext";

const mockFind = (id) =>
  id === "p-001"
    ? {
        id,
        name: "Baju baju baju – warna",
        category: "Outerwear",
        price: 999000,
        stock: 45,
        description: "Lorem ipsum dolor sit amet…",
        images: [1, 2, 3, 4],
      }
    : {
        id,
        name: "",
        category: "",
        price: 0,
        stock: 0,
        description: "",
        images: [],
      };

export default function ProductForm() {
  const nav = useNavigate();
  const { id } = useParams(); // undefined kalau /new
  const isEdit = Boolean(id);
  const initial = useMemo(
    () => (isEdit ? mockFind(id) : mockFind("")),
    [isEdit, id]
  );

  const [form, setForm] = useState({
    name: initial.name,
    category: initial.category,
    price: initial.price,
    stock: initial.stock,
    description: initial.description,
  });
  const [showConfirm, setShowConfirm] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = (e) => {
    e.preventDefault();
    // TODO: call API create/update
    nav("/admin/products");
  };
  const del = () => {
    setShowConfirm(false);
    // TODO: call API delete
    nav("/admin/products");
  };

  return (
    <AdminLayout>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={save} className="space-y-8">
          {/* Product Name */}
          <section>
            <h3 className="text-xl font-semibold mb-2">Product Name</h3>
            <input
              value={form.name}
              onChange={set("name")}
              required
              className="w-full rounded-xl border border-[#e5e8d2] bg-[#fbfcee] px-4 py-3 outline-none focus:border-[#3971b8]"
              placeholder="Nama Produk"
            />
          </section>

          {/* Category, Price, Stock */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">Category</h3>
              <select
                value={form.category}
                onChange={set("category")}
                required
                className="w-full rounded-xl border border-[#e5e8d2] bg-[#fbfcee] px-4 py-3 outline-none focus:border-[#3971b8]"
              >
                <option value="">— Choose —</option>
                <option>Shirts</option>
                <option>T-Shirts</option>
                <option>Pants</option>
                <option>Outerwear</option>
              </select>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Price</h3>
              <input
                type="number"
                value={form.price}
                onChange={set("price")}
                className="w-full rounded-xl border border-[#e5e8d2] bg-[#fbfcee] px-4 py-3 outline-none focus:border-[#3971b8]"
                placeholder={formatIDR(0)}
              />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Stock</h3>
              <input
                type="number"
                value={form.stock}
                onChange={set("stock")}
                className="w-full rounded-xl border border-[#e5e8d2] bg-[#fbfcee] px-4 py-3 outline-none focus:border-[#3971b8]"
                placeholder="0"
              />
            </div>
          </section>

          {/* Description */}
          <section>
            <h3 className="text-xl font-semibold mb-2">Description</h3>
            <textarea
              rows={4}
              value={form.description}
              onChange={set("description")}
              className="w-full rounded-xl border border-[#e5e8d2] bg-[#fbfcee] px-4 py-3 outline-none focus:border-[#3971b8]"
              placeholder="…"
            />
          </section>

          {/* Upload Image (mock) */}
          <section>
            <h3 className="text-xl font-semibold mb-2">Upload Image</h3>
            {isEdit ? (
              <div className="flex gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-28 h-20 rounded-xl bg-[#d9d9d9] border border-[#e8e8e8]"
                  />
                ))}
              </div>
            ) : (
              <div className="w-full rounded-xl border border-[#e5e8d2] bg-[#fbfcee] p-6 flex justify-center">
                <button
                  type="button"
                  className="rounded-xl px-5 py-2 font-medium bg-[#3a4425] text-[#fbfcee]"
                >
                  Choose File
                </button>
              </div>
            )}
          </section>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="rounded-xl px-8 py-3 font-medium bg-[#3a4425] text-[#fbfcee]/90 hover:opacity-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl px-8 py-3 font-medium bg-[#3971b8] text-[#fbfcee] hover:opacity-95"
            >
              Save
            </button>
            {isEdit && (
              <button
                type="button"
                onClick={() => setShowConfirm(true)}
                className="rounded-xl px-8 py-3 font-medium bg-[#e11d1d] text-white hover:opacity-95"
              >
                Delete
              </button>
            )}
          </div>
        </form>
      </div>

      {/* modal confirm delete */}
      <ConfirmModal
        open={showConfirm}
        message="Do you really want to delete this product? This process cannot be undone."
        onCancel={() => setShowConfirm(false)}
        onConfirm={del}
      />
    </AdminLayout>
  );
}
