// src/contexts/UserContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Efek ini berjalan sekali saat aplikasi dimuat untuk memeriksa sesi yang ada
  useEffect(() => {
    setLoading(true);
    fetch("/api/me", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        // 'data' adalah objek user lengkap { firstName, lastName, email } atau null
        setUser(data);
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  // Menyediakan 'user', 'setUser', dan 'loading' ke semua komponen anak
  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (ctx === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return ctx;
}
