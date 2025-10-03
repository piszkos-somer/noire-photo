import { useState } from 'react'
import './App.css'
import NavbarNoire from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <NavbarNoire />
      <Footer />
    </>
  )
}

export default App
