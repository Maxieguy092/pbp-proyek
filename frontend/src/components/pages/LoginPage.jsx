import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../templates/MainLayout/MainLayout";
import Button from "../atoms/Button/Button";
import { useEffect } from "react";


export default function LoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/me", {
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

  const onSubmit = (e) => {
    e.preventDefault();
    const username = e.target.email.value;
    const password = e.target.password.value;  

    fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    }).then((res) => {
        if (!res.ok) throw new Error("Login failed");
        return res.json();
      })
      .then((data) => {
        console.log("Logged in:", data);
        window.location.href = "/dashboard/profile";
      })
      .catch((err) => {
        console.error("Error:", err);
      });

    
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
