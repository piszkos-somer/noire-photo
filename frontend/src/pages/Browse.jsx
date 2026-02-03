// src/pages/Browse.jsx
import React, { useState, useEffect } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import ImageCard from "../components/ImageCard";
import ImageModal from "../components/ImageModal";
import "../css/Browse.css";
import { handleTokenError } from "../utils/auth";
import InfiniteScroll from "react-infinite-scroll-component";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";


function Browse() {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("title");
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [likeLoading, setLikeLoading] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { user } = useContext(UserContext);


  const navigate = useNavigate();
  const { tag } = useParams();
  const location = useLocation();

  const userData = localStorage.getItem("user");
  const token = userData ? JSON.parse(userData).token : null;

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm("Biztosan törölni akarod a képet?")) return;
  
    try {
      const res = await fetch(`http://localhost:3001/api/images/${imageId}`, {
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
        setImages((prev) => prev.filter((img) => img.id !== imageId));
        if (selectedImage?.id === imageId) closeModal();
      } else {
        alert("Hiba a törlés során!");
      }
    } catch (err) {
      console.error("Kép törlés hiba:", err);
      alert("Hiba történt a törlés során!");
    }
  };
  

  const fetchImages = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`http://localhost:3001/api/images?page=${pageNumber}&limit=12`, { headers });
      if (res.status === 401 || res.status === 403) {
        handleTokenError(res.status, navigate);
        return;
      }
      const data = await res.json();
      if (data.length < 12) {
        setHasMore(false);
      }
      setImages((prev) => {
        const newImages = data.filter(newImage => !prev.some(existingImage => existingImage.id === newImage.id));
        return [...prev, ...newImages];
      });
    } catch (err) {
      console.error("❌ Képek lekérési hiba:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const qParam = urlParams.get("q");

    if (tag) {
      setQuery(tag);
      setFilter("tag");
      handleSearch(tag, "tag");
    } else if (qParam) {
      setQuery(qParam);
      setFilter("title");
      handleSearch(qParam, "title");
    } else {
      fetchImages();
    }
  }, [tag, location.search]);

  const fetchMoreImages = () => {
    setPage((prevPage) => prevPage + 1);
    fetchImages(page + 1);
  };

  // 🔍 Keresés backendről
  const handleSearch = async (q = query, f = filter) => {
    setLoading(true);
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(
        `http://localhost:3001/api/images/search?q=${encodeURIComponent(q)}&filter=${f}`,
        { headers }
      );
      if (res.status === 401 || res.status === 403) {
        handleTokenError(res.status, navigate);
        return;
      }
      const data = await res.json();
      setImages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ Keresési hiba:", err);
    } finally {
      setLoading(false);
    }
  };

  // ❤️ Kép vote kezelése
  const handleImageVote = async (imageId, vote) => {
    if (!token) return navigate("/Registration");
    setLikeLoading(imageId);
    try {
      const res = await fetch(`http://localhost:3001/api/images/${imageId}/like`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ vote })
      });
      if (res.status === 401 || res.status === 403) {
        handleTokenError(res.status, navigate);
        return;
      }
      if (res.ok) {
        const updated = await res.json();
        setImages((prev) =>
          prev.map((img) =>
            img.id === imageId ? { ...img, upvotes: updated.upvotes, downvotes: updated.downvotes, userVote: updated.userVote } : img
          )
        );
        if (selectedImage?.id === imageId) {
          setSelectedImage(prev => ({
            ...prev,
            upvotes: updated.upvotes,
            downvotes: updated.downvotes,
            userVote: updated.userVote
          }));
        }
      }
    } catch (err) {
      console.error("❌ Vote fetch hiba:", err);
    } finally {
      setLikeLoading(null);
    }
  };

  // ❤️ Like kezelése
  const handleLike = async (imageId) => {
    if (!token) return navigate("/Registration");
    setLikeLoading(imageId);
    try {
      const res = await fetch(`http://localhost:3001/api/images/${imageId}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401 || res.status === 403) {
        handleTokenError(res.status, navigate);
        return;
      }
      if (res.ok) {
        const updated = await res.json();
        setImages((prev) =>
          prev.map((img) =>
            img.id === imageId ? { ...img, likes: updated.likes, isLiked: updated.isLiked } : img
          )
        );
      }
    } catch (err) {
      console.error("❌ Like fetch hiba:", err);
    } finally {
      setLikeLoading(null);
    }
  };

  // 💬 Kommentek
  const fetchComments = async (imageId) => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`http://localhost:3001/api/images/${imageId}/comments`, { headers });
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
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ vote })
      });
      if (res.status === 401 || res.status === 403) {
        handleTokenError(res.status, navigate);
        return;
      }
      if (res.ok) {
        const updated = await res.json();
        setComments((prev) =>
          prev.map((c) =>
            c.id === commentId ? { ...c, upvotes: updated.upvotes, downvotes: updated.downvotes, userVote: updated.userVote } : c
          )
        );
      }
    } catch (err) {
      console.error("❌ Komment vote hiba:", err);
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

  return (
    <div className="home-page py-5">
      <h1 className="text-center text-light mb-5 szinatmenet">Képek böngészése</h1>

      {/* 🔍 Kereső és szűrő */}
      <Container className="mb-4">
        <Row className="justify-content-center">
          <Col md={8}>
            <div className="d-flex gap-2">
              <Form.Control
                type="text"
                placeholder="Keresés cím, leírás, tag vagy feltöltő alapján..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
              />
              <Form.Select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                style={{ maxWidth: "150px" }}
              >
                <option value="title">Cím / Leírás</option>
                <option value="tag">Tag</option>
                <option value="author">Feltöltő</option>
              </Form.Select>
              <Button variant="outline-light" onClick={() => handleSearch()}>
                Keresés
              </Button>
            </div>
          </Col>
        </Row>
      </Container>

      <InfiniteScroll
        dataLength={images.length}
        next={fetchMoreImages}
        hasMore={hasMore}
        loader={<h4 className="text-center text-light py-5">Töltés...</h4>}
        endMessage={<h5 className="text-center text-light py-5">Nincs több kép.</h5>}
      >
        <Container className="image-grid">
        {images.map((img) => (
  <div key={img.id} style={{ position: "relative", display: "inline-block" }}>
    
    {/* ✅ Admin X gomb */}
    {user?.isAdmin && (
      <button
        onClick={() => handleDeleteImage(img.id)}
        style={{
          position: "absolute",
          top: "8px",
          right: "8px",
          zIndex: 10,
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
      </InfiniteScroll>

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

export default Browse;
