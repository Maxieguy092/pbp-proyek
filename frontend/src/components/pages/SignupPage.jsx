// ==================================================
// 📁 File: src/components/pages/SignupPage.jsx
// ==================================================
import { Link } from "react-router-dom";
import MainLayout from "../templates/MainLayout/MainLayout";
import Button from "../atoms/Button/Button";

export default function SignupPage() {
  const onSubmit = (e) => {
    e.preventDefault();
    // TODO: call API register lu di sini
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="min-h-[70vh] flex items-center justify-center">
          <div className="w-full max-w-xl">
            <h1 className="text-center text-3xl sm:text-4xl font-semibold">
              Sign Up
            </h1>
            <p className="mt-2 text-center text-sm sm:text-base">
              Please fill the informations below
            </p>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <input
                type="text"
                placeholder="first name"
                className="w-full rounded-xl border border-[#e5e8d2] bg-[#fbfcee] px-4 py-3 outline-none focus:border-[#3971b8] transition"
                required
              />
              <input
                type="text"
                placeholder="last name"
                className="w-full rounded-xl border border-[#e5e8d2] bg-[#fbfcee] px-4 py-3 outline-none focus:border-[#3971b8] transition"
                required
              />
              <input
                type="email"
                placeholder="e-mail"
                className="w-full rounded-xl border border-[#e5e8d2] bg-[#fbfcee] px-4 py-3 outline-none focus:border-[#3971b8] transition"
                required
              />
              <input
                type="password"
                placeholder="password"
                className="w-full rounded-xl border border-[#e5e8d2] bg-[#fbfcee] px-4 py-3 outline-none focus:border-[#3971b8] transition"
                required
              />
              <div className="pt-2 flex justify-center">
                <Button type="submit" className="w-[140px] text-center">
                  Sign Up
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
