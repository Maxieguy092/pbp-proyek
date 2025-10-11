// ==================================================
// 📁 File: src/components/pages/Dashboard/ProfilePage.jsx
// ==================================================
import { useOutletContext } from "react-router-dom"; // ← 1. Impor hook

export default function ProfilePage() {
  const { user } = useOutletContext(); // ← 2. Ambil data user dari layout

  if (!user) {
    return <p>Loading user data...</p>; // Tampilan sementara saat data dimuat
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold border-b border-[#d3e0a9] pb-2">
          Personal Information
        </h1>
      </div>

      <section>
        {/* 3. Ubah ukuran font judul */}
        <h2 className="text-xl font-semibold mb-2">Sign In Information</h2>
        {/* 4. Ubah ukuran font konten */}
        <div className="space-y-1 text-base">
          <p>
            <span className="inline-block w-28 font-medium">Email</span>:{" "}
            {user.email}
          </p>
          <p>
            <span className="inline-block w-28 font-medium">Password</span>:{" "}
            ••••••••
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">About Me</h2>
        <div className="space-y-1 text-base">
          <p>
            <span className="inline-block w-28 font-medium">First name</span>:{" "}
            {user.firstName}
          </p>
          <p>
            <span className="inline-block w-28 font-medium">Last name</span>:{" "}
            {user.lastName}
          </p>
        </div>
      </section>
    </div>
  );
}
