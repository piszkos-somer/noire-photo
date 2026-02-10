import React, { useState, useEffect, useRef } from "react";
import { Container, Form, Button, Row, Col, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ImageCard from "../components/ImageCard";
import ImageModal from "../components/ImageModal";
import { motion, AnimatePresence } from "framer-motion";
import "../css/Home.css";
import { handleTokenError } from "../utils/auth";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";



export const AnimatedHeart = ({ isLiked, onClick, }) => {
  const prevLiked = useRef(isLiked);

  useEffect(() => {
    prevLiked.current = isLiked;
  }, [isLiked]);


};

function Home() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likeLoading, setLikeLoading] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [query, setQuery] = useState("");
  const { user } = useContext(UserContext);
  const [feedType, setFeedType] = useState("foryou");
  // ----- admin delete image confirm (glass modal) -----
const [showDeleteImageModal, setShowDeleteImageModal] = useState(false);
const [deleteImageLoading, setDeleteImageLoading] = useState(false);
const [pendingDeleteImageId, setPendingDeleteImageId] = useState(null);

const askDeleteImage = (imageId) => {
  setPendingDeleteImageId(imageId);
  setShowDeleteImageModal(true);
};




  const navigate = useNavigate();
  const userData = localStorage.getItem("user");
  const token = userData ? JSON.parse(userData).token : null;

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Biztosan törölni akarod a kommentet?")) return;
  
    try {
      const res = await fetch(`http://localhost:3001/api/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (res.status === 401 || res.status === 403) {
        handleTokenError(res.status, navigate);
        return;
      }
  
      if (res.ok) {
        // frissítjük a frontendben a komment listát
        setComments((prev) => prev.filter((c) => c.id !== commentId));
      } else {
        alert("Hiba a komment törlésénél!");
      }
    } catch (err) {
      console.error("Komment törlés hiba:", err);
      alert("Hiba történt a komment törlésénél!");
    }
  };
  

  const confirmDeleteImage = async () => {
    if (!pendingDeleteImageId) return;
  
    setDeleteImageLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/api/images/${pendingDeleteImageId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (res.status === 401 || res.status === 403) {
        handleTokenError(res.status, navigate);
        return;
      }
  
      if (res.ok) {
        setImages((prev) => prev.filter((img) => img.id !== pendingDeleteImageId));
        if (selectedImage?.id === pendingDeleteImageId) closeModal();
      } else {
        alert("Hiba a kép törlésekor!");
      }
    } catch (err) {
      console.error("Kép törlés hiba:", err);
      alert("Hiba történt a törlés során!");
    } finally {
      setDeleteImageLoading(false);
      setShowDeleteImageModal(false);
      setPendingDeleteImageId(null);
    }
  };
  
  
  


  // JWT token dekódolása a user ID kinyeréséhez
  const getCurrentUserId = () => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id;
    } catch (err) {
      return null;
    }
  };

  const currentUserId = getCurrentUserId();

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const endpoint = feedType === "foryou" ? "/api/random-images" : "/api/following-images";
        const res = await fetch(`http://localhost:3001${endpoint}`, { headers });
        if (res.status === 401 || res.status === 403) {
          handleTokenError(res.status, navigate);
          return;
        }
        const data = await res.json();
        setImages(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Képek lekérési hiba:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [token, navigate, feedType]);

const handleImageVote = async (imageId, vote) => {
  if (!token) return navigate("/Registration");
  setLikeLoading(imageId);

  try {
    const res = await fetch(`http://localhost:3001/api/images/${imageId}/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ vote }),
    });

    if (res.status === 401 || res.status === 403) {
      handleTokenError(res.status, navigate);
      return;
    }

    if (res.ok) {
      const updated = await res.json(); 
      setImages((prev) =>
        prev.map((img) =>
          img.id === imageId
            ? {
                ...img,
                upvotes: updated.upvotes,
                downvotes: updated.downvotes,
                userVote: updated.userVote,
                likes: updated.upvotes,
                isLiked: updated.userVote === 1,
              }
            : img
        )
      );

      setSelectedImage((prev) =>
        prev && prev.id === imageId
          ? {
              ...prev,
              upvotes: updated.upvotes,
              downvotes: updated.downvotes,
              userVote: updated.userVote,
              likes: updated.upvotes,
              isLiked: updated.userVote === 1,
            }
          : prev
      );
    }
  } catch (err) {
    console.error("Kép szavazás hiba:", err);
  } finally {
    setLikeLoading(null);
  }
};


  const fetchComments = async (imageId) => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(
        `http://localhost:3001/api/images/${imageId}/comments`,
        { headers }
      );

      if (res.status === 401 || res.status === 403) {
        handleTokenError(res.status, navigate);
        return;
      }

      const data = await res.json();
      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Komment lekérési hiba:", err);
    }
  };

  const handleCommentSubmit = async () => {
    if (!token) return navigate("/Registration");
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

      if (res.status === 401 || res.status === 403) {
        handleTokenError(res.status, navigate);
        return;
      }

      if (res.ok) {
        setNewComment("");
        fetchComments(selectedImage.id);
      }
    } catch (err) {
      console.error("Komment küldési hiba:", err);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleCommentVote = async (commentId, vote) => {
    if (!token) return navigate("/Registration");
  
    try {
      const res = await fetch(`http://localhost:3001/api/comments/${commentId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ vote }),
      });
  
      if (res.status === 401 || res.status === 403) {
        handleTokenError(res.status, navigate);
        return;
      }
  
      if (res.ok) {
        const updated = await res.json();
        setComments((prev) =>
          prev.map((c) =>
            c.id === commentId
              ? {
                  ...c,
                  upvotes: updated.upvotes,
                  downvotes: updated.downvotes,
                  userVote: updated.userVote,
                  likes: updated.upvotes,
                  isLiked: updated.userVote === 1,
                }
              : c
          )
        );
      }
    } catch (err) {
      console.error("Komment szavazás hiba:", err);
    }
  };
  

  const openModal = (image) => {
    setSelectedImage(image);
    fetchComments(image.id);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setNewComment("");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/browse?q=${encodeURIComponent(query.trim())}`);
    setQuery("");
  };

  if (loading)
    return (
      <Container className="text-center py-5 text-light">
        <h3>Betöltés...</h3>
      </Container>
    );

  return (
    <div className="home-page py-5">
      <h1 className="text-center text-light mb-4 szinatmenet">
  Noire Photo Collection
</h1>


      <div
        className="glass-bubble text-center mx-auto mb-4 p-4 rounded-4 shadow-lg"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        style={{
          maxWidth: "600px",
          background: "rgba(255, 255, 255, 0.15)",
          color: "black",
        }}
      >
        <h5 className="mb-3">Az inspiráló fotós közösség</h5>
        <Form onSubmit={handleSearch}>
          <Row className="justify-content-center">
            <Col xs={10}>
              <div className="d-flex">
                <Form.Control
                  type="text"
                  placeholder="Keresés cím vagy leírás alapján..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="me-2"
                />
                <Button variant="outline-light" type="submit">
                  Keresés
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </div>

      <div
        className="feed-switch-container mx-auto mt-5 mb-5 p-3 rounded-4 glass-switch"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ maxWidth: "500px" }}
      >
        <div className="d-flex justify-content-center gap-3">
          <button
            className={`feed-btn ${feedType === "foryou" ? "active" : ""}`}
            onClick={() => {
              setFeedType("foryou");
            }}
          >
            Neked
          </button>

          <button
            className={`feed-btn ${feedType === "following" ? "active" : ""}`}
            onClick={() => {
              setFeedType("following");
            }}
            disabled={!token}
          >
            Követések
          </button>
        </div>
      </div>
      <Container className="image-grid">
  {images.map((img) => (
    <div key={img.id} style={{ position: "relative", display: "inline-block" }}>
      
      {/* ✅ Admin X gomb */}
      {user?.isAdmin && (
  <button
    onClick={() => askDeleteImage(img.id)}
    style={{
      position: "absolute",
      top: "8px",      // távolság a tetejétől
      right: "8px",    // távolság a jobbtól
      zIndex: 10,      // a kép fölé kerül
      background: "rgba(255,0,0,0.8)",
      color: "white",
      border: "none",
      borderRadius: "50%",
      width: "25px",
      height: "25px",
      cursor: "pointer",
      fontWeight: "bold",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
    title="Törlés"
  >
    X
  </button>
)}


      <ImageCard
        image={img}
        onVote={handleImageVote}
        onOpen={openModal}
        likeLoading={likeLoading}
      />
    </div>
  ))}
</Container>


      <ImageModal
        show={!!selectedImage}
        image={selectedImage}
        onClose={closeModal}
        onImageVote={handleImageVote}
        likeLoading={likeLoading}
        comments={comments}
        newComment={newComment}
        onCommentChange={(e) => setNewComment(e.target.value)}
        onCommentSubmit={handleCommentSubmit}
        commentLoading={commentLoading}
        onCommentVote={handleCommentVote}
      />

      {/* DELETE IMAGE CONFIRM MODAL */}
<Modal
  show={showDeleteImageModal}
  onHide={() => {
    if (deleteImageLoading) return;
    setShowDeleteImageModal(false);
    setPendingDeleteImageId(null);
  }}
  centered
  backdrop="static"
  keyboard={!deleteImageLoading}
  className="glass-modal glass-confirm"
>
  <Modal.Body className="p-0">
    <div className="glass-header d-flex justify-content-between align-items-center">
      <h3 className="glass-title m-0">Kép törlése</h3>
      <Button
        variant="link"
        onClick={() => {
          if (deleteImageLoading) return;
          setShowDeleteImageModal(false);
          setPendingDeleteImageId(null);
        }}
        className="text-dark p-0"
        style={{ fontSize: "24px", textDecoration: "none", lineHeight: 1 }}
      >
        ×
      </Button>
    </div>

    <div className="glass-info p-4">
      <p className="glass-description m-0">
        BIZTOS? Ez véglegesen törli a képet (és a hozzá tartozó vote/comment dolgokat is, ha a backend így kezeli).
      </p>

      <div className="d-flex justify-content-end gap-2 mt-3">
        <Button
          variant="outline-light"
          disabled={deleteImageLoading}
          onClick={() => {
            setShowDeleteImageModal(false);
            setPendingDeleteImageId(null);
          }}
        >
          Mégse
        </Button>

        <Button
          variant="outline-danger"
          disabled={deleteImageLoading}
          onClick={confirmDeleteImage}
        >
          {deleteImageLoading ? "Törlés..." : "Igen, törlöm"}
        </Button>
      </div>
    </div>
  </Modal.Body>
</Modal>

    </div>
  );
}

export default Home;
