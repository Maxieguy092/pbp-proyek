// ==================================================
// 📁 src/components/pages/admin/AdminHome.jsx
// ==================================================
import AdminLayout from "../../templates/AdminLayout/AdminLayout";

export default function AdminHome() {
  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-semibold">Product Management</h1>
        <p className="mt-2 text-[#3b6aa8]">
          Pilih menu di atas untuk mengelola produk.
        </p>
      </div>
    </AdminLayout>
  );
}
