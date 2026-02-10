import React, { useState, useEffect, useContext } from "react";
import { Container, Form, Button, Row, Col, Modal } from "react-bootstrap";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import ImageCard from "../components/ImageCard";
import ImageModal from "../components/ImageModal";
import UserResultCard from "../components/UserResultCard";
import "../css/Browse.css";
import { handleTokenError } from "../utils/auth";
import InfiniteScroll from "react-infinite-scroll-component";
import { UserContext } from "../context/UserContext";

function Browse() {
  const [images, setImages] = useState([]);
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("image");
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

  const [showDeleteImageModal, setShowDeleteImageModal] = useState(false);
  const [deleteImageLoading, setDeleteImageLoading] = useState(false);
  const [pendingDeleteImageId, setPendingDeleteImageId] = useState(null);

  const askDeleteImage = (imageId) => {
    setPendingDeleteImageId(imageId);
    setShowDeleteImageModal(true);
  };
  const handleCommentSubmit = async () => {
    if (!token) return navigate("/Registration");
    if (!newComment.trim()) return;
    if (!selectedImage?.id) return;
  
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
              ? { ...c, upvotes: updated.upvotes, downvotes: updated.downvotes, userVote: updated.userVote }
              : c
          )
        );
      }
    } catch (err) {
      console.error("Komment vote hiba:", err);
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
        alert("Hiba a törlés során!");
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
      if (data.length < 12) setHasMore(false);

      setImages((prev) => {
        const newImages = data.filter((n) => !prev.some((e) => e.id === n.id));
        return [...prev, ...newImages];
      });
    } catch (err) {
      console.error("Képek lekérési hiba:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const qParam = urlParams.get("q");

    setUsers([]);
    setImages([]);
    setHasMore(true);
    setPage(1);

    if (tag) {
      setQuery(tag);
      setFilter("image");
      handleSearch(tag, "image");
    } else if (qParam) {
      setQuery(qParam);
      setFilter("image");
      handleSearch(qParam, "image");
    } else {
      fetchImages();
    }
    
  }, [tag, location.search]);

  const fetchMoreImages = () => {
    if (filter === "author" || !hasMore) return;
    setPage((prevPage) => prevPage + 1);
    fetchImages(page + 1);
  };

  const handleSearch = async (q = query, f = filter) => {
    setLoading(true);
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      if (f === "author") {
        const res = await fetch(
          `http://localhost:3001/api/users/search?q=${encodeURIComponent(q)}`,
          { headers }
        );
        if (res.status === 401 || res.status === 403) {
          handleTokenError(res.status, navigate);
          return;
        }
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
        setImages([]);
        setHasMore(false);
      } else {
        const res = await fetch(
          `http://localhost:3001/api/images/search?q=${encodeURIComponent(q)}`,
          { headers }
        );
        
        if (res.status === 401 || res.status === 403) {
          handleTokenError(res.status, navigate);
          return;
        }
        const data = await res.json();
        setImages(Array.isArray(data) ? data : []);
        setUsers([]);
        setHasMore(false);
      }
    } catch (err) {
      console.error("Keresési hiba:", err);
    } finally {
      setLoading(false);
    }
  };

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
              ? { ...img, upvotes: updated.upvotes, downvotes: updated.downvotes, userVote: updated.userVote }
              : img
          )
        );
        if (selectedImage?.id === imageId) {
          setSelectedImage((prev) => ({
            ...prev,
            upvotes: updated.upvotes,
            downvotes: updated.downvotes,
            userVote: updated.userVote,
          }));
        }
      }
    } catch (err) {
      console.error("Vote fetch hiba:", err);
    } finally {
      setLikeLoading(null);
    }
  };

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
      console.error("Komment lekérési hiba:", err);
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
      <h1 className="text-center text-light mb-5 szinatmenet">
        {filter === "author" ? "Feltöltők böngészése" : "Képek böngészése"}
      </h1>

      <Container className="mb-4">
        <Row className="justify-content-center">
          <Col md={8}>
            <div className="d-flex gap-2">
              <Form.Control
                type="text"
                placeholder={filter === "author"
                  ? "Keress feltöltőre"
                  : "Keresés képre"}
                
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
              />
              <Form.Select
  value={filter}
  onChange={(e) => {
    const newFilter = e.target.value;
    setFilter(newFilter);

    if (newFilter === "author") {
      setQuery("");
      handleSearch("", "author");
    } else {
      setUsers([]);
      setImages([]);
      setHasMore(true);
      setPage(1);

      if (query.trim()) {
        handleSearch(query, "image");
      } else {
        fetchImages(1);
      }
    }
  }}
  style={{ maxWidth: "150px" }}
>
  <option value="image">Kép</option>
  <option value="author">Feltöltő</option>
</Form.Select>


              <Button variant="outline-light" onClick={() => handleSearch()}>
                Keresés
              </Button>
            </div>
          </Col>
        </Row>
      </Container>

      {filter === "author" ? (
        <Container className="user-results-stack">
          {loading && <h4 className="text-center text-light py-5">Töltés...</h4>}

          {!loading && users.length === 0 && (
            <h5 className="text-center text-light py-5">Nincs találat.</h5>
          )}

          {users.map((u) => (
            <UserResultCard
              key={u.id}
              user={u}
              onOpenProfile={() => navigate(`/profile/${u.id}`)}
            />
          ))}
        </Container>
      ) : (
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
                {user?.isAdmin && (
                  <button
                    onClick={() => askDeleteImage(img.id)}
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

                <ImageCard image={img} onVote={handleImageVote} onOpen={openModal} likeLoading={likeLoading} searchQuery={query}/>
              </div>
            ))}
          </Container>
        </InfiniteScroll>
      )}

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
onCommentVote={handleCommentVote}

        
        commentLoading={commentLoading}
      />

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
            <p className="glass-description m-0">BIZTOS? Ez véglegesen törli a képet.</p>

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

              <Button variant="outline-danger" disabled={deleteImageLoading} onClick={confirmDeleteImage}>
                {deleteImageLoading ? "Törlés..." : "Igen, törlöm"}
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Browse;
