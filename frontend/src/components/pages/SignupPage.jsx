import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Impor useNavigate
import MainLayout from "../templates/MainLayout/MainLayout";
import Button from "../atoms/Button/Button";
import { registerUser } from "../../api/auth"; // Impor fungsi API

export default function SignupPage() {
  const [pw, setPw] = useState("");
  const [cpw, setCpw] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false); // State untuk loading
  const navigate = useNavigate(); // Hook untuk navigasi

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(""); // Reset error setiap kali submit

    if (pw !== cpw) {
      setErr("Passwords do not match");
      return;
    }

    setLoading(true);

    // Ambil semua data dari form
    const formData = new FormData(e.target);
    const userData = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    try {
      await registerUser(userData);
      // Jika sukses, arahkan ke halaman login
      navigate("/login?status=registered");
    } catch (error) {
      // Tangkap error dari API dan tampilkan
      setErr(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="min-h-[70vh] flex items-center justify-center">
          <div className="w-full max-w-xl">
            <h1 className="mt-5 text-center text-3xl sm:text-4xl font-semibold">
              Sign Up
            </h1>
            <p className="mt-2 text-center text-sm sm:text-base">
              Please fill the informations below
            </p>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <input
                name="firstName"
                type="text"
                placeholder="first name"
                className="w-full rounded-xl border border-[#e5e8d2] bg-[#fbfcee] px-4 py-3 outline-none focus:border-[#3971b8] transition"
                required
              />
              <input
                name="lastName"
                type="text"
                placeholder="last name"
                className="w-full rounded-xl border border-[#e5e8d2] bg-[#fbfcee] px-4 py-3 outline-none focus:border-[#3971b8] transition"
                required
              />
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
                required
                minLength={6}
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                placeholder="password"
                className="w-full rounded-xl border border-[#e5e8d2] bg-[#fbfcee] px-4 py-3 outline-none focus:border-[#3971b8] transition"
              />
              <input
                name="confirmPassword"
                type="password"
                required
                minLength={6}
                value={cpw}
                onChange={(e) => setCpw(e.target.value)}
                placeholder="confirm password"
                className="w-full rounded-xl border border-[#e5e8d2] bg-[#fbfcee] px-4 py-3 outline-none focus:border-[#3971b8] transition"
              />
              {err && <p className="text-red-600 text-sm">{err}</p>}
              <div className="pt-2 flex justify-center">
                <Button
                  type="submit"
                  className="w-[140px] text-center"
                  disabled={loading}
                >
                  {loading ? "Signing Up..." : "Sign Up"}
                </Button>
              </div>
            </form>

            <p className="mt-4 text-center text-sm sm:text-base">
              Already have an account?{" "}
              <Link to="/login" className="underline hover:opacity-90">
                Log In
              </Link>
            </p>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
