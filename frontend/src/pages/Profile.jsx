import React, { useState, useEffect, useContext } from "react";
import { Container, Form, Button, Alert, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

function Profile() {
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState("");
  const { user, updateUsername } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user.token) {
      navigate("/Login");
      return;
    }

    fetch("http://localhost:3001/api/my-images", {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => res.json())
      .then((data) => setImages(data))
      .catch((err) => console.error("Lekérdezési hiba:", err));
  }, [navigate, user.token]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3001/api/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          username: newUsername,
          email: newEmail,
          password: newPassword,
        }),
      });

      const data = await res.json();
      setMessage(data.message || "Adatok frissítve!");

      if (res.ok && newUsername) {
        updateUsername(newUsername); // 🔥 azonnal frissíti a Navbar-t
        setNewUsername("");
      }

      setNewEmail("");
      setNewPassword("");
    } catch (err) {
      console.error(err);
      setMessage("❌ Hiba történt a frissítés közben.");
    }
  };

  return (
    <Container className="py-5">
      <h1 className="text-center mb-4">Profilom</h1>

      {message && <Alert variant="info" className="text-center">{message}</Alert>}

      <Form onSubmit={handleUpdate} className="mb-5" style={{ maxWidth: "500px", margin: "auto" }}>
        <Form.Group className="mb-3">
          <Form.Label>Jelenlegi felhasználónév</Form.Label>
          <Form.Control type="text" value={user.username || ""} disabled />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Új felhasználónév</Form.Label>
          <Form.Control
            type="text"
            placeholder="Add meg az új felhasználónevet"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Új email cím</Form.Label>
          <Form.Control
            type="email"
            placeholder="Add meg az új email címet"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Új jelszó</Form.Label>
          <Form.Control
            type="password"
            placeholder="Adj meg új jelszót"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </Form.Group>

        <div className="text-center">
          <Button variant="primary" type="submit">Mentés</Button>
        </div>
      </Form>

      <hr />
      <h3 className="mt-5 mb-3 text-center">Saját feltöltéseim</h3>

      <Row xs={1} md={3} className="g-4">
        {images.map((img) => (
          <Col key={img.id}>
            <Card className="shadow-sm">
              <Card.Img variant="top" src={`http://localhost:3001${img.url}`} />
              <Card.Body>
                <Card.Title>{img.title}</Card.Title>
                <Card.Text>{img.description}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
        {images.length === 0 && (
          <p className="text-center text-muted">Még nincs feltöltött képed.</p>
        )}
      </Row>
    </Container>
  );
}

export default Profile;
