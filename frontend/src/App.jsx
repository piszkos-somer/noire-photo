// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";

import NavbarNoire from "./components/Navbar";
import About from "./pages/About";
import Registration from "./pages/Registration";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Upload from "./pages/Upload";
import Login from "./pages/Login";
import Profile from "./pages/Profile";

function App() {
  return (
    <UserProvider>
      <NavbarNoire />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/About" element={<About />} />
        <Route path="/Registration" element={<Registration />} />
        <Route path="/Upload" element={<Upload />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Profile" element={<Profile />} />
      </Routes>
      <Footer />
    </UserProvider>
  );
}

export default App;
