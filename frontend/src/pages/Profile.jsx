import ImageCard from "../components/ImageCard";
import ImageModal from "../components/ProfileImageModal";
import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Form,
  Button,
  Alert,
  Row,
  Col,
  Card,
  Image,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import EditModal from "../components/EditModal";
import "../css/Profile.css";
import "../css/Home.css"
import { handleTokenError } from "../utils/auth";

function Profile() {
  const [showViewModal, setShowViewModal] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(null);
  const { user, updateUsername } = useContext(UserContext);
  const navigate = useNavigate();
  const openViewModal = async (img) => {
    setNewComment("");
    setSelectedImage(img);
    setShowViewModal(true);
    await fetchComments(img.id);
  };
  
  const fetchComments = async (imageId) => {
    try {
      const headers = user?.token ? { Authorization: `Bearer ${user.token}` } : {};
      const res = await fetch(`http://localhost:3001/api/images/${imageId}/comments`, { headers });
      if (res.status === 401 || res.status === 403) {
        handleTokenError(res.status, navigate);
        return;
      }
      const data = await res.json();
      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Kommentek lekérési hiba:", err);
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim() || !selectedImage) return;
    if (!user?.token) return navigate("/Registration");
  
    setCommentLoading(true);
    try {
      const res = await fetch(
        `http://localhost:3001/api/images/${selectedImage.id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ comment: newComment }),
        }
      );
  
      if (res.status === 401 || res.status === 403) {
        handleTokenError(res.status, navigate);
        return;
      }
  
      const data = await res.json().catch(() => ({}));
  
      if (!res.ok) {
        console.error("Komment küldés hiba:", data);
        return;
      }
  
      setNewComment("");
      await fetchComments(selectedImage.id);
    } catch (err) {
      console.error("Komment küldési hiba:", err);
    } finally {
      setCommentLoading(false);
    }
  };
  
  const handleImageVote = async (imageId, vote) => {
    if (!user?.token) return navigate("/Registration");
    setLikeLoading(imageId);
    try {
      const res = await fetch(`http://localhost:3001/api/images/${imageId}/like`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}` 
        },
        body: JSON.stringify({ vote })
      });
      if (res.status === 401 || res.status === 403) {
        handleTokenError(res.status, navigate);
        return;
      }
      if (res.ok) {
        const updated = await res.json();
        setImages((prev) =>
          prev.map((img) =>
            img.id === imageId ? { ...img, upvotes: updated.upvotes, downvotes: updated.downvotes, userVote: updated.userVote } : img
          )
        );
        if (selectedImage?.id === imageId) {
          setSelectedImage(prev => ({
            ...prev,
            upvotes: updated.upvotes,
            downvotes: updated.downvotes,
            userVote: updated.userVote
          }));
        }
      }
    } catch (err) {
      console.error("Vote fetch hiba:", err);
    } finally {
      setLikeLoading(null);
    }
  };

  const handleCommentVote = async (commentId, vote) => {
    if (!user?.token) return navigate("/Registration");
    try {
      const res = await fetch(`http://localhost:3001/api/comments/${commentId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ vote }),
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
              ? { ...c, upvotes: updated.upvotes, downvotes: updated.downvotes, userVote: updated.userVote }
              : c
          )
        );
      }
    } catch (err) {
      console.error("Komment vote hiba:", err);
    }
  };
  
  const handleDeleted = async (deletedId) => {
    setImages((prev) => prev.filter((img) => img.id !== deletedId));
    setMessage("Kép törölve!");
    
    setShowModal(false);
    setSelectedImage(null);
  
  };
  
  useEffect(() => {
    if (!user?.token) {
      navigate("/Login");
      return;
    }

    const fetchProfileData = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/me", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (res.status === 401 || res.status === 403) {
  handleTokenError(res.status, navigate);
  return;
}
        const data = await res.json();
        setBio(data.bio || "");
        if (data.profile_picture)
          setPreview(`http://localhost:3001${data.profile_picture}`);
      } catch (err) {
        console.error("Profil betöltési hiba:", err);
      }
    };

    const fetchImages = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/my-images", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (res.status === 401 || res.status === 403) {
  handleTokenError(res.status, navigate);
  return;
}
        const data = await res.json();
        if (Array.isArray(data)) setImages(data);
      } catch (err) {
        console.error("Képek lekérési hiba:", err);
      }
    };

    fetchProfileData();
    fetchImages();
  }, [user, navigate]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("bio", bio);
    if (profilePic) formData.append("profile_picture", profilePic);

    try {
      const res = await fetch("http://localhost:3001/api/update-profile-extended", {
        method: "PUT",
        headers: { Authorization: `Bearer ${user.token}` },
        body: formData,
      });
      if (res.status === 401 || res.status === 403) {
  handleTokenError(res.status, navigate);
  return;
}
      const data = await res.json();

      if (res.ok) {
        setMessage("Profil frissítve!");
        const refreshed = await fetch("http://localhost:3001/api/me", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (res.status === 401 || res.status === 403) {
  handleTokenError(res.status, navigate);
  return;
}
        const newData = await refreshed.json();
        setBio(newData.bio || "");
        if (newData.profile_picture)
          setPreview(`http://localhost:3001${newData.profile_picture}`);
      } else {
        setMessage(data.error || "Hiba a frissítés közben.");
      }
    } catch (err) {
      console.error("Profil frissítési hiba:", err);
      setMessage("Szerverhiba a profil mentésekor.");
    }
  };

  const handleAccountUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3001/api/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          username: newUsername,
          email: newEmail,
          password: newPassword,
        }),
      });
      if (res.status === 401 || res.status === 403) {
  handleTokenError(res.status, navigate);
  return;
}

      const data = await res.json();
      setMessage(data.message || "Adatok frissítve!");

      if (res.ok && newUsername) {
        updateUsername(newUsername);
        setNewUsername("");
      }

      setNewEmail("");
      setNewPassword("");
    } catch (err) {
      console.error(err);
      setMessage("Hiba történt a frissítés közben.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleEdit = (img) => {
    let tagsArray = [];
    
    if (img.tags) {
      if (Array.isArray(img.tags)) {
        tagsArray = img.tags;
      } else if (typeof img.tags === "string") {
        tagsArray = img.tags.split(",").map((t) => t.trim()).filter((t) => t !== "");
      }
    }
    
    setSelectedImage({
      ...img,
      tags: tagsArray,
    });
    setShowModal(true);
    setShowViewModal(false); 
  };

  const handleSave = async (updatedImage) => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/update-image/${updatedImage.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            title: updatedImage.title,
            description: updatedImage.description,
            tags: JSON.stringify(updatedImage.tags),
          }),
        }
      );
if (res.status === 401 || res.status === 403) {
  handleTokenError(res.status, navigate);
  return;
}
      const data = await res.json();

      if (res.ok) {
        setMessage("Kép sikeresen frissítve!");
        setShowModal(false);
        const refresh = await fetch("http://localhost:3001/api/my-images", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (res.status === 401 || res.status === 403) {
  handleTokenError(res.status, navigate);
  return;
}
        const newData = await refresh.json();
        if (Array.isArray(newData)) setImages(newData);
      } else {
        setMessage(`Hiba: ${data.error || data.message}`);
      }
    } catch (err) {
      console.error("Képszerkesztési hiba:", err);
      setMessage("Szerverhiba a frissítés közben.");
    }
  };

  return (
    <Container className="py-5">
      <h1 className="text-center mb-5">Profilom</h1>

      {message && <Alert variant="info" className="text-center">{message}</Alert>}

      <div className="profile-section d-flex justify-content-center align-items-start mb-5">
        <div className="profile-left text-center me-5 pe-5 border-end">
          <Image
            src={preview || "/profile-pictures/default.png"}
            roundedCircle
            width={180}
            height={180}
            className="object-fit-cover mb-3 shadow-sm"
          />
          <Form onSubmit={handleProfileUpdate}>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Profilkép módosítása</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Rólam</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                maxLength={500}
                placeholder="Írj magadról valamit..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Mentés
            </Button>
          </Form>
        </div>

        <div className="profile-right ps-5" style={{ maxWidth: "500px", width: "100%" }}>
          <Form onSubmit={handleAccountUpdate}>
            <Form.Group className="mb-3">
              <Form.Label>Jelenlegi felhasználónév</Form.Label>
              <Form.Control type="text" value={user.username || ""} disabled />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Új felhasználónév</Form.Label>
              <Form.Control
                type="text"
                placeholder="Add meg az új felhasználónevet"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Új email cím</Form.Label>
              <Form.Control
                type="email"
                placeholder="Add meg az új email címet"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Új jelszó</Form.Label>
              <Form.Control
                type="password"
                placeholder="Adj meg új jelszót"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Form.Group>

            <Button variant="success" type="submit" className="w-100">
              Adatok mentése
            </Button>
          </Form>
        </div>
      </div>

      <hr />
      <h3 className="mt-5 mb-3 text-center">Saját feltöltéseim</h3>

      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
  {images.map((image) => (
    <Col key={image.id}>
      <ImageCard
        image={image}
        onOpen={openViewModal}
        onEdit={handleEdit}
        onVote={handleImageVote}
      />
    </Col>
  ))}
</Row>

<ImageModal
  show={showViewModal}
  image={selectedImage}
  onClose={() => setShowViewModal(false)}
  onEdit={handleEdit}
  comments={comments}
  newComment={newComment}
  onCommentChange={(v) => {
    if (v && typeof v === "object" && "target" in v) {
      setNewComment(v.target.value ?? "");
      return;
    }
    setNewComment(typeof v === "string" ? v : "");
  }}
  
  onCommentSubmit={handleCommentSubmit}
  commentLoading={commentLoading}
  onImageVote={handleImageVote}
  onCommentVote={handleCommentVote}
/>


<EditModal
  show={showModal}
  onHide={() => setShowModal(false)}
  image={selectedImage}
  onSave={handleSave}
  onDeleted={handleDeleted}
/>

    </Container>
  );
}

export default Profile;
