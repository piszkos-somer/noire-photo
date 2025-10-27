import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3001/api/login", formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);
      navigate("/Upload");
    } catch (err) {
      setMessage(err.response?.data?.message || "Hiba történt.");
    }
  };

  return (
    <Container className="py-5" style={{ maxWidth: "500px" }}>
      <h1 className="mb-4 text-center">Bejelentkezés</h1>
      {message && <Alert variant="danger">{message}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Jelszó</Form.Label>
          <Form.Control
            type="password"
            name="password"
            placeholder="Jelszó"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <div className="d-grid">
          <Button variant="primary" type="submit">
            Bejelentkezem
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default Login;
