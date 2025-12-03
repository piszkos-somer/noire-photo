import React, { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { MessageCircle, ArrowUp, ArrowDown } from "lucide-react";
import "../css/ImageCard.css";

function ImageCard({ image, onVote, onOpen, likeLoading }) {

  const navigate = useNavigate();
  const [commentCount, setCommentCount] = useState(0);

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

  return (
    <div className="glass-card">
      <Card className="glass-inner">
        <div className="img-wrapper" onClick={() => onOpen(image)} style={{ cursor: "pointer" }}>
          <Card.Img
            variant="top"
            src={`http://localhost:3001${image.url}`}
            alt={image.title}
          />
        </div>

        <Card.Body>
<div className="d-flex justify-content-between align-items-start mb-2">
  <h5 className="info-bubble img-title">{image.title}</h5>

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
            <div className="info-bubble text">{image.description}</div>
          )}

          {Array.isArray(image.tags) && image.tags.length > 0 ? (
            <div className="d-flex flex-wrap gap-2 mb-3">
              {image.tags.map((tag, i) => (
                <span
                  key={i}
                  className="tag-bubble"
                  style={{ cursor: "pointer" }}
                  onClick={(e) => handleTagClick(e, tag)}
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : typeof image.tags === "string" && image.tags.trim() !== "" ? (
            <div className="d-flex flex-wrap gap-2 mb-3">
              {image.tags.split(",").map((tag, i) => (
                <span
                  key={i}
                  className="tag-bubble"
                  style={{ cursor: "pointer" }}
                  onClick={(e) => handleTagClick(e, tag.trim())}
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          ) : null}

          <Button variant="outline-light" onClick={() => onOpen(image)}>
            Bővebben
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
}

export default ImageCard;
