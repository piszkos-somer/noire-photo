import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Badge, ListGroup } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import "../css/EditModal.css"; // maradhat, de opcionális ha az ImageModal stílusait használod
import "../css/ImageModal.css"; // 🧊 az üveges stílus miatt
import { getAuthHeader, handleTokenError } from "../utils/auth";
import { useNavigate } from "react-router-dom";

function EditModal({ show, onHide, image, onSave }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (image) {
      setTitle(image.title);
      setDescription(image.description);
      setTags(image.tags || []);
    }
  }, [image]);

  useEffect(() => {
    document.body.style.overflow = show ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [show]);

  const handleAddTag = (tagValue) => {
    const value = tagValue || newTag.trim();
    if (value !== "" && !tags.includes(value)) {
      setTags([...tags, value]);
      setNewTag("");
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

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
    const delay = setTimeout(fetchSuggestions, 250);
    return () => clearTimeout(delay);
  }, [newTag, navigate]);

  const handleSave = () => {
    onSave({ id: image.id, title, description, tags });
  };

  const handleRemoveTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  if (!show || !image) return null;

  return (
    <Modal show={show} onHide={onHide} centered size="lg" className="glass-modal">
      <Modal.Body className="p-0">
        {/* HEADER */}
        <div className="glass-header d-flex justify-content-between align-items-center">
          <h3 className="glass-title m-0">Kép szerkesztése</h3>
          <Button variant="outline-light" size="sm" onClick={onHide}>
            ✖
          </Button>
        </div>

        {/* BODY */}
        <div className="glass-info p-4">
          <img
            src={`http://localhost:3001${image.url}`}
            alt={image.title}
            className="modal-image mb-3"
          />

          <Form.Group className="mb-3 text-start">
            <Form.Label className="fw-semibold">Cím</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3 text-start">
            <Form.Label className="fw-semibold">Leírás</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="position-relative text-start">
            <Form.Label className="fw-semibold">Tag-ek</Form.Label>
            <div className="mb-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  bg="secondary"
                  className="me-2 mb-1 tag-badge"
                  onClick={() => handleRemoveTag(tag)}
                >
                  {tag} ×
                </Badge>
              ))}
            </div>
            <Form.Control
              type="text"
              placeholder="Új tag..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
            />
            {showSuggestions && suggestions.length > 0 && (
              <ListGroup className="tag-suggestion-box shadow-sm">
                {suggestions.map((sug) => (
                  <ListGroup.Item
                    key={sug}
                    action
                    onClick={() => handleAddTag(sug)}
                  >
                    {sug}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Form.Group>

          {/* FOOTER */}
          <div className="text-end mt-4">
            <Button variant="outline-light" className="me-2" onClick={onHide}>
              Mégse
            </Button>
            <Button variant="outline-light" onClick={handleSave}>
              Mentés
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default EditModal;
