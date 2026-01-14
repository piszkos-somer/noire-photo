import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const handleUserLogout = () => setUser(null);
    window.addEventListener("userLogout", handleUserLogout);
    return () => window.removeEventListener("userLogout", handleUserLogout);
  }, []);

  const login = (username, token) => {
    const userData = { username, token };
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const updateUsername = (newUsername) => {
    setUser((prev) => {
      if (!prev) return null;
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
