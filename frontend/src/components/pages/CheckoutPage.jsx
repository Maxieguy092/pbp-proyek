import MainLayout from "../templates/MainLayout/MainLayout";
import { useCart, formatIDR } from "../../contexts/CartContext";

export default function CheckoutPage() {
  const { items, total } = useCart();

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: order summary (simple) */}
          <div className="space-y-6">
            {items.map((it) => (
              <div key={it.id} className="flex items-start gap-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-xl bg-[#d9d9d9] border border-[#e8e8e8]" />
                  <span className="absolute -top-2 -left-2 bg-[#c8d69b] text-[#2b2b2b] rounded-lg px-2 py-1 text-sm">
                    {it.qty}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-[#2b2b2b] leading-snug">
                    baju baju – warna warna
                    <br />
                    <span className="text-sm text-[#6b7280]">{it.variant}</span>
                  </p>
                </div>
                <p className="text-[#3971b8] font-medium">
                  {formatIDR(it.price)}
                </p>
              </div>
            ))}

            <div className="pt-8">
              <p className="text-sm text-[#6b7280]">Total</p>
              <p className="text-2xl text-[#3971b8] font-semibold">
                {formatIDR(total)}
              </p>
            </div>
          </div>

          {/* Right: forms */}
          <div className="space-y-10">
            <section>
              <h2 className="text-xl font-semibold mb-4">Delivery</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  name="firstName"
                  type="text"
                  required
                  placeholder="First Name"
                  className="input"
                />
                <input
                  name="lastName"
                  type="text"
                  required
                  placeholder="First Name"
                  className="input"
                />
              </div>
              <div className="mt-4 space-y-4">
                <input
                  name="address"
                  type="text"
                  required
                  placeholder="Address"
                  className="input"
                />
                <input
                  name="district"
                  type="text"
                  required
                  placeholder="District"
                  className="input"
                />
                <input
                  name="city"
                  type="text"
                  required
                  placeholder="City"
                  className="input"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input className="input" placeholder="State" />
                  <input
                    name="zip"
                    type="text"
                    pattern="\\d{5}"
                    required
                    placeholder="Zip Code (5 digits)"
                    className="input"
                  />
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">
                Contact Information
              </h2>
              <div className="space-y-4">
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Email"
                  className="input"
                />
                <input
                  name="phone"
                  className="input"
                  required
                  pattern="^\+?\d{9,15}$"
                  placeholder="Phone Number (+628...)"
                />
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Payment</h2>
              <input className="input" placeholder="Card Number" />
            </section>

            <div className="flex justify-end">
              <button className="rounded-xl px-8 py-3 font-medium transition bg-[#3971b8] text-[#fbfcee] hover:opacity-95 active:scale-[.99]">
                Pay
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* small CSS utility for inputs (tailwind-like classes) */}
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
