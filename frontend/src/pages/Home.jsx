import React, { useState, useEffect, useRef } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ImageCard from "../components/ImageCard";
import ImageModal from "../components/ImageModal";
import { motion, AnimatePresence } from "framer-motion";
import "../css/Home.css";
import { Heart } from "lucide-react";
import { handleTokenError } from "../utils/auth";

export const AnimatedHeart = ({ isLiked, onClick, disabled, likeCount }) => {
  const [animate, setAnimate] = useState(false);
  const [showSparkle, setShowSparkle] = useState(false);
  const prevLiked = useRef(isLiked);

  const handleClick = () => {
    setAnimate(true);
    if (!isLiked) {
      setShowSparkle(true);
      setTimeout(() => setShowSparkle(false), 500);
    }
    onClick();
    setTimeout(() => setAnimate(false), 500);
  };

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
          style={{ transition: "fill 0.25s ease" }}
        />
      </motion.div>

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
  const [query, setQuery] = useState("");

  // Feed type
  const [feedType, setFeedType] = useState("foryou");

  // 🔥 Animációk sebessége
  const INITIAL_ANIMATION_DURATION = 1; // lassú
  const FEED_SWITCH_DURATION = 0.2;       // gyors

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const transitionSpeed = isInitialLoad
    ? INITIAL_ANIMATION_DURATION
    : FEED_SWITCH_DURATION;

  const navigate = useNavigate();
  const userData = localStorage.getItem("user");
  const token = userData ? JSON.parse(userData).token : null;

  // 🔥 KÉSLELTETETT INITIAL LOAD RESET
  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => {
        setIsInitialLoad(false);
      }, 50);
      return () => clearTimeout(t);
    }
  }, [loading]);

  // Load képek
  useEffect(() => {
    const fetchForYou = async () => {
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch("http://localhost:3001/api/latest-images", {
          headers,
        });

        if (res.status === 401 || res.status === 403) {
          handleTokenError(res.status, navigate);
          return;
        }

        const data = await res.json();
        setImages(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("❌ Képek lekérési hiba:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchFollowing = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/following-images", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401 || res.status === 403) {
          handleTokenError(res.status, navigate);
          return;
        }

        const data = await res.json();
        setImages(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("❌ Követett képek lekérése hiba:", err);
      } finally {
        setLoading(false);
      }
    };

    if (feedType === "foryou") fetchForYou();
    else if (token) fetchFollowing();
  }, [token, feedType, navigate]);

  // Like helyett: upvote/downvote képekre
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
      body: JSON.stringify({ vote }), // 1 | -1 | 0
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
    console.error("❌ Kép szavazás hiba:", err);
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
      console.error("❌ Komment lekérési hiba:", err);
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
      console.error("❌ Komment küldési hiba:", err);
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
      console.error("❌ Komment szavazás hiba:", err);
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
      {/* Cím */}
      <motion.h1
        className="text-center text-light mb-4 szinatmenet"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: transitionSpeed }}
      >
        Noire Photo Collection
      </motion.h1>

      {/* Kereső */}
      <motion.div
        className="glass-bubble text-center mx-auto mb-4 p-4 rounded-4 shadow-lg"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: transitionSpeed }}
        style={{
          maxWidth: "600px",
          background: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(10px)",
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
      </motion.div>

      {/* Feed váltó */}
      <motion.div
        className="feed-switch-container mx-auto mt-5 mb-5 p-3 rounded-4 glass-switch"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: transitionSpeed }}
        style={{ maxWidth: "500px" }}
      >
        <div className="d-flex justify-content-center gap-3">
          <button
            className={`feed-btn ${feedType === "foryou" ? "active" : ""}`}
            onClick={() => {
              setIsInitialLoad(false);
              setFeedType("foryou");
            }}
          >
            Neked
          </button>

          <button
            className={`feed-btn ${feedType === "following" ? "active" : ""}`}
            onClick={() => {
              setIsInitialLoad(false);
              setFeedType("following");
            }}
            disabled={!token}
          >
            Követések
          </button>
        </div>
      </motion.div>

      {/* Képek */}
      <AnimatePresence mode="wait">
        <motion.div
          key={feedType}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: transitionSpeed }}
        >
          <Container className="image-grid">
            {images.map((img, index) => (
              <motion.div
                key={img.id + "-" + feedType}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.07,
                  duration: transitionSpeed,
                }}
              >
                <ImageCard
                 image={img}
                  onVote={handleImageVote}          
                  onOpen={openModal}
                  likeLoading={likeLoading}
                />

              </motion.div>
            ))}
          </Container>
        </motion.div>
      </AnimatePresence>

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
    </div>
  );
}

export default Home;
