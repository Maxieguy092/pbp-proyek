// src/contexts/UserContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  // Tambahkan state loading
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true); // Mulai loading
    fetch("/api/me", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data?.username || null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false)); // Selesai loading
  }, []);

  // Kirim juga 'loading' ke dalam value
  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
