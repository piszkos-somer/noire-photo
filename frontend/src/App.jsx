import AnimatedLinesBackground from "./components/AnimatedLinesBackground";
import { React, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import NavbarNoire from "./components/Navbar";
import About from "./pages/About";
import Registration from "./pages/Registration";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Upload from "./pages/Upload";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import ViewProfile from "./pages/ViewProfile";
import Browse from "./pages/Browse";
import { logoutIfExpired } from "../src/utils/auth";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    logoutIfExpired(navigate);
    const interval = setInterval(() => logoutIfExpired(navigate), 60000);
    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="min-vh-100 d-flex flex-column">
      <AnimatedLinesBackground lineCount={38} speed={0.6} amplitude={0.22} alpha={0.6} color="#2a6cff" />
      <UserProvider>
        <NavbarNoire />
        <div className="flex-grow-1 d-flex flex-column">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/About" element={<About />} />
            <Route path="/Registration" element={<Registration />} />
            <Route path="/Upload" element={<Upload />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Profile" element={<Profile />} />
            <Route path="/profile/:id" element={<ViewProfile />} />
            <Route path="/viewprofile/:id" element={<ViewProfile />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/browse/:tag" element={<Browse />} />
          </Routes>
        </div>
        <div className="mt-auto">
          <Footer />
        </div>
      </UserProvider>
    </div>
  );
}

export default App;