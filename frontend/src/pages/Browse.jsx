import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Spinner } from "react-bootstrap";
import ImageCard from "../components/ImageCard";
import ImageModal from "../components/ImageModal";
import "../css/Home.css";

function Browse() {
  const { tag } = useParams();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likeLoading, setLikeLoading] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalShow, setModalShow] = useState(false);

  // 🔹 Token lekérése (ha be vagy jelentkezve)
  const token = localStorage.getItem("token");

  // 🔹 Képek lekérése adott tag alapján
  const fetchImages = async () => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/images/by-tag/${encodeURIComponent(tag)}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      const data = await res.json();
      setImages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Képek betöltési hiba:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [tag]);

  // ❤️ Like / Unlike logika
  const handleLike = async (imageId) => {
    if (!token) {
      alert("Be kell jelentkezned a like-oláshoz!");
      return;
    }

    setLikeLoading(imageId);
    try {
      const res = await fetch(`http://localhost:3001/api/images/${imageId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setImages((prevImages) =>
          prevImages.map((img) =>
            img.id === imageId
              ? { ...img, isLiked: data.isLiked, likes: data.likes }
              : img
          )
        );

        // 🔹 Ha modal nyitva van, frissítsük azt is
        if (selectedImage && selectedImage.id === imageId) {
          setSelectedImage((prev) => ({
            ...prev,
            isLiked: data.isLiked,
            likes: data.likes,
          }));
        }
      }
    } catch (err) {
      console.error("Hiba a like művelet közben:", err);
    } finally {
      setLikeLoading(null);
    }
  };

  // 🖼️ Modal megnyitása
  const handleOpenModal = (image) => {
    setSelectedImage(image);
    setModalShow(true);
  };

  // ❌ Modal bezárása
  const handleCloseModal = () => {
    setModalShow(false);
    setSelectedImage(null);
  };

  if (loading)
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );

  return (
    <Container className="py-5">
      <h2 className="text-center mb-4">
        📸 Képek ezzel a taggel: <span className="szinatmenet">#{tag}</span>
      </h2>

      {images.length === 0 ? (
        <p className="text-center text-muted">Nincs találat ezzel a taggel.</p>
      ) : (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {images.map((img) => (
            <ImageCard
              key={img.id}
              image={img}
              onLike={handleLike}
              onOpen={handleOpenModal}
              likeLoading={likeLoading}
            />
          ))}
        </Row>
      )}

      {/* 🖼️ Modal (ugyanaz mint Home-ban) */}
      {selectedImage && (
        <ImageModal
          show={modalShow}
          image={selectedImage}
          onClose={handleCloseModal}
          onLike={handleLike}
          likeLoading={likeLoading}
          comments={[]}
          newComment=""
          onCommentChange={() => {}}
          onCommentSubmit={() => {}}
          commentLoading={false}
          onCommentLike={() => {}}
        />
      )}
    </Container>
  );
}

export default Browse;
