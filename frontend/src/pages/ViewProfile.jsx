// src/pages/ViewProfile.jsx
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Container, Row, Spinner, Button } from "react-bootstrap";
import ImageCard from "../components/ImageCard";
import ImageModal from "../components/ImageModal";
import "../css/Profile.css";
import "../css/Home.css";
import { handleTokenError } from "../utils/auth";
import { UserContext } from "../context/UserContext";

function ViewProfile() {
  const { user } = useContext(UserContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [isFollowing, setIsFollowing] = useState(false);
  const [viewedUser, setViewedUser] = useState(null);
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

  useEffect(() => {
    const url = window.location.pathname;
    const match = url.match(/viewprofile\/(\d+)/);
    const viewedId = match ? parseInt(match[1]) : null;
  
    if (viewedId && user?.token) {
      fetch(`http://localhost:3001/api/follow/status/${viewedId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
        .then(res => res.json())
        .then(data => setIsFollowing(data.following))
        .catch(console.error);
  
      fetch(`http://localhost:3001/api/users/${viewedId}`)
        .then(res => res.json())
        .then(data => setViewedUser(data));
    }
  }, [user]);
  
  // 🔹 Profil és képek betöltése
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/users/${id}`);
        if (res.status === 401 || res.status === 403) {
  handleTokenError(res.status, navigate);
  return;
}
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
        if (res.status === 401 || res.status === 403) {
  handleTokenError(res.status, navigate);
  return;
}
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
}, []); 

  useEffect(() => {
  const params = new URLSearchParams(location.search);
  const imageId = params.get("image");

  if (imageId && images.length > 0 && !hasOpenedFromLink && !selectedImage) {
    const img = images.find((i) => i.id.toString() === imageId.toString());
    if (img) {
      openModal(img);
      setHasOpenedFromLink(true);
    }
  }
}, [location.search, images, hasOpenedFromLink, selectedImage]);


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

  const handleCommentLike = async (commentId) => {
    if (!token) return navigate("/Registration");
    try {
      const res = await fetch(`http://localhost:3001/api/comments/${commentId}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
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
              ? { ...c, likes: updated.likes, isLiked: updated.isLiked }
              : c
          )
        );
      }
    } catch (err) {
      console.error("Komment like hiba:", err);
    }
  };

  const openModal = (image) => {
    setSelectedImage(image);
    fetchComments(image.id);
  };

  const closeModal = () => {
  setSelectedImage(null);
  setComments([]);

  setHasOpenedFromLink(true);

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
{viewedUser && (
  <div className="text-center mb-3">
    <h3>{viewedUser.username}</h3>
    <Button
      variant={isFollowing ? "secondary" : "primary"}
      onClick={async () => {
        const res = await fetch(
          `http://localhost:3001/api/follow/${viewedUser.id}`,
          { method: "POST", headers: { Authorization: `Bearer ${user.token}` } }
        );
        const data = await res.json();
        setIsFollowing(data.following);
      }}
    >
      {isFollowing ? "Követem" : "Követés"}
    </Button>
  </div>
)}

      <h3 className="text-center mb-4">📸 {profile?.username} képei</h3>

      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {images.map((img) => (
          <ImageCard
          key={img.id}
          image={img}
          onVote={handleImageVote}
          onOpen={openModal}
          likeLoading={likeLoading}
        />
        
        ))}
      </Row>

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
  onCommentLike={handleCommentLike}
/>

    </Container>
  );
}

export default ViewProfile;
