import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';

function Registration() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <Container className="py-5" style={{ maxWidth: '500px' }}>
      <h1 className="mb-4 text-center">Regisztráció</h1>

      {submitted ? (
        <Alert variant="success" className="text-center">
          Sikeres regisztráció! Üdvözlünk, {formData.name}!
        </Alert>
      ) : (
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Felhasználónév</Form.Label>
            <Form.Control
              type="text"
              placeholder="Add meg a felhasználóneved"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email cím</Form.Label>
            <Form.Control
              type="email"
              placeholder="Add meg az email címed"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Jelszó</Form.Label>
            <Form.Control
              type="password"
              placeholder="Adj meg egy jelszót"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Jelszó mégegyszer</Form.Label>
            <Form.Control
              type="password"
              placeholder="Ismételd meg a jelszót"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <div className="d-grid">
            <Button variant="primary" type="submit">
              Regisztrálok
            </Button>
          </div>
        </Form>
      )}
    </Container>
  );
}

export default Registration;
