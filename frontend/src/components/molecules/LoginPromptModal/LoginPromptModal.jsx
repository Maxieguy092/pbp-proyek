// src/components/molecules/LoginPromptModal/LoginPromptModal.jsx
import { Link } from "react-router-dom";

export default function LoginPromptModal({ open, onClose }) {
  if (!open) return null;

  return (
    <>
      {/* Background gelap */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      {/* Konten Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-2xl bg-[#fbfcee] p-6 text-center shadow-xl">
          <h3 className="text-2xl font-semibold text-[#2b2b2b]">
            Anda Belum Login
          </h3>
          <p className="mt-2 text-[#6b7280]">
            Silakan masuk ke akun Anda atau daftar untuk mulai berbelanja.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            {/* Tombol Login mengarah ke halaman login */}
            <Link
              to="/login"
              className="w-full rounded-xl px-5 py-2 font-medium bg-[#3971b8] text-white hover:opacity-95"
            >
              Login
            </Link>
            {/* Tombol untuk menutup modal */}
            <button
              onClick={onClose}
              className="w-full rounded-xl px-5 py-2 font-medium bg-transparent text-[#6b7280] hover:bg-[#e5e8d2]"
            >
              Nanti Saja
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
