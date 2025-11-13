import React, { useState, useEffect } from "react";
import { Container, Form, Button, ListGroup } from "react-bootstrap";
import "../css/Upload.css";
import { useNavigate } from "react-router-dom";
import { handleTokenError } from "../utils/auth";

// 🔐 Token segédfüggvények
const getToken = () => {
  const userData = localStorage.getItem("user");
  if (!userData) return null;

  try {
    const parsed = JSON.parse(userData);
    if (!parsed.token || parsed.token === "null" || parsed.token === "undefined") {
      return null;
    }
    return parsed.token;
  } catch {
    return null;
  }
};

const getAuthHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};



function Upload() {
  const navigate = useNavigate();
  const token = getToken();

  const [tags, setTags] = useState(() => {
    const saved = localStorage.getItem("tags");
    return saved ? JSON.parse(saved) : [];
  });

  const [newTag, setNewTag] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [fileError, setFileError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");

  // 🔹 Ellenőrizd, hogy be van-e jelentkezve a felhasználó
  useEffect(() => {
    if (!token) {
      navigate("/Registration");
    }
  }, [token, navigate]);

  // 📦 LocalStorage sync
  useEffect(() => {
    localStorage.setItem("tags", JSON.stringify(tags));
  }, [tags]);

  

  // 🔍 Tag-ajánlás gépelés közben
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (newTag.trim().length < 1) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await fetch(
          `http://localhost:3001/api/tags/search?q=${encodeURIComponent(newTag)}`,
          { headers: getAuthHeader() }
        );
if (res.status === 401 || res.status === 403) {
  handleTokenError(res.status, navigate);
  return;
}
        if (!res.ok) {
          handleTokenError(res.status, navigate);
          return;
        }

        const data = await res.json();
        setSuggestions(data);
        setShowSuggestions(true);
      } catch (err) {
        console.error("Tag ajánlási hiba:", err);
      }
    };
    const delay = setTimeout(fetchSuggestions, 250); // debounce
    return () => clearTimeout(delay);
  }, [newTag, navigate]);

  const handleAddTag = (tagValue) => {
    const value = (tagValue || newTag).trim();
    if (!value) return; // üresen ne adjon hozzá
    if (!tags.includes(value)) {
      setTags((prev) => [...prev, value]);
    }
    setNewTag("");
    setSuggestions([]);
    setShowSuggestions(false);
  };
  

  const handleDeleteTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
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
      const response = await fetch("http://localhost:3001/api/upload", {
        method: "POST",
        headers: getAuthHeader(),
        body: formData,
      });
      
      // helyesen: 'response', nem 'res'
      if (response.status === 401 || response.status === 403) {
        handleTokenError(response.status, navigate);
        return;
      }
      
      if (!response.ok) {
        handleTokenError(response.status, navigate);
        return;
      }
      

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
      console.error(error);
      setUploadStatus("❌ Hálózati hiba történt.");
    }
  };

  return (
    <Container className="upload-container py-5">
      <h1 className="text-center mb-4">Kép feltöltése</h1>

      <div className="upload-content">
        {/* BAL OLDAL */}
        <div className="upload-left">
          <Form.Group className="mb-3">
            <Form.Label>Fájl feltöltése</Form.Label>
            <div className="d-flex align-items-center gap-2">
              <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
              <span className="text-muted small">max. 25 MB</span>
            </div>
            {fileError && <div className="text-danger mt-2">{fileError}</div>}
            {selectedFile && (
              <div className="text-success mt-2">✅ {selectedFile.name} kiválasztva</div>
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
            <Button variant="outline-dark" className="upload-btn" onClick={handleUpload}>
              Feltöltés
            </Button>
            {uploadStatus && <div className="mt-3">{uploadStatus}</div>}
          </div>
        </div>

        {/* JOBB OLDAL (tagek) */}
        <div className="upload-right position-relative">
          <h5>Tag-ek</h5>
          <div className="tags-list">
            {tags.map((tag, i) => (
              <div key={i} className="tag-item">
                <span className="tag-text">{tag}</span>
                <button className="delete-tag-btn" onClick={() => handleDeleteTag(i)}>
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className="tag-input-container d-flex gap-2 mt-3 position-relative">
            <input
              type="text"
              className="form-control"
              placeholder="Új tag..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
            />
            <Button
  variant="success"
  onClick={() => handleAddTag(newTag.trim())}
  className="add-btn"
  disabled={!newTag.trim()} // opcionális, hogy üresen ne lehessen kattintani
>
  ✓
</Button>


            {showSuggestions && suggestions.length > 0 && (
              <ListGroup className="tag-suggestion-box shadow-sm">
                {suggestions.map((sug) => (
                  <ListGroup.Item key={sug} action onClick={() => handleAddTag(sug)}>
                    {sug}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}

export default Upload;
