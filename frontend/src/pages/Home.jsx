import React, { useState, useEffect, useRef } from "react";
import { Container, Card, Button, Modal } from "react-bootstrap";
import { Heart } from "lucide-react";
import "../css/Home.css";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedCommentHeart from "../components/AnimatedCommentHeart";

const AnimatedHeart = ({ isLiked, onClick, disabled, likeCount }) => {
  const [animate, setAnimate] = useState(false);
  const [showSparkle, setShowSparkle] = useState(false);
  const prevLiked = useRef(isLiked);
  

  const handleClick = () => {
    // Indítjuk az animációt mindig (like/unlike esetén is)
    setAnimate(true);

    // ✨ Csak akkor mutatjuk a csillagot, ha LIKE történik
    if (!isLiked) {
      setShowSparkle(true);
      setTimeout(() => setShowSparkle(false), 500);
    }

    onClick();

    // Animáció leállítása fél másodperc után
    setTimeout(() => setAnimate(false), 500);
  };

  // Figyeljük az előző állapotot, hogy ne animáljon renderkor
  useEffect(() => {
    prevLiked.current = isLiked;
  }, [isLiked]);

  return (
    <motion.button
      className="heart-btn-modal relative"
      onClick={handleClick}
      disabled={disabled}
      whileTap={{ scale: 0.9 }}
      style={{
        position: "relative",
        border: "none",
        background: "none",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      <motion.div
        initial={false}
        animate={
          animate
            ? {
                scale: isLiked ? [1, 1.4, 1] : [1, 0.7, 1],
                rotate: isLiked ? [0, 10, -10, 0] : [0, 0, 0, 0],
              }
            : { scale: 1, rotate: 0 }
        }
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <Heart
          size={28}
          fill={isLiked ? "#e84118" : "none"}
          color="#e84118"
          style={{
            transition: "fill 0.25s ease",
          }}
        />
      </motion.div>

      {/* ✨ Csillag csak like esetén */}
      <AnimatePresence>
        {showSparkle && (
          <motion.span
            key="sparkle"
            initial={{ scale: 0, opacity: 1 }}
            animate={{
              scale: [0, 1.3, 1],
              opacity: [1, 0.8, 0],
              y: [-5, -15, -25],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{
              position: "absolute",
              top: "-5px",
              left: "50%",
              transform: "translateX(-50%)",
              color: "#ff7675",
              fontSize: "12px",
              pointerEvents: "none",
            }}
          >
            ✨
          </motion.span>
        )}
      </AnimatePresence>

      <span className="ms-1">{likeCount}</span>
    </motion.button>
  );
};


function Home() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likeLoading, setLikeLoading] = useState(null);
  const [comments, setComments] = useState([]);
const [newComment, setNewComment] = useState("");
const [commentLoading, setCommentLoading] = useState(false);

useEffect(() => {
  if (selectedImage) {
    fetchComments(selectedImage.id);
  }
}, [selectedImage]);

// Kommentek lekérése
// Kommentek lekérése
const fetchComments = async (imageId) => {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await fetch(`http://localhost:3001/api/images/${imageId}/comments`, {
      headers,
    });
    const data = await res.json();
    setComments(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error("❌ Komment lekérési hiba:", err);
  }
};


// Komment küldése
const handleCommentSubmit = async () => {
  if (!token) {
    navigate("/Registration");
    return;
  }
  if (!newComment.trim()) return;

  setCommentLoading(true);
  try {
    const res = await fetch(
      `http://localhost:3001/api/images/${selectedImage.id}/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comment: newComment }),
      }
    );

    if (res.ok) {
      setNewComment("");
      fetchComments(selectedImage.id);
    }
  } catch (err) {
    console.error("❌ Komment küldési hiba:", err);
  } finally {
    setCommentLoading(false);
  }
};

// Komment like
const handleCommentLike = async (commentId) => {
  if (!token) {
    navigate("/Registration");
    return;
  }

  try {
    const res = await fetch(`http://localhost:3001/api/comments/${commentId}/like`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      const updated = await res.json();
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? { ...c, likes: updated.likes, isLiked: updated.isLiked }
            : c
        )
      );
    }
  } catch (err) {
    console.error("❌ Komment like hiba:", err);
  }
};


  const navigate = useNavigate();

  // 🔹 Felhasználói adatok
  const userData = localStorage.getItem("user");
  const token = userData ? JSON.parse(userData).token : null;

  // 📸 Képek lekérése (publikus – nem kell token)
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch("http://localhost:3001/api/latest-images", { headers });
        const data = await res.json();
        setImages(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("❌ Képek lekérési hiba:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, [token]);

  // ❤️ Like frissítés (toggle)
  const handleLike = async (imageId) => {
    if (!token) {
      navigate("/Registration");
      return;
    }

    setLikeLoading(imageId);

    try {
      const res = await fetch(`http://localhost:3001/api/images/${imageId}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const updated = await res.json();

        setImages((prev) =>
          prev.map((img) =>
            img.id === imageId
              ? {
                  ...img,
                  likes: updated.likes,
                  isLiked: updated.isLiked,
                }
              : img
          )
        );

        setSelectedImage((prev) => {
          if (!prev) return prev;
          if (prev.id === imageId) {
            return {
              ...prev,
              likes: updated.likes,
              isLiked: updated.isLiked,
            };
          }
          return prev;
        });
      } else {
        console.error("❌ Like hiba:", await res.text());
      }
    } catch (err) {
      console.error("❌ Like fetch hiba:", err);
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

      {/* 📸 FŐ GRID */}
      <Container className="image-grid">
        {images.map((img) => (
          <div key={img.id} className="glass-card">
            <Card className="glass-inner">
              <div className="img-wrapper">
                <Card.Img variant="top" src={`http://localhost:3001${img.url}`} />
              </div>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <Card.Title className="m-0">{img.title}</Card.Title>

                  {/* ❤️ Like gomb (kártyán) */}
                  <AnimatedHeart
  isLiked={img.isLiked}
  likeCount={img.likes}
  disabled={likeLoading === img.id}
  onClick={() => handleLike(img.id)}
/>

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

      {/* 🪟 MODAL */}
      <Modal
        show={!!selectedImage}
        onHide={closeModal}
        centered
        size="lg"
        className="glass-modal"
      >
        {selectedImage && (
          <Modal.Body className="p-0">
            {/* HEADER */}
            <div className="glass-header">
              <h3 className="glass-title m-0">{selectedImage.title}</h3>
            </div>

            {/* KÉP */}
            <img
              src={`http://localhost:3001${selectedImage.url}`}
              alt={selectedImage.title}
              className="modal-image"
            />

            {/* INFO RÉSZ */}
            <div className="glass-info p-4">
              <div className="glass-info-top">
                <p className="glass-author mb-0">📷 {selectedImage.author}</p>

                {/* ❤️ Like gomb a modalban */}
                <AnimatedHeart
  isLiked={selectedImage.isLiked}
  likeCount={selectedImage.likes}
  disabled={likeLoading === selectedImage.id}
  onClick={() => handleLike(selectedImage.id)}
/>

              </div>

              <p className="glass-description mt-3 mb-0">
                {selectedImage.description}
              </p>

            {/* 💬 Komment szekció */}
<div className="comment-section mt-5 px-4 pb-4">
  <h5 className="mb-3">Hozzászólások</h5>

  {/* Új komment írása */}
  <div className="d-flex mb-3">
    <input
      type="text"
      className="form-control me-2"
      placeholder="Írj egy kommentet..."
      value={newComment}
      onChange={(e) => setNewComment(e.target.value)}
    />
    <Button
      variant="outline-light"
      onClick={handleCommentSubmit}
      disabled={commentLoading}
    >
      Küldés
    </Button>
  </div>

  {/* Komment lista */}
  {comments.length === 0 ? (
    <p className="text-muted">Még nincs komment ehhez a képhez.</p>
  ) : (
    comments.map((c) => (
      <div key={c.id} className="comment-item glass-comment mb-3 p-3 rounded-3">
        <div className="d-flex align-items-start">
          <img
            src={`http://localhost:3001${c.profile_picture}`}
            alt={c.username}
            className="rounded-circle me-3"
            width="40"
            height="40"
          />
          <div className="flex-grow-1">
            <div className="d-flex justify-content-between align-items-center">
              <strong>{c.username}</strong>
              <small className="text-muted">
                {new Date(c.created_at).toLocaleString("hu-HU")}
              </small>
            </div>
            <p className="mb-1">{c.comment}</p>
            <AnimatedCommentHeart
  isLiked={c.isLiked}
  likeCount={c.likes}
  disabled={likeLoading === c.id}
  onClick={() => handleCommentLike(c.id)}
/>

          </div>
        </div>
      </div>
    ))
  )}
</div>


              <div className="text-end mt-3">
                <Button variant="outline-light" onClick={closeModal}>
                  Bezárás
                </Button>
              </div>
            </div>
          </Modal.Body>
        )}
      </Modal>
    </div>
  );
}

export default Home;
