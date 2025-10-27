import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Registration() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm)
      return setMessage("A jelszavak nem egyeznek!");

    try {
      await axios.post("http://localhost:3001/api/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      setMessage("Sikeres regisztráció! Most jelentkezz be.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Hiba történt.");
    }
  };

  return (
    <Container className="py-5" style={{ maxWidth: "500px" }}>
      <h1 className="mb-4 text-center">Regisztráció</h1>
      {message && <Alert variant="info">{message}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Felhasználónév</Form.Label>
          <Form.Control
            type="text"
            name="username"
            placeholder="Felhasználónév"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="Email cím"
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

        <Form.Group className="mb-3">
          <Form.Label>Jelszó mégegyszer</Form.Label>
          <Form.Control
            type="password"
            name="confirm"
            placeholder="Jelszó mégegyszer"
            value={formData.confirm}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <div className="d-grid gap-2">
          <Button type="submit" variant="primary">
            Regisztrálok
          </Button>
          <Button
            variant="secondary"
            type="button"
            onClick={() => navigate("/Login")}
          >
            Bejelentkezés
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default Registration;
