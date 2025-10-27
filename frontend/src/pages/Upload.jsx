import React, { useState, useEffect } from "react";
import { Container, Form, Button } from "react-bootstrap";
import "../css/Upload.css";
import { useNavigate } from "react-router-dom";

function Upload() {
  const navigate = useNavigate();

  const defaultTags = [];

  const [tags, setTags] = useState(() => {
    const saved = localStorage.getItem("tags");
    return saved ? JSON.parse(saved) : defaultTags;
  });

  const [newTag, setNewTag] = useState("");
  const [fileError, setFileError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");

  // ⛔️ ha nincs bejelentkezve, irány a regisztráció
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/Registration");
  }, [navigate]);

  // tagek mentése localStorage-be
  useEffect(() => {
    localStorage.setItem("tags", JSON.stringify(tags));
  }, [tags]);

  const handleAddTag = () => {
    if (newTag.trim() !== "" && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleDeleteTag = (index) => {
    const updated = tags.filter((_, i) => i !== index);
    setTags(updated);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFileError("❌ Csak képfájlokat tölthetsz fel! (jpg, png, gif, stb.)");
      e.target.value = "";
      setSelectedFile(null);
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setFileError("❌ A fájl túl nagy! Maximum 25 MB engedélyezett.");
      e.target.value = "";
      setSelectedFile(null);
      return;
    }

    setFileError("");
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/Registration");
      return;
    }

    if (!selectedFile) {
      setUploadStatus("❌ Nincs kiválasztott fájl!");
      return;
    }
    if (!title.trim()) {
      setUploadStatus("❌ A kép címét meg kell adni!");
      return;
    }

    setUploadStatus("Feltöltés folyamatban...");

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("tags", JSON.stringify(tags));

    try {
      const response = await fetch("http://localhost:3001/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ JWT token
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setUploadStatus("✅ Feltöltés sikeres!");
        setSelectedFile(null);
        setTitle("");
        setDescription("");
        setTags([]);
      } else {
        setUploadStatus(`❌ Hiba: ${data.error || data.message || "Ismeretlen hiba"}`);
      }
    } catch (error) {
      setUploadStatus("❌ Hálózati hiba történt.");
      console.error(error);
    }
  };

  return (
    <Container className="upload-container py-5">
      <h1 className="text-center mb-4">Kép feltöltése</h1>

      <div className="upload-content">
        {/* Bal oldal */}
        <div className="upload-left">
          <Form.Group className="mb-3">
            <Form.Label>Fájl feltöltése</Form.Label>
            <div className="d-flex align-items-center gap-2">
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              <span className="text-muted small">max. 25 MB</span>
            </div>
            {fileError && <div className="text-danger mt-2">{fileError}</div>}
            {selectedFile && (
              <div className="text-success mt-2">
                ✅ {selectedFile.name} kiválasztva
              </div>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Kép címe</Form.Label>
            <Form.Control
              type="text"
              placeholder="Add meg a kép címét..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Kép leírása</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              placeholder="Írj néhány sort a képről..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <div className="text-center mt-4">
            <Button
              variant="outline-dark"
              className="upload-btn"
              onClick={handleUpload}
            >
              Feltöltés
            </Button>
            {uploadStatus && <div className="mt-3">{uploadStatus}</div>}
          </div>
        </div>

        {/* Jobb oldal (tagek) */}
        <div className="upload-right">
          <h5>Tag-ek</h5>
          <div className="tags-list">
            {tags.map((tag, i) => (
              <div key={i} className="tag-item">
                <span className="tag-text">{tag}</span>
                <button
                  className="delete-tag-btn"
                  onClick={() => handleDeleteTag(i)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className="tag-input-container d-flex gap-2 mt-3">
            <input
              type="text"
              className="form-control"
              placeholder="Új tag..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
            />
            <Button variant="success" onClick={handleAddTag} className="add-btn">
              ✓
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default Upload;
