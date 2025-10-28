import React from "react";
import { Modal, Button } from "react-bootstrap";
import AnimatedCommentHeart from "../components/AnimatedCommentHeart";
import AnimatedHeart from "./AnimatedHeart";
import "../css/ImageModal.css";

function ImageModal({
  show,
  image,
  onClose,
  onLike,
  likeLoading,
  comments,
  newComment,
  onCommentChange,
  onCommentSubmit,
  commentLoading,
  onCommentLike,
}) {
  if (!image) return null;

  return (
    <Modal show={show} onHide={onClose} centered size="lg" className="glass-modal">
      <Modal.Body className="p-0">
        {/* HEADER */}
        <div className="glass-header">
          <h3 className="glass-title m-0">{image.title}</h3>
        </div>

        {/* KÉP */}
        <img
          src={`http://localhost:3001${image.url}`}
          alt={image.title}
          className="modal-image"
        />

        {/* INFO RÉSZ */}
        <div className="glass-info p-4">
          <div className="glass-info-top">
            <p className="glass-author mb-0">📷 {image.author}</p>

            {/* ❤️ Like gomb a modalban */}
            <AnimatedHeart
              isLiked={image.isLiked}
              likeCount={image.likes}
              disabled={likeLoading === image.id}
              onClick={() => onLike(image.id)}
            />
          </div>

          <p className="glass-description mt-3 mb-0">{image.description}</p>

          {/* 💬 Komment szekció */}
          <div className="comment-section mt-5 px-4 pb-4">
            <h5 className="mb-3">Hozzászólások</h5>

            {/* Új komment írása */}
            <div className="d-flex mb-3">
              <input
                type="text"
                className="form-control me-2"
                placeholder="Írj egy kommentet..."
                value={newComment}
                onChange={onCommentChange}
              />
              <Button
                variant="outline-light"
                onClick={onCommentSubmit}
                disabled={commentLoading}
              >
                Küldés
              </Button>
            </div>

            {/* Komment lista */}
            {comments.length === 0 ? (
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
                    />
                    <div className="flex-grow-1 position-relative">
                      <div className="d-flex justify-content-between align-items-center">
                        <strong>{c.username}</strong>
                        <small className="text-muted">
                          {new Date(c.created_at).toLocaleString("hu-HU")}
                        </small>
                      </div>
                      <p className="mb-1">{c.comment}</p>

                      {/* ❤️ Komment like gomb a jobb alsó sarokban */}
                      <div className="comment-like">
                        <AnimatedCommentHeart
                          isLiked={c.isLiked}
                          likeCount={c.likes}
                          disabled={likeLoading === c.id}
                          onClick={() => onCommentLike(c.id)}
                        />
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
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default ImageModal;
