import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Badge } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import "../css/EditModal.css";

function EditModal({ show, onHide, image, onSave }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    if (image) {
      setTitle(image.title);
      setDescription(image.description);
      setTags(image.tags || []);
    }
  }, [image]);

  // 🔹 Megakadályozza, hogy a háttér scrollozódjon, amíg a modal nyitva van
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [show]);

  const handleAddTag = () => {
    if (newTag.trim() !== "" && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

const handleRemoveTag = (tag) => {
  setTags(tags.filter((t) => t !== tag));
};



  const handleSave = () => {
    onSave({
      id: image.id,
      title,
      description,
      tags,
    });
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

            {/* 🔹 A tartalom most scrollozható, ha túl nagy */}
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

              <Form.Group>
                <Form.Label>Tag-ek</Form.Label>
                <div className="mb-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      bg="secondary"
                      className="me-2 tag-badge"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
                <div className="d-flex gap-2">
                  <Form.Control
                    type="text"
                    placeholder="Új tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                  />
                  <Button variant="success" onClick={handleAddTag}>
                    ✓
                  </Button>
                </div>
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
