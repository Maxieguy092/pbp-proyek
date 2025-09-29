// ==================================================
// 📁 src/components/molecules/ConfirmModal/ConfirmModal.jsx
// ==================================================
export default function ConfirmModal({
  open,
  title = "Are you sure?",
  message,
  onCancel,
  onConfirm,
}) {
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onCancel} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl bg-[#fbfcee] p-6 text-center shadow-xl">
          <div className="mx-auto mb-3 w-16 h-16 rounded-full bg-[#fff0f0] flex items-center justify-center text-red-500 text-4xl">
            !
          </div>
          <h3 className="text-2xl font-semibold">{title}</h3>
          {message && <p className="mt-2 text-[#6b7280]">{message}</p>}
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={onCancel}
              className="rounded-xl px-5 py-2 font-medium bg-[#a3a89a] text-white hover:opacity-95"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="rounded-xl px-5 py-2 font-medium bg-[#e11d1d] text-white hover:opacity-95"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
