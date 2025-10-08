import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../templates/MainLayout/MainLayout";
import Button from "../atoms/Button/Button";
import { useEffect, useState } from "react"; // Import useState

export default function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState(null); // State untuk error

  useEffect(() => {
    fetch("/api/me", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          window.location.href = "/dashboard/profile";
        }
      })
      .catch((err) => {
        console.error("Session check failed:", err);
      });
  }, []);

  // Fungsi onSubmit yang sudah diperbarui
  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Bersihkan error lama

    const username = e.target.email.value;
    const password = e.target.password.value;

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Terjadi kesalahan saat login.");
      }

      console.log("Logged in:", data);
      window.location.href = "/dashboard/profile";
    } catch (err) {
      setError(err.message);
      console.error("Login error:", err);
    }
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="min-h-[70vh] flex items-center justify-center">
          <div className="w-full max-w-xl">
            <h1 className="text-center text-3xl sm:text-4xl font-semibold">
              Login
            </h1>
            <p className="mt-2 text-center text-sm sm:text-base">
              Enter your e-mail and password to login
            </p>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <input
                name="email"
                type="email"
                required
                placeholder="e-mail"
                className="w-full rounded-xl border border-[#e5e8d2] bg-[#fbfcee] px-4 py-3 outline-none focus:border-[#3971b8] transition"
              />
              <input
                name="password"
                type="password"
                required
                minLength={6}
                placeholder="password"
                className="w-full rounded-xl border border-[#e5e8d2] bg-[#fbfcee] px-4 py-3 outline-none focus:border-[#3971b8] transition"
              />

              {/* Tampilkan pesan error di sini */}
              {error && (
                <p className="rounded-lg bg-red-100 p-3 text-center text-sm text-red-600">
                  {error.includes("not found") && "Email tidak terdaftar."}
                  {error.includes("invalid password") &&
                    "Password yang Anda masukkan salah."}
                  {!error.includes("not found") &&
                    !error.includes("invalid password") &&
                    error}
                </p>
              )}

              <div className="pt-2 flex justify-center">
                <Button type="submit" className="w-[140px] text-center">
                  Log In
                </Button>
              </div>
            </form>

            <p className="mt-4 text-center text-sm sm:text-base">
              Don't have an account?{" "}
              <Link to="/signup" className="underline hover:opacity-90">
                Sign Up
              </Link>
            </p>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
