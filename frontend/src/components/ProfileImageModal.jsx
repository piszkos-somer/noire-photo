// src/components/ImageModal.jsx
import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AnimatedCommentHeart from "../components/AnimatedCommentHeart";
import AnimatedHeart from "./AnimatedHeart";
import "../css/ImageModal.css";
import { getToken, getAuthHeader, handleTokenError } from "../utils/auth";
import { Share2, MessageCircle, ArrowUp, ArrowDown } from "lucide-react";



function ImageModal({
  show,
  image,
  onClose,
  onEdit,
  onImageVote,
  likeLoading,
  comments,
  newComment,
  onCommentChange,
  onCommentSubmit,
  commentLoading,
  onCommentVote,
}) {

  const navigate = useNavigate();
  const tokenUser = JSON.parse(localStorage.getItem("user"));
  const decoded = tokenUser?.token
    ? JSON.parse(atob(tokenUser.token.split(".")[1]))
    : null;
  const loggedInId = decoded?.id;
  const [localImage, setLocalImage] = useState(image);
const [showToast, setShowToast] = useState(false);
const [isFollowing, setIsFollowing] = useState(false);
  useEffect(() => {
    setLocalImage(image);
  }, [image]);
const handleDownload = async () => {
  const token = getToken();

  if (!token) {
    navigate("/Registration");
    return;
  }

  try {
    const response = await fetch(`http://localhost:3001${localImage.url}`, {
      headers: getAuthHeader(),
    });

    if (response.status === 401 || response.status === 403) {
      handleTokenError(response.status, navigate);
      return;
    }

    if (!response.ok) {
      handleTokenError(response.status, navigate);
      return;
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const filename = localImage.url.split("/").pop() || "kep.jpg";
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Letöltés hiba:", error);
  }
};

useEffect(() => {
  if (!show || !localImage) return;

  const token = getToken();
  if (!token) {
    setIsFollowing(false);
    return;
  }

  if (localImage.user_id == JSON.parse(localStorage.getItem("user"))?.id) {
    setIsFollowing(false);
    return;
  }

  const fetchFollowStatus = async () => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/follow/status/${localImage.user_id}`,
        { headers: getAuthHeader() }
      );

      if (res.status === 401 || res.status === 403) {
        handleTokenError(res.status);
        return;
      }

      const data = await res.json();
      setIsFollowing(data.following);
    } catch (err) {
      console.error("Követés státusz hiba:", err);
    }
  };

  fetchFollowStatus();
}, [show, localImage]);
  if (!show || !localImage) return null;

const handleUserClick = (userId) => {
  if (userId) navigate(`/viewprofile/${userId}`);
};

const handleShare = async () => {
  if (!localImage?.id || !localImage?.user_id) return;

  const shareUrl = `${window.location.origin}/viewprofile/${localImage.user_id}?image=${localImage.id}`;

  try {
    await navigator.clipboard.writeText(shareUrl);

    setShowToast(true);

    setTimeout(() => setShowToast(false), 2500);
  } catch (err) {
    console.error("Másolás hiba:", err);
  }
};

  const handleLikeClick = async () => {
    if (!localImage) return;
    await onLike(localImage.id);

    setLocalImage((prev) =>
      prev
        ? {
            ...prev,
            isLiked: !prev.isLiked,
            likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
          }
        : prev
    );
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg" className="glass-modal">
      {showToast && (
  <div className="share-toast glass-effect">
    📋 Link másolva a vágólapra!
  </div>
)}

      <Modal.Body className="p-0">
        <div className="glass-header">
          <h3 className="glass-title m-0">{localImage?.title || "Kép megtekintése"}</h3>
        </div>

        {localImage?.url && (
          <img
            src={`http://localhost:3001${localImage.url}`}
            alt={localImage?.title || ""}
            className="modal-image"
          />
        )}

        <div className="glass-info p-4">
<div className="glass-info-top d-flex justify-content-between align-items-center flex-wrap gap-2">

  <div className="d-flex align-items-center gap-2">

    <div
  className="px-3 py-2 rounded-3 glass-bubble"
  style={{
    backdropFilter: "blur(10px)",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    boxShadow: "0 0 10px rgba(255,255,255,0.15)",
  }}
  onClick={() => handleUserClick(localImage?.user_id)}
>
  📷 {localImage?.author || "Ismeretlen szerző"}
</div>




{localImage?.user_id !== loggedInId && (
  <Button
    variant="outline-dark"
    size="sm"
    className="ms-2"
    onClick={async (e) => {
      e.stopPropagation();
      const token = getToken();
      if (!token) return navigate("/Login");

      const res = await fetch(
        `http://localhost:3001/api/follow/${localImage.user_id}`,
        { method: "POST", headers: getAuthHeader() }
      );
      const data = await res.json();
      setIsFollowing(data.following);
    }}
  >
    {isFollowing ? "Követem" : "Követés"}
  </Button>
)}



    <div
      className="px-3 py-2 rounded-3 glass-bubble"
      style={{
        backdropFilter: "blur(10px)",
        display: "inline-flex",
        alignItems: "center",
        boxShadow: "0 0 10px rgba(255,255,255,0.15)",
      }}
    >
      <Button
        variant="outline-light"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          handleDownload();
        }}
      >
        ⬇️ Letöltés
      </Button>
    </div>
  </div>

  <div className="d-flex align-items-center gap-3">
    <Share2
      size={22}
      className="cursor-pointer text-light"
      title="Megosztás"
      color="black"
      onClick={() => handleShare()}
      style={{ opacity: 0.8 }}
    />
<div className="d-flex align-items-center">
    <MessageCircle
      size={21}
      color="black"
      className="me-1"
      strokeWidth={2}
      title="Hozzászólások"
    />
    <span style={{ color: "black", fontWeight: 500 }}>
      {comments?.length || 0}
    </span>
  </div>
  {(() => {
  const up = localImage?.upvotes || localImage?.likes || 0;
  const down = localImage?.downvotes || 0;
  const total = up + down;
  const upPercent = total ? Math.round((up / total) * 100) : 0;
  const downPercent = total ? 100 - upPercent : 0;
  const userVote = localImage?.userVote || (localImage?.isLiked ? 1 : 0);

  return (
    <div className="d-flex align-items-center gap-1">
      <button
        type="button"
        className="btn btn-sm p-0 mx-1"
        disabled={likeLoading === localImage?.id}
        onClick={(e) => {
          e.stopPropagation();
          const nextVote = userVote === 1 ? 0 : 1;
          onImageVote(localImage.id, nextVote);
        }}
      >
        <ArrowUp
          size={22}
          color={userVote === 1 ? "#16a34a" : "#555"}
          fill={userVote === 1 ? "#16a34a" : "none"}
        />
      </button>
      <span className="small me-1">{upPercent}%</span>

      <button
        type="button"
        className="btn btn-sm p-0 mx-1"
        disabled={likeLoading === localImage?.id}
        onClick={(e) => {
          e.stopPropagation();
          const nextVote = userVote === -1 ? 0 : -1;
          onImageVote(localImage.id, nextVote);
        }}
      >
        <ArrowDown
          size={22}
          color={userVote === -1 ? "#dc2626" : "#555"}
          fill={userVote === -1 ? "#dc2626" : "none"}
        />
      </button>
      <span className="small">{downPercent}%</span>
    </div>
  );
})()}

  </div>
</div>





          <p className="glass-description mt-3 mb-0">
            {localImage?.description || "Nincs leírás."}
          </p>

          <div className="comment-section mt-5 px-4 pb-4">
            <h5 className="mb-3">Hozzászólások</h5>

            <div className="d-flex mb-3">
            <input
  type="text"
  className="form-control me-2"
  placeholder="Írj egy kommentet..."
  value={newComment || ""}
  onChange={onCommentChange || (() => {})}
/>

              <Button
                variant="outline-light"
                onClick={onCommentSubmit}
                disabled={commentLoading}
              >
                Küldés
              </Button>
            </div>

            {!comments || comments.length === 0 ? (
              <p className="text-muted">Még nincs komment ehhez a képhez.</p>
            ) : (
              comments.map((c) => (
                <div
                  key={c.id}
                  className="comment-item glass-comment mb-3 p-3 rounded-3"
                >
                  <div className="d-flex align-items-start">
                    <img
                      src={`http://localhost:3001${c.profile_picture}`}
                      alt={c.username}
                      className="rounded-circle me-3"
                      width="40"
                      height="40"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleUserClick(c.user_id)}
                    />
                    <div className="flex-grow-1 position-relative">
                      <div className="d-flex justify-content-between align-items-center">
                        <strong
                          style={{ cursor: "pointer" }}
                          onClick={() => handleUserClick(c.user_id)}
                        >
                          {c.username}
                        </strong>
                        <small className="text-muted">
                          {new Date(c.created_at).toLocaleString("hu-HU")}
                        </small>
                      </div>
                      <p className="mb-1">{c.comment}</p>

                      <div className="comment-like d-flex align-items-center gap-1 mt-1">
  {(() => {
    const up = c.upvotes || c.likes || 0;
    const down = c.downvotes || 0;
    const total = up + down;
    const upPercent = total ? Math.round((up / total) * 100) : 0;
    const downPercent = total ? 100 - upPercent : 0;
    const userVote = c.userVote || (c.isLiked ? 1 : 0);

    return (
      <>
        <button
          type="button"
          className="btn btn-sm p-0"
          disabled={likeLoading === c.id}
          onClick={() => {
            const nextVote = userVote === 1 ? 0 : 1;
            onCommentVote(c.id, nextVote);
          }}
        >
          <ArrowUp
            size={18}
            color={userVote === 1 ? "#16a34a" : "#555"}
            fill={userVote === 1 ? "#16a34a" : "none"}
          />
        </button>
        <span className="small me-1">{upPercent}%</span>

        <button
          type="button"
          className="btn btn-sm p-0"
          disabled={likeLoading === c.id}
          onClick={() => {
            const nextVote = userVote === -1 ? 0 : -1;
            onCommentVote(c.id, nextVote);
          }}
        >
          <ArrowDown
            size={18}
            color={userVote === -1 ? "#dc2626" : "#555"}
            fill={userVote === -1 ? "#dc2626" : "none"}
          />
        </button>
        <span className="small">{downPercent}%</span>
      </>
    );
  })()}
</div>

                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="text-end mt-3">
            <Button variant="outline-light" onClick={onClose}>
              Bezárás
            </Button>
            <Button
  variant="secondary"
  onClick={() => {
    onClose();
    onEdit(image);
  }}
>
  Szerkesztés
</Button>

          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default ImageModal;
