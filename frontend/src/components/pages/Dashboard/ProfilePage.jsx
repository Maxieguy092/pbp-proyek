// ==================================================
// 📁 File: src/components/pages/Dashboard/ProfilePage.jsx
// ==================================================
export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold border-b border-[#d3e0a9] pb-2">
          Personal Information
        </h1>
      </div>

      <section>
        <h2 className="text-lg font-semibold mb-2">Sign In Information</h2>
        <div className="space-y-1 text-sm">
          <p>
            <span className="inline-block w-24 font-medium">Email</span>
            nama@example.com
          </p>
          <p>
            <span className="inline-block w-24 font-medium">Password</span>
            ••••••
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">About Me</h2>
        <div className="space-y-1 text-sm">
          <p>
            <span className="inline-block w-24 font-medium">First name</span>
            Example
          </p>
          <p>
            <span className="inline-block w-24 font-medium">Last name</span>
            Example2
          </p>
        </div>
      </section>
    </div>
  );
}
