import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavbarNoire from './components/Navbar';
import About from './pages/About';
import Registration from './pages/Registration';
import Home from './pages/Home';

function App() {
  return (
    <>
      <NavbarNoire />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/About" element={<About />} />
        <Route path="/Registration" element={<Registration />} />
      </Routes>
    </>
  );
}

export default App;