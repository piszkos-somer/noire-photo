import React, { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AnimatedHeart from "./AnimatedHeart";
import "../css/ImageCard.css";
import { MessageCircle } from "lucide-react";
import { handleTokenError } from "../utils/auth";

function ImageCard({ image, onLike, onOpen, likeLoading }) {
  const navigate = useNavigate();
  const [commentCount, setCommentCount] = useState(0);

  // 🔹 Szerző nevére kattintás → ViewProfile oldal
  const handleAuthorClick = () => {
    if (image.user_id) {
      navigate(`/profile/${image.user_id}`);
    }
  };

  // 🔹 kommentek számának lekérése
  useEffect(() => {
    fetch(`http://localhost:3001/api/images/${image.id}/comment-count`)
      .then((res) => res.json())
      .then((data) => setCommentCount(data.count))
      .catch((err) => console.error("Komment szám lekérése sikertelen:", err));
  }, [image.id]

);

  // 🔹 Tagre kattintás → Browse oldal
  const handleTagClick = (tag) => {
    navigate(`/browse/${encodeURIComponent(tag)}`);
  };

  return (
    <div className="glass-card">
      <Card className="glass-inner">
        {/* 📸 Kép */}
        <div className="img-wrapper">
          <Card.Img
            variant="top"
            src={`http://localhost:3001${image.url}`}
            alt={image.title}
          />
        </div>

        <Card.Body>
          {/* 🔹 Cím + Like gomb (jobb oldalon, alatta komment számláló) */}
          <div className="d-flex justify-content-between align-items-start mb-2">
            <h5 className="info-bubble img-title">{image.title}</h5>
            <div className="text-end">
              <AnimatedHeart
                isLiked={image.isLiked}
                likeCount={image.likes}
                disabled={likeLoading === image.id}
                onClick={() => onLike(image.id)}
              />
              <div className="comment-counter mt-1">
                <MessageCircle size={18} className="comment-icon" />
                <span>{commentCount}</span>
              </div>
            </div>
          </div>

          {/* 🔹 Feltöltő neve */}
          {image.author && (
            <div
              className="info-bubble author"
              style={{ cursor: "pointer" }}
              onClick={handleAuthorClick}
            >
              📷 {image.author}
            </div>
          )}

          {/* 🔹 Leírás */}
          {image.description && (
            <div className="info-bubble text">{image.description}</div>
          )}

          {/* 🔹 Tagek */}
          {Array.isArray(image.tags) && image.tags.length > 0 ? (
            <div className="d-flex flex-wrap gap-2 mb-3">
              {image.tags.map((tag, i) => (
                <span
                  key={i}
                  className="tag-bubble"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleTagClick(tag)}
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
                  onClick={() => handleTagClick(tag.trim())}
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          ) : null}

          {/* 🔹 Bővebben gomb */}
          <Button variant="outline-light" onClick={() => onOpen(image)}>
            Bővebben
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
}

export default ImageCard;
