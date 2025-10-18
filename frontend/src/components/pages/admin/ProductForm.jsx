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
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();

  const productId = Number(id);
  const existing = useMemo(
    () => products.find((p) => p.id === productId) || {},
    [productId, products]
  );

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: 0,
    sizes: [
      { size: "S", stock: 0 },
      { size: "M", stock: 0 },
      { size: "L", stock: 0 },
      { size: "XL", stock: 0 },
    ],
    description: "",
    images: [],
  });

  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});

  // 🧠 general input handler
  const set = (k) => (e) => {
    let value = e.target.value;
    if (k === "price") {
      value = value.replace(/[^0-9]/g, "");
      if (value === "") {
        setForm((f) => ({ ...f, [k]: "" }));
        setErrors((err) => ({ ...err, [k]: "" }));
        return;
      }
      value = Math.max(0, Number(value));
    }
    setForm((f) => ({ ...f, [k]: value }));
    setErrors((err) => ({ ...err, [k]: "" }));
  };

  // 🧩 stock per size
  const setSizeStock = (index, value) => {
    const updated = [...form.sizes];
    updated[index].stock = value === "" ? "" : Math.max(0, Number(value));
    setForm((f) => ({ ...f, sizes: updated }));
  };

  // 📸 image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setForm((f) => ({
      ...f,
      images: [...f.images, ...previews].slice(0, 4),
    }));
    setErrors((err) => ({ ...err, images: "" }));
  };

  const removeImage = (index) => {
    setForm((f) => ({
      ...f,
      images: f.images.filter((_, i) => i !== index),
    }));
  };

  // 🔹 validation
  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Product name is required.";
    if (!form.category.trim()) newErrors.category = "Category must be selected.";
    if (!form.price || form.price <= 0)
      newErrors.price = "Price must be greater than 0.";
    if (!form.description.trim())
      newErrors.description = "Please add a product description.";
    if (form.images.length === 0)
      newErrors.images = "At least one image is required.";

    const totalStock = form.sizes.reduce((sum, s) => sum + Number(s.stock), 0);
    if (totalStock <= 0)
      newErrors.sizes = "At least one size must have stock greater than 0.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔹 save product
  const save = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const finalForm = {
      ...form,
      stock: form.sizes.reduce((sum, s) => sum + Number(s.stock), 0),
      category_id: Number(form.category),
    };

    if (isEdit) await updateProduct(id, finalForm);
    else await addProduct(finalForm);

    nav("/admin/products");
  };

  // 🗑️ delete product
  const del = () => {
    setShowConfirm(false);
    deleteProduct(id);
    nav("/admin/products");
  };

  // 🧹 load existing data
  useEffect(() => {
    if (isEdit && existing.id) {
      setForm({
        name: existing.name || "",
        category: existing.category_id?.toString() || "",
        price: existing.price || 0,
        sizes: existing.sizes?.map((s) => ({
          size: s.size,
          stock: Number(s.stock),
        })) || [
          { size: "S", stock: 0 },
          { size: "M", stock: 0 },
          { size: "L", stock: 0 },
          { size: "XL", stock: 0 },
        ],
        description: existing.description || "",
        images: (existing.images || []).map((img) => {
          if (typeof img === "string") {
            return { url: img.startsWith("http") ? img : `http://localhost:5000${img}` };
          } else if (img.url) {
            return { url: img.url };
          }
          return img;
        }),
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
                errors.name ? "border-red-500 bg-red-50" : "border-[#e5e8d2] bg-[#fbfcee]"
              } focus:border-[#3971b8]`}
              placeholder="Nama Produk"
            />
            {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
          </section>

          {/* Category & Price */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">Category</h3>
              <select
                value={form.category}
                onChange={set("category")}
                className={`w-full rounded-xl border px-4 py-3 outline-none ${
                  errors.category ? "border-red-500 bg-red-50" : "border-[#e5e8d2] bg-[#fbfcee]"
                } focus:border-[#3971b8]`}
              >
                <option value="">— Choose —</option>
                <option value="1">T-Shirts</option>
                <option value="2">Shirts</option>
                <option value="3">Pants</option>
                <option value="4">Outerwear</option>
              </select>
              {errors.category && <p className="text-sm text-red-600 mt-1">{errors.category}</p>}
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Price</h3>
              <input
                type="number"
                value={form.price}
                onChange={set("price")}
                onWheel={(e) => e.target.blur()}
                className={`w-full rounded-xl border px-4 py-3 outline-none ${
                  errors.price ? "border-red-500 bg-red-50" : "border-[#e5e8d2] bg-[#fbfcee]"
                } focus:border-[#3971b8]`}
                placeholder={formatIDR(0)}
              />
              {errors.price && <p className="text-sm text-red-600 mt-1">{errors.price}</p>}
            </div>
          </section>

          {/* Stock by Size */}
          <section>
            <h3 className="text-xl font-semibold mb-2">Stock by Size</h3>
            <div className={`rounded-xl border p-4 ${errors.sizes ? "border-red-500 bg-red-50" : "border-[#e5e8d2] bg-[#fbfcee]"}`}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {form.sizes.map((s, i) => (
                  <div key={i}>
                    <label className="block text-sm font-medium mb-1">{s.size}</label>
                    <input
                      type="number"
                      min="0"
                      value={s.stock}
                      onChange={(e) => setSizeStock(i, e.target.value)}
                      onBlur={() => {
                        if (s.stock === "") setSizeStock(i, 0);
                      }}
                      className="w-full rounded-xl border px-3 py-2 outline-none border-[#e5e8d2] focus:border-[#3971b8]"
                    />
                  </div>
                ))}
              </div>
              {errors.sizes && <p className="text-sm text-red-600 mt-2">{errors.sizes}</p>}
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
                errors.description ? "border-red-500 bg-red-50" : "border-[#e5e8d2] bg-[#fbfcee]"
              } focus:border-[#3971b8]`}
              placeholder="…"
            />
            {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
          </section>

          {/* Upload Image */}
          <section>
            <h3 className="text-xl font-semibold mb-2">Upload Image</h3>
            <div className={`rounded-xl border p-4 ${errors.images ? "border-red-500 bg-red-50" : "border-[#e5e8d2] bg-[#fbfcee]"}`}>
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
                      <img src={img.url} alt={`preview-${i}`} className="w-full h-full object-cover rounded" />
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
              {errors.images && <p className="text-sm text-red-600 mt-2">{errors.images}</p>}
            </div>
          </section>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 justify-center sm:justify-start mt-4">
            <button type="button" onClick={() => window.history.back()} className="rounded-xl px-8 py-3 font-medium bg-[#3a4425] text-[#fbfcee]/90 hover:opacity-95">Cancel</button>
            <button type="submit" className="rounded-xl px-8 py-3 font-medium bg-[#3971b8] text-[#fbfcee] hover:opacity-95">Save</button>
            {isEdit && <button type="button" onClick={() => setShowConfirm(true)} className="rounded-xl px-8 py-3 font-medium bg-[#e11d1d] text-white hover:opacity-95">Delete</button>}
          </div>
        </form>
      </div>

      <ConfirmModal
        open={showConfirm}
        message="Do you really want to delete this product? This process cannot be undone."
        onCancel={() => setShowConfirm(false)}
        onConfirm={del}
      />
    </AdminLayout>
  );
}
