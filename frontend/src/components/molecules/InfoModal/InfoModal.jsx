// ===================================================================
// 📁 src/components/molecules/InfoModal/InfoModal.jsx
// ===================================================================

// Komponen ikon dinamis
const ModalIcon = ({ type }) => {
  const styles = {
    success: "bg-[#e1eac4] text-[#394b2b]", // Hijau
    error: "bg-red-100 text-red-700", // Merah
    warning: "bg-yellow-100 text-yellow-800", // Kuning
  };
  const icons = {
    success: "✓", // Centang
    error: "×", // Silang
    warning: "!", // Seru
  };
  return (
    <div
      className={`mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center text-4xl font-bold ${
        styles[type] || styles.warning
      }`}
    >
      {icons[type] || icons.warning}
    </div>
  );
};

export default function InfoModal({
  open,
  onClose,
  type = "warning", // 'success', 'error', 'warning'
  title,
  message,
  buttonText = "OK",
}) {
  if (!open) return null;

  return (
    <>
      {/* Latar belakang gelap */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Konten Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-2xl bg-[#fbfcee] p-6 text-center shadow-xl">
          <ModalIcon type={type} />
          <h3 className="text-2xl font-semibold text-[#2b2b2b]">{title}</h3>
          <p className="mt-2 text-gray-600">{message}</p>
          <div className="mt-6">
            <button
              onClick={onClose}
              className="w-full rounded-xl px-5 py-2.5 font-medium bg-[#394b2b] text-white hover:opacity-95"
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
