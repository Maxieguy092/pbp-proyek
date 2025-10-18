// src/components/pages/CheckoutPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../templates/MainLayout/MainLayout";
import { useCart, formatIDR } from "../../contexts/CartContext";
import { createOrder } from "../../api/orders";
import InfoModal from "../molecules/InfoModal/InfoModal";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, total, clear: clearCart } = useCart();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    district: "",
    city: "",
    state: "",
    zip: "",
    email: "",
    phone: "",
    shipping: "JNE",
    payment: "Credit Card",
    cardNumber: "",
    bank: "BCA",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const closeModal = () => setModalState((prev) => ({ ...prev, open: false }));

  const [modalState, setModalState] = useState({
    open: false,
    type: "warning",
    title: "",
    message: "",
    onClose: closeModal,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (items.length === 0) {
      setModalState({
        open: true,
        type: "warning",
        title: "Keranjang Kosong",
        message: "Anda tidak bisa checkout dengan keranjang kosong.",
        onClose: closeModal,
      });
      return;
    }
    const requiredFields = [
      "firstName",
      "lastName",
      "address",
      "city",
      "state",
      "zip",
      "email",
      "phone",
    ];
    if (requiredFields.some((field) => !formData[field].trim())) {
      setModalState({
        open: true,
        type: "warning",
        title: "Data Belum Lengkap",
        message: "Harap isi semua kolom pengiriman dan kontak.",
        onClose: closeModal,
      });
      return;
    }
    if (formData.payment === "Credit Card" && !formData.cardNumber.trim()) {
      setModalState({
        open: true,
        type: "warning",
        title: "Informasi Pembayaran Kurang",
        message: "Harap isi nomor kartu kredit Anda.",
        onClose: closeModal,
      });
      return;
    }

    setIsSubmitting(true);

    const addressData = {
      name: `${formData.firstName} ${formData.lastName}`,
      street: formData.address,
      district: formData.district,
      city: formData.city,
      province: formData.state,
      postal: formData.zip,
      phone: formData.phone,
    };

    let paymentDetails = null;
    if (formData.payment === "Credit Card")
      paymentDetails = formData.cardNumber;
    else if (formData.payment === "Bank Transfer")
      paymentDetails = formData.bank;

    const orderPayload = {
      shippingName: `${formData.firstName} ${formData.lastName}`,
      shippingEmail: formData.email,
      shippingPhone: formData.phone,
      shippingOption: formData.shipping,
      paymentOption: formData.payment,
      paymentDetails,
      addressText: JSON.stringify(addressData),
      items: items.map((item) => ({
        id: item.id,
        qty: item.qty,
        price: item.price,
        variant: item.variant,
      })),
      total,
    };

    try {
      const result = await createOrder(orderPayload);

      setModalState({
        open: true,
        type: "success",
        title: "Pesanan Berhasil Dibuat!",
        message: `Terima kasih! ID Pesanan Anda adalah #${result.orderId}.`,
        onClose: () => {
          clearCart();
          navigate("/dashboard/orders");
        },
      });
    } catch (error) {
      setModalState({
        open: true,
        type: "error",
        title: "Gagal Membuat Pesanan",
        message: error.message || "Terjadi kesalahan. Silakan coba lagi.",
        onClose: closeModal,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <InfoModal
        open={modalState.open}
        onClose={modalState.onClose}
        type={modalState.type}
        title={modalState.title}
        message={modalState.message}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* ... Order Summary ... */}
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
          {/* ... Form ... */}
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
      <style>{`.input { width: 100%; border-radius: 0.75rem; border: 1px solid #e5e8d2; background: #fbfcee; padding: 0.75rem 1rem; outline: none; } .input:focus { border-color: #3971b8; }`}</style>
    </MainLayout>
  );
}
