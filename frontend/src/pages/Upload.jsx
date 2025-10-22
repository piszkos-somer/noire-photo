import React, { useState, useEffect } from "react";
import { Container, Form, Button } from "react-bootstrap";
import "../css/Upload.css";

function Upload() {
  

 
  const [tags, setTags] = useState(() => {
    const saved = localStorage.getItem("tags");
    return saved ? JSON.parse(saved) : defaultTags;
  });

  const [newTag, setNewTag] = useState("");

  
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

  return (
    <Container className="upload-container py-5">
      <h1 className="text-center mb-4">Kép feltöltése</h1>

      <div className="upload-content">
        {/* Bal oldal */}
        <div className="upload-left">
          <Form.Group className="mb-3">
            <Form.Label>Fájl feltöltése</Form.Label>
            <div className="d-flex align-items-center gap-2">
              <Form.Control type="file" />
              <span className="text-muted small">max. 25 mb</span>
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Kép címe</Form.Label>
            <Form.Control type="text" placeholder="Add meg a kép címét..." />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Kép leírása</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              placeholder="Írj néhány sort a képről..."
            />
          </Form.Group>

          <div className="text-center mt-4">
            <Button variant="outline-dark" className="upload-btn">
              Feltöltés
            </Button>
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

          <div className="tag-input-container">
            <input
              type="text"
              className="form-control"
              placeholder="Új tag..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
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
