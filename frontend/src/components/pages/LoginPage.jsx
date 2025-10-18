// src/components/pages/LoginPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import MainLayout from "../templates/MainLayout/MainLayout";
import Button from "../atoms/Button/Button";

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useUser(); // Ambil fungsi setUser dari context

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.target);
    const credentials = {
      username: formData.get("email"), // Backend mengharapkan 'username'
      password: formData.get("password"),
    };

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // PENTING: Simpan objek user ke state global melalui context
      setUser(data.user);

      if (data.user.role === "admin") {
        // Jika admin, arahkan ke dasbor admin
        navigate("/admin/dashboard");
      } else {
        // Jika bukan, arahkan ke profil pengguna biasa
        navigate("/dashboard/profile");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="min-h-[70vh] flex items-center justify-center">
          <div className="w-full max-w-md">
            <h1 className="mt-5 text-center text-3xl sm:text-4xl font-semibold">
              Log In
            </h1>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <input
                name="email"
                type="email"
                placeholder="e-mail"
                className="w-full rounded-xl border border-[#e5e8d2] bg-[#fbfcee] px-4 py-3 outline-none focus:border-[#3971b8] transition"
                required
              />
              <input
                name="password"
                type="password"
                placeholder="password"
                className="w-full rounded-xl border border-[#e5e8d2] bg-[#fbfcee] px-4 py-3 outline-none focus:border-[#3971b8] transition"
                required
              />
              {error && (
                <p className="text-red-600 text-sm text-center">{error}</p>
              )}
              <div className="pt-2 flex justify-center">
                <Button
                  type="submit"
                  className="w-[140px] text-center"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Log In"}
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
