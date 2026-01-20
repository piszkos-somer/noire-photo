import React, { useState, useEffect, useRef } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ImageCard from "../components/ImageCard";
import ImageModal from "../components/ImageModal";
import { motion, AnimatePresence } from "framer-motion";
import "../css/Home.css";
import { handleTokenError } from "../utils/auth";

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

  const [feedType, setFeedType] = useState("foryou");

  const navigate = useNavigate();
  const userData = localStorage.getItem("user");
  const token = userData ? JSON.parse(userData).token : null;

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
        console.error("Képek lekérési hiba:", err);
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
        console.error("Követett képek lekérése hiba:", err);
      } finally {
        setLoading(false);
      }
    };

    if (feedType === "foryou") fetchForYou();
    else if (token) fetchFollowing();
  }, [token, feedType, navigate]);

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
    <div key={img.id}>
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
    </div>
  );
}

export default Home;
