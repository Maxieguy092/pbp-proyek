import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchDropdown({ open, onClose }) {
  const [term, setTerm] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      // auto-focus ketika dibuka
      setTimeout(() => inputRef.current?.focus(), 0);
      const onKey = (e) => e.key === "Escape" && onClose();
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }
  }, [open, onClose]);

  if (!open) return null;

  const submit = (e) => {
    e.preventDefault();
    const q = term.trim();
    if (!q) return;
    onClose();
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <>
      {/* overlay clickable buat nutup */}
      <button
        aria-label="Close search overlay"
        onClick={onClose}
        className="fixed inset-0 bg-black/10 backdrop-blur-[1px] z-40"
      />
      {/* bar di bawah header */}
      <div className="fixed left-0 right-0 top-[56px] sm:top-[56px] z-50">
        <form
          onSubmit={submit}
          className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8"
        >
          <input
            ref={inputRef}
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search products…"
            className="w-full rounded-xl border border-[#d3e0a9] bg-[#fbfcee] px-4 py-3 outline-none focus:border-[#3971b8] placeholder-[#7aa0d7]"
          />
        </form>
      </div>
    </>
  );
}
