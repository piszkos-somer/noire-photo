import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState({
    username: localStorage.getItem("username") || null,
    token: localStorage.getItem("token") || null,
  });

  // ha localStorage változik (pl. kijelentkezés), frissítjük a contextet
  useEffect(() => {
    const handleStorageChange = () => {
      setUser({
        username: localStorage.getItem("username") || null,
        token: localStorage.getItem("token") || null,
      });
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = (username, token) => {
    localStorage.setItem("username", username);
    localStorage.setItem("token", token);
    setUser({ username, token });
  };

  const logout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    setUser({ username: null, token: null });
  };

  const updateUsername = (newUsername) => {
    localStorage.setItem("username", newUsername);
    setUser((prev) => ({ ...prev, username: newUsername }));
  };

  return (
    <UserContext.Provider value={{ user, login, logout, updateUsername }}>
      {children}
    </UserContext.Provider>
  );
}
