// ==================================================
// 📁 src/components/pages/admin/ProductForm.jsx
// ==================================================
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../templates/AdminLayout/AdminLayout";
import ConfirmModal from "../../molecules/ConfirmModal/ConfirmModal";
import { formatIDR } from "../../../contexts/CartContext";
import { useProducts } from "../../../contexts/ProductContext";
import { useMemo, useState, useEffect } from "react";



export default function ProductForm() {
  const nav = useNavigate();
  const { id } = useParams(); // undefined kalau /new
  const isEdit = Boolean(id);
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();

  const productId = Number(id);
  const existing = useMemo(
    () => products.find((p) => p.id === productId) || {},
    [productId, products]
  );


  const [form, setForm] = useState({
    name: existing.name || "",
    category: existing.category || "",
    price: existing.price || 0,
    stock: existing.stock || 0,
    description: existing.description || "",
    images: existing.images || [],
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (k) => (e) => {
  let value = e.target.value;

  // validasi khusus untuk price & stock
  if (k === "price" || k === "stock") {
    // hapus karakter non-digit
    value = value.replace(/[^0-9]/g, "");

    // kalau kosong (user hapus semua angka), biarkan kosong string
    if (value === "") {
      setForm((f) => ({ ...f, [k]: "" }));
      setErrors((err) => ({ ...err, [k]: "" }));
      return;
    }

    // ubah ke number & pastikan minimal 0
    value = Math.max(0, Number(value));
  }

  setForm((f) => ({ ...f, [k]: value }));
  setErrors((err) => ({ ...err, [k]: "" })); // hapus error saat user isi
};


  
  // --- handle file upload ---
  const handleImageUpload = (e) => {
  const files = Array.from(e.target.files);
  const previews = files.map((file) => ({
    file,
    url: URL.createObjectURL(file),
  }));

  setForm((f) => ({ ...f, images: [...f.images, ...previews].slice(0, 4) }));
  setErrors((err) => ({ ...err, images: "" })); // error ilang pas user upload
  };


  const removeImage = (index) => {
    setForm((f) => ({
      ...f,
      images: f.images.filter((_, i) => i !== index),
    }));
  };


  // --- validation ---
  const validate = () => {
  const newErrors = {};

  if (!form.name.trim()) 
    newErrors.name = "Product name is required.";
  
  if (!form.category.trim()) 
    newErrors.category = "Category must be selected.";

  if (!form.price || form.price <= 0)
    newErrors.price = "Price must be greater than 0.";

  if (!form.stock || form.stock <= 0)
  newErrors.stock = "Stock must be greater than 0.";


  if (!form.description.trim())
    newErrors.description = "Please add a product description.";

  if (form.images.length === 0)
    newErrors.images = "At least one image is required.";

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
  };



  const save = (e) => {
    e.preventDefault();
    if (!validate()) return; // stop kalau invalid
    
    if (isEdit) {
      updateProduct(id, form);
    } else {
      addProduct(form);
    }
    nav("/admin/products");
  };


  const del = () => {
    setShowConfirm(false);
    deleteProduct(id);
    nav("/admin/products");
  };

  // optional: cleanup object URLs biar ga leak
  useEffect(() => {
    if (isEdit && existing.id) {
      setForm({
        name: existing.name || "",
        category: existing.category || "",
        price: existing.price || 0,
        stock: existing.stock || 0,
        description: existing.description || "",
        images: (existing.images || []).map((img) =>
          typeof img === "string" ? { url: img } : img
        ),
      });
    }
  }, [isEdit, existing]);






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
              className={`w-full rounded-xl border px-4 py-3 outline-none ${
                errors.name
                  ? "border-red-500 bg-red-50"
                  : "border-[#e5e8d2] bg-[#fbfcee]"
              } focus:border-[#3971b8]`}
              placeholder="Nama Produk"
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name}</p>
            )}
          </section>

          {/* Category, Price, Stock */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">Category</h3>
              <select
                value={form.category}
                onChange={set("category")}
                className={`w-full rounded-xl border px-4 py-3 outline-none ${
                  errors.category
                    ? "border-red-500 bg-red-50"
                    : "border-[#e5e8d2] bg-[#fbfcee]"
                } focus:border-[#3971b8]`}
              >
                <option value="">— Choose —</option>
                <option>Shirts</option>
                <option>T-Shirts</option>
                <option>Pants</option>
                <option>Outerwear</option>
              </select>
              {errors.category && (
                <p className="text-sm text-red-600 mt-1">{errors.category}</p>
              )}
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Price</h3>
              <input
                type="number"
                value={form.price}
                onChange={set("price")}
                onWheel={(e) => e.target.blur()} // biar nggak bisa scroll ubah angka
                className={`w-full rounded-xl border px-4 py-3 outline-none ${
                  errors.price
                    ? "border-red-500 bg-red-50"
                    : "border-[#e5e8d2] bg-[#fbfcee]"
                } focus:border-[#3971b8]`}
                placeholder={formatIDR(0)}
   
              />
              {errors.price && (
                <p className="text-sm text-red-600 mt-1">{errors.price}</p>
              )}
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Stock</h3>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={set("stock")}
                onWheel={(e) => e.target.blur()}
                className={`w-full rounded-xl border px-4 py-3 outline-none ${
                  errors.stock
                    ? "border-red-500 bg-red-50"
                    : "border-[#e5e8d2] bg-[#fbfcee]"
                } focus:border-[#3971b8]`}
                placeholder="0"
              />

              {errors.stock && (
                <p className="text-sm text-red-600 mt-1">{errors.stock}</p>
              )}
            </div>
          </section>

          {/* Description */}
          <section>
            <h3 className="text-xl font-semibold mb-2">Description</h3>
            <textarea
              rows={4}
              value={form.description}
              onChange={set("description")}
              className={`w-full rounded-xl border px-4 py-3 outline-none ${
                errors.description
                  ? "border-red-500 bg-red-50"
                  : "border-[#e5e8d2] bg-[#fbfcee]"
              } focus:border-[#3971b8]`}
              placeholder="…"
            />
             {errors.description && (
              <p className="text-sm text-red-600 mt-1">{errors.description}</p>
            )}
          </section>

          {/* Upload Image */}
          <section>
            <h3 className="text-xl font-semibold mb-2">Upload Image</h3>
            <div 
              className={`rounded-xl border p-4 ${
                  errors.images ? "border-red-500 bg-red-50" : "border-[#e5e8d2] bg-[#fbfcee]"
                }`}
            >
              
              <input
                type="file"
                multiple
                accept="image/*"
                id="images"
                onChange={handleImageUpload}
                className="hidden"
              />
              <label
                htmlFor="images"
                className="cursor-pointer inline-block rounded-xl px-5 py-2 font-medium bg-[#3a4425] text-[#fbfcee]"
              >
                Choose Files
              </label>

              {form.images?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-4">
                  {form.images.map((img, i) => (
                    <div key={i} className="relative w-28 h-20">
                      <img
                        src={img.url || img}
                        alt={`preview-${i}`}
                        className="w-full h-full object-cover rounded-xl border border-[#d9d9d9]"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {errors.images && (
                <p className="text-sm text-red-600 mt-2">{errors.images}</p>
              )}
            </div>
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
