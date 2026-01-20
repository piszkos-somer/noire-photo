// src/pages/ViewProfile.jsx
import React, { useState, useEffect, useContext, useMemo } from "react";
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

  // ----- auth / token -----
  const userDataRaw = localStorage.getItem("user");
  const parsedLocalUser = useMemo(() => {
    try {
      return userDataRaw ? JSON.parse(userDataRaw) : null;
    } catch {
      return null;
    }
  }, [userDataRaw]);

  const token = useMemo(() => {
    // prefer Context token if exists, else localStorage token
    return user?.token || parsedLocalUser?.token || null;
  }, [user?.token, parsedLocalUser?.token]);

  const loggedInId = useMemo(() => {
    // 1) if local user contains id directly
    if (parsedLocalUser?.id) return parsedLocalUser.id;

    // 2) try decode JWT payload { id: ... }
    try {
      const t = token;
      if (!t) return null;
      const payload = JSON.parse(atob(t.split(".")[1]));
      return payload?.id ?? null;
    } catch {
      return null;
    }
  }, [parsedLocalUser?.id, token]);

  // ----- page state -----
  const [profile, setProfile] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // follow state (profile owner)
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  // modal
  const [selectedImage, setSelectedImage] = useState(null);
  const [hasOpenedFromLink, setHasOpenedFromLink] = useState(false);

  // comments
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  // voting UI
  const [likeLoading, setLikeLoading] = useState(null);

  // ----- fetch profile -----
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

    fetchProfile();
  }, [id, navigate]);

  // ----- fetch images -----
  useEffect(() => {
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

    setLoading(true);
    fetchImages();
  }, [id, token, navigate]);

  // ----- follow status for the viewed profile -----
  useEffect(() => {
    const viewedId = Number(id);

    if (!viewedId || !token) {
      setIsFollowing(false);
      return;
    }

    // ne kérdezd le / ne mutasd, ha a saját profilod
    if (loggedInId && viewedId === Number(loggedInId)) {
      setIsFollowing(false);
      return;
    }

    const fetchFollowStatus = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/follow/status/${viewedId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401 || res.status === 403) {
          handleTokenError(res.status, navigate);
          return;
        }

        if (!res.ok) return;

        const data = await res.json();
        setIsFollowing(!!data.following);
      } catch (e) {
        console.error("Követés státusz lekérés hiba:", e);
      }
    };

    fetchFollowStatus();
  }, [id, token, loggedInId, navigate]);

  // ----- deep link: open modal from ?image=ID -----
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

  // ----- comments -----
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

  // ----- image vote (up/down/neutral) -----
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

  // ----- comment submit -----
  const handleCommentSubmit = async () => {
    if (!token) return navigate("/Registration");
    if (!newComment.trim()) return;
    if (!selectedImage?.id) return;

    setCommentLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/api/images/${selectedImage.id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comment: newComment }),
      });

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

  /**
   * Komment vote kezelő.
   * A te backend-ednél eddig csak /like volt body nélkül.
   * Itt kompatibilisen:
   * - ha kap vote-ot, elküldjük body-val (ha a backend már tudja),
   * - ha nem, akkor "toggle like" jelleggel hívjuk.
   */
  const handleCommentVote = async (commentId, vote) => {
    if (!token) return navigate("/Registration");

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const hasVote = typeof vote === "number";

      const res = await fetch(`http://localhost:3001/api/comments/${commentId}/like`, {
        method: "POST",
        headers: hasVote
          ? { ...headers, "Content-Type": "application/json" }
          : headers,
        body: hasVote ? JSON.stringify({ vote }) : undefined,
      });

      if (res.status === 401 || res.status === 403) {
        handleTokenError(res.status, navigate);
        return;
      }

      if (res.ok) {
        const updated = await res.json();
        // támogasd mindkét formátumot (likes / upvotes+downvotes / isLiked / userVote)
        setComments((prev) =>
          prev.map((c) =>
            c.id === commentId
              ? {
                  ...c,
                  likes: updated.likes ?? c.likes,
                  upvotes: updated.upvotes ?? c.upvotes,
                  downvotes: updated.downvotes ?? c.downvotes,
                  isLiked: updated.isLiked ?? c.isLiked,
                  userVote: updated.userVote ?? c.userVote,
                }
              : c
          )
        );
      }
    } catch (err) {
      console.error("Komment vote hiba:", err);
    }
  };

  // ----- modal open/close -----
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

  // ----- follow toggle for the viewed profile -----
  const handleFollowToggle = async () => {
    if (!token) return navigate("/Registration");

    const viewedId = Number(id);
    if (!viewedId) return;

    // ne engedd saját magadra
    if (loggedInId && viewedId === Number(loggedInId)) return;

    setFollowLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/api/follow/${viewedId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401 || res.status === 403) {
        handleTokenError(res.status, navigate);
        return;
      }

      const data = await res.json();
      setIsFollowing(!!data.following);
    } catch (e) {
      console.error("Follow toggle hiba:", e);
    } finally {
      setFollowLoading(false);
    }
  };

  // ----- loading -----
  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  const viewedIdNum = Number(id);
  const isOwnProfile = !!(loggedInId && viewedIdNum === Number(loggedInId));

  return (
    <Container className="py-5">
      {/* PROFILE HEADER */}
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

          {/* ✅ FOLLOW BUTTON ON PROFILE PAGE */}
          {!isOwnProfile && token && (
            <div className="mt-3">
              <Button
                variant={isFollowing ? "secondary" : "primary"}
                onClick={handleFollowToggle}
                disabled={followLoading}
              >
                {isFollowing ? "Követés leállítása" : "Követés"}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* IMAGES GRID */}
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

      {/* IMAGE MODAL */}
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
    </Container>
  );
}

export default ViewProfile;
