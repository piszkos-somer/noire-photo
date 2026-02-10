import React, { useEffect, useState } from "react";
import { Card, Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { MessageCircle, ArrowUp, ArrowDown } from "lucide-react";
import "../css/ImageCard.css";
import { handleTokenError } from "../utils/auth";
import { highlightText } from "../utils/highlight";


function ImageCard({ image, onVote, onOpen, likeLoading, isAdmin, token, onDeleted, searchQuery }) {

  const navigate = useNavigate();
  const [commentCount, setCommentCount] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  const askDelete = (e) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!token) return navigate("/Registration");

    setDeleteLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/api/images/${image.id}`, {
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
        setShowDeleteModal(false);
        onDeleted?.(image.id);
      } else {
        alert("Hiba a kép törlésekor!");
      }
    } catch (err) {
      console.error("Kép törlés hiba:", err);
      alert("Hiba történt a törlés során!");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleAuthorClick = () => {
    if (image.user_id) {
      navigate(`/profile/${image.user_id}`);
    }
  };

  useEffect(() => {
    fetch(`http://localhost:3001/api/images/${image.id}/comment-count`)
      .then((res) => res.json())
      .then((data) => setCommentCount(data.count))
      .catch((err) => console.error("Komment szám lekérése sikertelen:", err));
  }, [image.id]);

  const handleTagClick = (e, tag) => {
    e.stopPropagation();
    navigate(`/browse/${encodeURIComponent(tag)}`);
  };
  const normalizedTags = React.useMemo(() => {
    if (!image.tags) return [];
  
    let tagsArray = [];
  
    if (Array.isArray(image.tags)) {
      tagsArray = image.tags;
    } else if (typeof image.tags === "string") {
      tagsArray = image.tags.split(",").map(tag => tag.trim());
    }
  
    return [...new Set(tagsArray)].filter(tag => tag !== "");
  }, [image.tags]);
  return (
    <div className="glass-card" style={{ position: "relative" }}>
      
      {isAdmin && (
  <button
    onClick={askDelete}
    title="Kép törlése"
    aria-label="Kép törlése"
    style={{
      position: "absolute",
      top: "8px",
      right: "8px",
      zIndex: 10,
      background: "rgba(255,0,0,0.85)",
      color: "white",
      border: "none",
      borderRadius: "50%",
      width: "26px",
      height: "26px",
      cursor: "pointer",
      fontWeight: "bold",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    X
  </button>
)}

      <Card className="glass-inner">
        <div className="img-wrapper" onClick={() => onOpen(image)} style={{ cursor: "pointer" }}>
        <Card.Img
  variant="top"
  src={`http://localhost:3001${image.url}`}
  alt={image.title}
  onContextMenu={(e) => e.preventDefault()}
  draggable={false}
  onDragStart={(e) => e.preventDefault()}
/>

        </div>

        <Card.Body>
<div className="d-flex justify-content-between align-items-start mb-2">
  <h5 className="info-bubble img-title">{highlightText(image.title, searchQuery)}</h5>

  <div className="text-end">
    <div className="d-flex align-items-center justify-content-end gap-1">
      {(() => {
        const up = image.upvotes || image.likes || 0;
        const down = image.downvotes || 0;
        const total = up + down;
        const upPercent = total ? Math.round((up / total) * 100) : 0;
        const downPercent = total ? 100 - upPercent : 0;
        const userVote = image.userVote || (image.isLiked ? 1 : 0);

        return (
          <>
            <button
              type="button"
              className="btn btn-sm p-0 mx-1"
              disabled={likeLoading === image.id}
              onClick={(e) => {
                e.stopPropagation();
                const nextVote = userVote === 1 ? 0 : 1;
                onVote(image.id, nextVote);
              }}
            >
              <ArrowUp
                size={20}
                color={userVote === 1 ? "#16a34a" : "#555"}
                fill={userVote === 1 ? "#16a34a" : "none"}
              />
            </button>
            <span className="small me-1">{upPercent}%</span>

            <button
              type="button"
              className="btn btn-sm p-0 mx-1"
              disabled={likeLoading === image.id}
              onClick={(e) => {
                e.stopPropagation();
                const nextVote = userVote === -1 ? 0 : -1;
                onVote(image.id, nextVote);
              }}
            >
              <ArrowDown
                size={20}
                color={userVote === -1 ? "#dc2626" : "#555"}
                fill={userVote === -1 ? "#dc2626" : "none"}
              />
            </button>
            <span className="small">{downPercent}%</span>
          </>
        );
      })()}
    </div>

    <div className="comment-counter mt-1">
      <MessageCircle size={18} className="comment-icon" />
      <span>{commentCount}</span>
    </div>
  </div>
</div>


          {image.author && (
            <div
              className="info-bubble author"
              style={{ cursor: "pointer" }}
              onClick={handleAuthorClick}
            >
              📷 {image.author}
            </div>
          )}

          {image.description && (
            <div className="info-bubble text"><p>{highlightText(image.description, searchQuery)}</p>
</div>
          )}

{normalizedTags.length > 0 && (
  <div className="d-flex flex-wrap gap-2 mb-3">
    {normalizedTags.map((tag, i) => (
      <span
        key={i}
        className="tag-bubble"
        style={{ cursor: "pointer" }}
        onClick={(e) => handleTagClick(e, tag)}
      >
        {highlightText(tag, searchQuery)}

      </span>
    ))}
  </div>
)}


          <Button variant="outline-light" onClick={() => onOpen(image)}>
            Bővebben
          </Button>
        </Card.Body>
      </Card>
      <Modal
  show={showDeleteModal}
  onHide={() => {
    if (deleteLoading) return;
    setShowDeleteModal(false);
  }}
  centered
  backdrop="static"
  keyboard={!deleteLoading}
  className="glass-modal glass-confirm"
>
  <Modal.Body className="p-0" onClick={(e) => e.stopPropagation()}>
    <div className="glass-header d-flex justify-content-between align-items-center">
      <h3 className="glass-title m-0">Kép/poszt törlése</h3>
      <Button
        variant="link"
        onClick={() => {
          if (deleteLoading) return;
          setShowDeleteModal(false);
        }}
        className="text-dark p-0"
        style={{ fontSize: "24px", textDecoration: "none", lineHeight: 1 }}
      >
        ×
      </Button>
    </div>

    <div className="glass-info p-4">
      <p className="glass-description m-0">Biztosan törölni akarod ezt a képet?</p>

      <div className="d-flex justify-content-end gap-2 mt-3">
        <Button
          variant="outline-light"
          disabled={deleteLoading}
          onClick={() => setShowDeleteModal(false)}
        >
          Mégse
        </Button>

        <Button
          variant="outline-danger"
          disabled={deleteLoading}
          onClick={confirmDelete}
        >
          {deleteLoading ? "Törlés..." : "Igen, törlöm"}
        </Button>
      </div>
    </div>
  </Modal.Body>
</Modal>

    </div>
  );
}

export default ImageCard;
