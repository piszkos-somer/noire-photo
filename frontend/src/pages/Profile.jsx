import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Form,
  Button,
  Alert,
  Row,
  Col,
  Card,
  Badge,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import EditModal from "../components/EditModal";
import "../css/Profile.css";

function Profile() {
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [images, setImages] = useState([]); // mindig tömb
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { user, updateUsername } = useContext(UserContext);
  const navigate = useNavigate();

  // 🔹 Saját képek lekérése
  useEffect(() => {
    // ha nincs token, ne csináljon semmit
    if (!user || !user.token) return;

    const fetchImages = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/my-images", {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        if (res.status === 403) {
          console.warn("❌ Token érvénytelen vagy lejárt. Visszairányítás a bejelentkezésre...");
          navigate("/Login");
          return;
        }

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        if (Array.isArray(data)) {
          setImages(data);
        } else {
          console.error("Nem tömb érkezett:", data);
          setImages([]); // fallback
        }
      } catch (err) {
        console.error("Lekérdezési hiba:", err);
        setImages([]); // fallback, hogy ne dobjon hibát map-nél
      }
    };

    fetchImages();
  }, [user, navigate]);

  // 🔹 Profil adatok frissítése
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
        updateUsername(newUsername); // navbar frissítése azonnal
        setNewUsername("");
      }

      setNewEmail("");
      setNewPassword("");
    } catch (err) {
      console.error(err);
      setMessage("❌ Hiba történt a frissítés közben.");
    }
  };

  // 🔹 Modal megnyitása
  const handleEdit = (img) => {
    setSelectedImage({
      ...img,
      tags: img.tags
        ? img.tags.split(",").map((t) => t.trim()).filter((t) => t !== "")
        : [],
    });
    setShowModal(true);
  };

  // 🔹 Kép mentése a modalból
  const handleSave = async (updatedImage) => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/update-image/${updatedImage.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            title: updatedImage.title,
            description: updatedImage.description,
            tags: JSON.stringify(updatedImage.tags),
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Kép sikeresen frissítve!");
        setShowModal(false);

        // újra lekérjük a képeket
        const refresh = await fetch("http://localhost:3001/api/my-images", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const newData = await refresh.json();
        if (Array.isArray(newData)) setImages(newData);
      } else {
        setMessage(`❌ Hiba: ${data.error || data.message}`);
      }
    } catch (err) {
      console.error("Képszerkesztési hiba:", err);
      setMessage("❌ Szerverhiba a frissítés közben.");
    }
  };

  return (
    <Container className="py-5">
      <h1 className="text-center mb-4">Profilom</h1>

      {message && (
        <Alert variant="info" className="text-center">
          {message}
        </Alert>
      )}

      {/* 🔹 Profiladatok szerkesztése */}
      <Form
        onSubmit={handleUpdate}
        className="mb-5"
        style={{ maxWidth: "500px", margin: "auto" }}
      >
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
          <Button variant="primary" type="submit">
            Mentés
          </Button>
        </div>
      </Form>

      <hr />

      {/* 🔹 Saját képek */}
      <h3 className="mt-5 mb-3 text-center">Saját feltöltéseim</h3>

      <Row xs={1} md={3} className="g-4">
        {Array.isArray(images) && images.length > 0 ? (
          images.map((img) => (
            <Col key={img.id}>
              <Card className="shadow-sm h-100 d-flex flex-column">
                <div className="image-wrapper">
                  <Card.Img
                    variant="top"
                    src={`http://localhost:3001${img.url}`}
                    alt={img.title}
                    className="card-img-fixed"
                  />
                </div>

                <Card.Body className="d-flex flex-column justify-content-between flex-grow-1">
                  <div>
                    <Card.Title>{img.title}</Card.Title>
                    <Card.Text>{img.description}</Card.Text>

                    {img.tags && img.tags.trim() !== "" && (
                      <div className="mb-3">
                        {img.tags
                          .split(",")
                          .map((tag, i) => (
                            <Badge
                              key={`${tag}-${i}`}
                              bg="secondary"
                              className="me-2 mb-1 tag-badge"
                            >
                              #{tag.trim()}
                            </Badge>
                          ))}
                      </div>
                    )}
                  </div>

                  <Button
                    variant="outline-primary"
                    className="w-100 mt-auto"
                    onClick={() => handleEdit(img)}
                  >
                    ✏️ Szerkesztés
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p className="text-center text-muted">
            Még nincs feltöltött képed.
          </p>
        )}
      </Row>

      {/* 🔹 Edit Modal */}
      <EditModal
        show={showModal}
        onHide={() => setShowModal(false)}
        image={selectedImage}
        onSave={handleSave}
      />
    </Container>
  );
}

export default Profile;
