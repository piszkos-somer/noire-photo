import React, { useState, useContext } from "react";
import { Form, Button, Container, Alert, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { handleTokenError } from "../utils/auth";
import { Eye, EyeSlash } from "react-bootstrap-icons"; 


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); 
  const [error, setError] = useState("");
  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      const res = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      if (res.status === 401 || res.status === 403) {
        setError("Rossz email vagy jelszó.");
        handleTokenError(res.status, navigate);
        return;
      }
  
      const data = await res.json();
  
      if (res.ok) {
        // itt adjuk át az isAdmin-t is
        login(data.username, data.token, data.isAdmin); 
  
        // átirányítás a home-ra, mert ott van az admin X gomb
        navigate("/home");
      } else {
        setError(data.message || "Hibás bejelentkezés.");
      }
    } catch (err) {
      console.error(err);
      setError("Szerverhiba vagy hálózati hiba történt.");
    }
  };
  

  return (
    <Container style={{ maxWidth: "400px" }} className="py-5">
      <h2 className="text-center mb-4">Bejelentkezés</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleLogin}>
        <Form.Group className="mb-3">
          <Form.Label>Email cím</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Add meg az email címed"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Jelszó</Form.Label>
          <InputGroup>
            <Form.Control
              type={showPassword ? "text" : "password"} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Add meg a jelszavad"
              required
            />
            <Button
              variant="outline-secondary"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1} 
            >
              {showPassword ? <EyeSlash /> : <Eye />}
            </Button>
          </InputGroup>
        </Form.Group>

        <div className="mb-3 text-center">
          Ha még nincs fiókod,{" "}
          <span
            style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
            onClick={() => navigate("/registration")}
          >
            regisztrálj
          </span>
          .
        </div>

        <Button variant="primary" type="submit" className="w-100">
          Bejelentkezés
        </Button>
      </Form>
    </Container>
  );
}

export default Login;
