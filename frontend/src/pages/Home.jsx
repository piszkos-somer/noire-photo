import React, { useState, useEffect } from "react";
import { Container, Card, Button, Modal } from "react-bootstrap";
import { Heart } from "lucide-react";
import "../css/Home.css";

function Home() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likeLoading, setLikeLoading] = useState(null);

  const userData = localStorage.getItem("user");
  const token = userData ? JSON.parse(userData).token : null;

  // 📸 Képek lekérése a backendről
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/latest-images", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setImages(data);
      } catch (err) {
        console.error("❌ Képek lekérési hiba:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, [token]);

  // ❤️ Like frissítés
  const handleLike = async (imageId) => {
    if (!token) return;
    setLikeLoading(imageId);
    try {
      const res = await fetch(`http://localhost:3001/api/images/${imageId}/like`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setImages((prev) =>
          prev.map((img) =>
            img.id === imageId ? { ...img, likes: img.likes + 1 } : img
          )
        );
      }
    } catch (err) {
      console.error("Like hiba:", err);
    } finally {
      setLikeLoading(null);
    }
  };

  // 🔍 Modal nyitása / zárása
  const openModal = (image) => setSelectedImage(image);
  const closeModal = () => setSelectedImage(null);

  if (loading)
    return (
      <Container className="text-center py-5 text-light">
        <h3>Betöltés...</h3>
      </Container>
    );

  return (
    <div className="home-page py-5">
      <h1 className="text-center text-light mb-5 szinatmenet">
        Noire Photo Collection
      </h1>
      <Container className="image-grid">
        {images.map((img) => (
          <div key={img.id} className="glass-card">
            <Card className="glass-inner">
              <div className="img-wrapper">
                <Card.Img variant="top" src={`http://localhost:3001${img.url}`} />
              </div>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <Card.Title className="text-light m-0">{img.title}</Card.Title>
                  <button
                    className="heart-btn"
                    disabled={likeLoading === img.id}
                    onClick={() => handleLike(img.id)}
                  >
                    <Heart
                      color="red"
                      fill="none"
                      size={22}
                      style={{ marginRight: 5 }}
                    />
                    <span>{img.likes}</span>
                  </button>
                </div>
                <Card.Subtitle className="text-muted mb-2">
                  {img.author}
                </Card.Subtitle>
                <Card.Text className="text-truncate-multiline">
                  {img.description}
                </Card.Text>
                <Button variant="outline-light" onClick={() => openModal(img)}>
                  Bővebben
                </Button>
              </Card.Body>
            </Card>
          </div>
        ))}
      </Container>

      {/* Modal */}
      <Modal
  show={!!selectedImage}
  onHide={closeModal}
  centered
  size="lg"
  className="glass-modal"
>
  {selectedImage && (
    <div className="modal-content-glass p-4">
      <img
        src={`http://localhost:3001${selectedImage.url}`}
        alt={selectedImage.title}
        className="modal-image"
      />
      <h3 className="mt-3">{selectedImage.title}</h3>
      <p className="text-muted">{selectedImage.author}</p>
      <p>{selectedImage.description}</p>
      <Button variant="outline-light" onClick={closeModal}>
        Bezárás
      </Button>
    </div>
  )}
</Modal>

    </div>
  );
}

export default Home;
