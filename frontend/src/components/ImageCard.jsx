import React from "react";
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AnimatedHeart from "./AnimatedHeart";
import "../css/ImageCard.css";

function ImageCard({ image, onLike, onOpen, likeLoading }) {
  const navigate = useNavigate();

  // 🔹 Szerző nevére kattintás → ViewProfile oldal
  const handleAuthorClick = () => {
    if (image.user_id) {
      navigate(`/profile/${image.user_id}`);
    }
  };

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
          {/* 🔹 Cím + Like gomb */}
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="info-bubble">{image.title}</span>
            <AnimatedHeart
              isLiked={image.isLiked}
              likeCount={image.likes}
              disabled={likeLoading === image.id}
              onClick={() => onLike(image.id)}
            />
          </div>

          {/* 🔹 Feltöltő neve */}
          {image.author && (
            <div
              className="info-bubble"
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

          {/* 🔹 Tagek (üveges buborékokkal és kattinthatóan) */}
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
