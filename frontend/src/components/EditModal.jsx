import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Badge, ListGroup } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import "../css/EditModal.css";
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

  // 🔹 Tag keresés biztonságosan, tokennel
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

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="edit-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="edit-modal-container shadow-lg"
            initial={{ scale: 0.9, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 40 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <Modal.Header>
              <Modal.Title>Kép szerkesztése</Modal.Title>
              <Button variant="close" onClick={onHide}></Button>
            </Modal.Header>

            <Modal.Body className="edit-modal-body-scroll">
              <img
                src={`http://localhost:3001${image.url}`}
                alt={image.title}
                className="w-100 rounded mb-3 shadow-sm"
              />

              <Form.Group className="mb-3">
                <Form.Label>Cím</Form.Label>
                <Form.Control
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Leírás</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="position-relative">
                <Form.Label>Tag-ek</Form.Label>
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
            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={onHide}>
                Mégse
              </Button>
              <Button variant="primary" onClick={handleSave}>
                Mentés
              </Button>
            </Modal.Footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default EditModal;
