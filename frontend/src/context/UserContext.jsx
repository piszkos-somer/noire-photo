// src/context/UserContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : { username: null, token: null };
  });

  // 💾 LocalStorage szinkronizálás, ha másik tabon kijelentkezik
  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : { username: null, token: null });
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // 🔹 Bejelentkezés (login)
  const login = (username, token) => {
    const userData = { username, token };
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // 🔹 Kijelentkezés (logout)
  const logout = () => {
    localStorage.removeItem("user");
    setUser({ username: null, token: null });
  };

  // 🔹 Felhasználónév frissítése (profil módosítás)
  const updateUsername = (newUsername) => {
    setUser((prev) => {
      const updated = { ...prev, username: newUsername };
      localStorage.setItem("user", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <UserContext.Provider value={{ user, login, logout, updateUsername }}>
      {children}
    </UserContext.Provider>
  );
}
