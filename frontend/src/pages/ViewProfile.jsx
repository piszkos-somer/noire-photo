// src/pages/ViewProfile.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Container, Row, Spinner } from "react-bootstrap";
import ImageCard from "../components/ImageCard";
import ImageModal from "../components/ImageModal";
import "../css/Profile.css";
import "../css/Home.css";

function ViewProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [profile, setProfile] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [likeLoading, setLikeLoading] = useState(null);
  const [commentLoading, setCommentLoading] = useState(false);
  const [hasOpenedFromLink, setHasOpenedFromLink] = useState(false);

  const userData = localStorage.getItem("user");
  const token = userData ? JSON.parse(userData).token : null;

  // 🔹 Profil és képek betöltése
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/users/${id}`);
        if (!res.ok) throw new Error("Profil nem található");
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error("Profil betöltési hiba:", err);
      }
    };

    const fetchImages = async () => {
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch(`http://localhost:3001/api/user-images/${id}`, { headers });
        const data = await res.json();
        setImages(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Képek betöltési hiba:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    fetchImages();
  }, [id, token]);

  // 🔹 URL paraméter alapján modal megnyitása (csak egyszer)
  useEffect(() => {
  const params = new URLSearchParams(location.search);
  const imageId = params.get("image");

  // Csak akkor nyissa meg, ha:
  // - van image paraméter
  // - betöltöttek a képek
  // - még nem nyitottuk meg korábban
  // - és jelenleg nincs nyitva modal
  if (imageId && images.length > 0 && !hasOpenedFromLink && !selectedImage) {
    const img = images.find((i) => i.id.toString() === imageId.toString());
    if (img) {
      openModal(img);
      setHasOpenedFromLink(true);
    }
  }
}, [location.search, images, hasOpenedFromLink, selectedImage]);


  // 🔹 Kommentek lekérése
  const fetchComments = async (imageId) => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`http://localhost:3001/api/images/${imageId}/comments`, { headers });
      const data = await res.json();
      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Komment lekérési hiba:", err);
    }
  };

  // 🔹 Like gomb
  const handleLike = async (imageId) => {
    if (!token) return navigate("/Registration");
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
              ? { ...img, likes: updated.likes, isLiked: updated.isLiked }
              : img
          )
        );
        setSelectedImage((prev) =>
          prev && prev.id === imageId
            ? { ...prev, likes: updated.likes, isLiked: updated.isLiked }
            : prev
        );
      }
    } catch (err) {
      console.error("❌ Like fetch hiba:", err);
    } finally {
      setLikeLoading(null);
    }
  };

  // 🔹 Új komment
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

  // 🔹 Komment like
  const handleCommentLike = async (commentId) => {
    if (!token) return navigate("/Registration");
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

  // 🔹 Modal kezelése
  const openModal = (image) => {
    setSelectedImage(image);
    fetchComments(image.id);
  };

  const closeModal = () => {
  setSelectedImage(null);
  setComments([]);

  // ❗ Jelöld, hogy a linkes nyitás befejeződött
  setHasOpenedFromLink(true);

  // 🔹 Távolítsuk el a ?image paramétert az URL-ből
  const params = new URLSearchParams(location.search);
  if (params.has("image")) {
    params.delete("image");
    navigate(`${location.pathname}${params.toString() ? "?" + params.toString() : ""}`, {
      replace: true,
    });
  }
};

  if (loading)
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );

  return (
    <Container className="py-5">
      {profile && (
        <div className="text-center mb-5">
          <img
            src={
              profile.profile_picture
                ? `http://localhost:3001${profile.profile_picture}`
                : "/profile-pictures/default.png"
            }
            alt={profile.username}
            className="rounded-circle shadow-sm"
            width={180}
            height={180}
          />
          <h2 className="mt-3">{profile.username}</h2>
          <p className="text-muted">{profile.bio || "Nincs bio megadva."}</p>
        </div>
      )}

      <h3 className="text-center mb-4">📸 {profile?.username} képei</h3>

      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {images.map((img) => (
          <ImageCard
            key={img.id}
            image={img}
            onLike={handleLike}
            onOpen={openModal}
            likeLoading={likeLoading}
          />
        ))}
      </Row>

      {/* 🪟 Modal megjelenítése */}
      <ImageModal
        show={!!selectedImage}
        image={selectedImage}
        onClose={closeModal}
        onLike={handleLike}
        likeLoading={likeLoading}
        comments={comments}
        newComment={newComment}
        onCommentChange={(e) => setNewComment(e.target.value)}
        onCommentSubmit={handleCommentSubmit}
        commentLoading={commentLoading}
        onCommentLike={handleCommentLike}
      />
    </Container>
  );
}

export default ViewProfile;
