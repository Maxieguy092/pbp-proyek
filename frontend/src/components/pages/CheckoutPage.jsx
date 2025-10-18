// 📁 CheckoutPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Impor useNavigate
import MainLayout from "../templates/MainLayout/MainLayout";
import { useCart, formatIDR } from "../../contexts/CartContext";
import { createOrder } from "../../api/orders"; // Impor createOrder

export default function CheckoutPage() {
  const navigate = useNavigate(); // Inisialisasi navigate
  // Panggil useCart untuk mendapatkan data & fungsi keranjang
  const { items, total, clear: clearCart } = useCart();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "", // Ini akan menjadi 'street'
    district: "",
    city: "",
    state: "", // Ini akan menjadi 'province'
    zip: "", // Ini akan menjadi 'postal'
    email: "",
    phone: "",
    shipping: "JNE",
    payment: "Credit Card",
    cardNumber: "",
    bank: "BCA",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- FUNGSI HANDLE SUBMIT YANG DIPERBARUI ---
  const handleSubmit = async () => {
    // =======================================================
    // BLOK VALIDASI BARU
    // =======================================================
    if (items.length === 0) {
      alert("Keranjang Anda kosong.");
      return; // Hentikan fungsi
    }

    // Gunakan .trim() untuk menghapus spasi di awal/akhir
    if (!formData.firstName.trim()) {
      alert("Nama depan tidak boleh kosong.");
      return;
    }
    if (!formData.lastName.trim()) {
      alert("Nama belakang tidak boleh kosong.");
      return;
    }
    if (!formData.address.trim()) {
      alert("Alamat tidak boleh kosong.");
      return;
    }
    if (!formData.email.trim()) {
      alert("Email tidak boleh kosong.");
      return;
    }
    if (!formData.phone.trim()) {
      alert("Nomor telepon tidak boleh kosong.");
      return;
    }

    // Validasi kondisional untuk Kartu Kredit
    if (formData.payment === "Credit Card" && !formData.cardNumber.trim()) {
      alert("Nomor kartu tidak boleh kosong.");
      return;
    }
    // =======================================================
    // AKHIR BLOK VALIDASI
    // =======================================================

    setIsSubmitting(true);

    // 1. Siapkan data alamat dalam format JSON (tidak ada perubahan)
    const addressData = {
      name: `${formData.firstName} ${formData.lastName}`,
      street: formData.address,
      district: formData.district,
      city: formData.city,
      province: formData.state,
      postal: formData.zip,
      phone: formData.phone,
    };

    // 2. Siapkan detail pembayaran (tidak ada perubahan)
    let paymentDetails = null;
    if (formData.payment === "Credit Card") {
      paymentDetails = formData.cardNumber;
    } else if (formData.payment === "Bank Transfer") {
      paymentDetails = formData.bank;
    }

    // 3. Siapkan payload lengkap untuk API (tidak ada perubahan)
    const orderPayload = {
      shippingName: `${formData.firstName} ${formData.lastName}`,
      shippingEmail: formData.email,
      shippingPhone: formData.phone,
      shippingOption: formData.shipping,
      paymentOption: formData.payment,
      paymentDetails: paymentDetails,
      addressText: JSON.stringify(addressData),
      items: items.map((item) => ({
        id: item.id,
        qty: item.qty,
        price: item.price,
      })),
      total: total,
    };

    try {
      const result = await createOrder(orderPayload);
      alert(`Pesanan berhasil dibuat! Order ID: ${result.orderId}`);
      clearCart();
      navigate("/");
    } catch (error) {
      alert("Gagal membuat pesanan: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* === KIRI: RINGKASAN PESANAN (SUDAH DITAMBAHKAN) === */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {items.length > 0 ? (
                items.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="flex items-center gap-4 border-b pb-4"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <div className="flex-grow">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        Qty: {item.qty}{" "}
                        {item.variant ? `| Size: ${item.variant}` : ""}
                      </p>
                      <p className="text-sm">{formatIDR(item.price)}</p>
                    </div>
                    <p className="font-semibold">
                      {formatIDR(item.price * item.qty)}
                    </p>
                  </div>
                ))
              ) : (
                <p>Your cart is empty.</p>
              )}
            </div>
            {items.length > 0 && (
              <div className="pt-4 space-y-2 text-right">
                <p className="text-lg">
                  Subtotal:{" "}
                  <span className="font-semibold">{formatIDR(total)}</span>
                </p>
                <p className="text-lg">
                  Shipping: <span className="font-semibold">Free</span>
                </p>
                <p className="text-xl font-bold">
                  Grand Total:{" "}
                  <span className="font-semibold">{formatIDR(total)}</span>
                </p>
              </div>
            )}
          </div>

          {/* === KANAN: FORMULIR === */}
          <div className="space-y-10">
            {/* Delivery Section */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Delivery</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  name="firstName"
                  placeholder="First Name"
                  className="input"
                  onChange={handleChange}
                  value={formData.firstName}
                />
                <input
                  name="lastName"
                  placeholder="Last Name"
                  className="input"
                  onChange={handleChange}
                  value={formData.lastName}
                />
              </div>
              <div className="mt-4 space-y-4">
                <input
                  name="address"
                  placeholder="Address"
                  className="input"
                  onChange={handleChange}
                  value={formData.address}
                />
                <input
                  name="district"
                  placeholder="District"
                  className="input"
                  onChange={handleChange}
                  value={formData.district}
                />
                <input
                  name="city"
                  placeholder="City"
                  className="input"
                  onChange={handleChange}
                  value={formData.city}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    name="state"
                    placeholder="State"
                    className="input"
                    onChange={handleChange}
                    value={formData.state}
                  />
                  <input
                    name="zip"
                    placeholder="Zip Code"
                    className="input"
                    onChange={handleChange}
                    value={formData.zip}
                  />
                </div>
              </div>
            </section>

            {/* Contact Information Section */}
            <section>
              <h2 className="text-xl font-semibold mb-4">
                Contact Information
              </h2>
              <div className="space-y-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="input"
                  onChange={handleChange}
                  value={formData.email}
                />
                <input
                  name="phone"
                  placeholder="Phone Number (+628...)"
                  className="input"
                  onChange={handleChange}
                  value={formData.phone}
                />
              </div>
            </section>

            {/* Shipping Option Section */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Shipping Option</h2>
              <select
                name="shipping"
                className="input"
                onChange={handleChange}
                value={formData.shipping}
              >
                <option value="JNE">JNE</option>
                <option value="Sicepat">Sicepat</option>
                <option value="GoSend">GoSend</option>
              </select>
            </section>

            {/* Payment Section */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Payment</h2>
              <select
                name="payment"
                className="input"
                onChange={handleChange}
                value={formData.payment}
              >
                <option value="Credit Card">Credit/Debit Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="QRIS">QRIS</option>
              </select>

              {formData.payment === "Credit Card" && (
                <div className="mt-4">
                  <input
                    name="cardNumber"
                    className="input"
                    placeholder="Card Number"
                    onChange={handleChange}
                    value={formData.cardNumber}
                  />
                </div>
              )}
              {formData.payment === "Bank Transfer" && (
                <div className="mt-4">
                  <select
                    name="bank"
                    className="input"
                    onChange={handleChange}
                    value={formData.bank}
                  >
                    <option value="BCA">BCA</option>
                    <option value="Mandiri">Mandiri</option>
                    <option value="BNI">BNI</option>
                  </select>
                </div>
              )}
            </section>

            {/* Update button untuk menangani state isSubmitting */}
            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="rounded-xl px-8 py-3 font-medium transition bg-[#3971b8] text-[#fbfcee] hover:opacity-95 active:scale-[.99] disabled:bg-gray-400"
              >
                {isSubmitting ? "Processing..." : "Pay"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid #e5e8d2;
          background: #fbfcee;
          padding: 0.75rem 1rem;
          outline: none;
        }
        .input:focus { border-color: #3971b8; }
      `}</style>
    </MainLayout>
  );
}
