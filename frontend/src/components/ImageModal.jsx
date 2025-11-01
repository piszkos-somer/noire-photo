// src/components/ImageModal.jsx
import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AnimatedCommentHeart from "../components/AnimatedCommentHeart";
import AnimatedHeart from "./AnimatedHeart";
import "../css/ImageModal.css";
import { getToken, getAuthHeader, handleTokenError } from "../utils/auth";
import { Share2, MessageCircle } from "lucide-react";



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
  const navigate = useNavigate();

  // 🧠 Lokális másolat a képről — így tud frissülni helyben is
  const [localImage, setLocalImage] = useState(image);
const [showToast, setShowToast] = useState(false);

  // Ha új képet kapunk, frissítjük a lokális állapotot
  useEffect(() => {
    setLocalImage(image);
  }, [image]);
// ⬇️ Tedd ezt a többi függvény alá
const handleDownload = async () => {
  const token = getToken();

  // 🚫 Ha nincs token, irány a regisztrációs oldal
  if (!token) {
    navigate("/Registration");
    return;
  }

  try {
    const response = await fetch(`http://localhost:3001${localImage.url}`, {
      headers: getAuthHeader(),
    });
if (res.status === 401 || res.status === 403) {
  handleTokenError(res.status, navigate);
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

  // ha a modal nem látható vagy nincs kép, ne renderelj semmit
  if (!show || !localImage) return null;

  // 🔹 Kattintáskor profiloldalra irányítás
 // 🔹 Kattintáskor profiloldalra irányítás
const handleUserClick = (userId) => {
  if (userId) navigate(`/viewprofile/${userId}`);
};

const handleShare = async () => {
  if (!localImage?.id || !localImage?.user_id) return;

  const shareUrl = `${window.location.origin}/viewprofile/${localImage.user_id}?image=${localImage.id}`;

  try {
    await navigator.clipboard.writeText(shareUrl);

    // 🟢 Mutatjuk a toastot
    setShowToast(true);

    // 🔄 Eltüntetjük pár másodperc múlva
    setTimeout(() => setShowToast(false), 2500);
  } catch (err) {
    console.error("Másolás hiba:", err);
  }
};


  // ❤️ Like gomb helyben is frissíti a szívet és a számot
  const handleLikeClick = async () => {
    if (!localImage) return;
    await onLike(localImage.id);

    // azonnali vizuális frissítés
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
        {/* HEADER */}
        <div className="glass-header">
          <h3 className="glass-title m-0">{localImage?.title || "Kép megtekintése"}</h3>
        </div>

        {/* KÉP */}
        {localImage?.url && (
          <img
            src={`http://localhost:3001${localImage.url}`}
            alt={localImage?.title || ""}
            className="modal-image"
          />
        )}

        {/* INFO RÉSZ */}
        <div className="glass-info p-4">
<div className="glass-info-top d-flex justify-content-between align-items-center flex-wrap gap-2">

  {/* BAL OLDAL: név + letöltés buborék */}
  <div className="d-flex align-items-center gap-2">

    {/* 📷 Feltöltő név buborék */}
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

    {/* ⬇️ Letöltés buborék */}
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

  {/* JOBB OLDAL: megosztás ikon + szív */}
  <div className="d-flex align-items-center gap-3">
    {/* 🔗 Megosztás ikon */}
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
    {/* ❤️ Like szív */}
    <AnimatedHeart
      isLiked={localImage?.isLiked}
      likeCount={localImage?.likes || 0}
      disabled={likeLoading === localImage?.id}
      onClick={handleLikeClick}
    />
  </div>
</div>





          <p className="glass-description mt-3 mb-0">
            {localImage?.description || "Nincs leírás."}
          </p>

          {/* 💬 Komment szekció */}
          <div className="comment-section mt-5 px-4 pb-4">
            <h5 className="mb-3">Hozzászólások</h5>

            {/* Új komment írása */}
            <div className="d-flex mb-3">
              <input
                type="text"
                className="form-control me-2"
                placeholder="Írj egy kommentet..."
                value={newComment || ""}
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

                      {/* ❤️ Komment like gomb */}
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
