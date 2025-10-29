import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Spinner } from "react-bootstrap";
import ImageCard from "../components/ImageCard";
import "../css/Home.css";

function Browse() {
  const { tag } = useParams();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/images/by-tag/${encodeURIComponent(tag)}`);
        const data = await res.json();
        setImages(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Képek betöltési hiba:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, [tag]);

  if (loading)
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );

  return (
    <Container className="py-5">
      <h2 className="text-center mb-4">
        📸 Képek ezzel a taggel: <span className="szinatmenet">#{tag}</span>
      </h2>

      {images.length === 0 ? (
        <p className="text-center text-muted">Nincs találat ezzel a taggel.</p>
      ) : (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {images.map((img) => (
            <ImageCard
              key={img.id}
              image={img}
              onLike={() => {}}
              onOpen={() => {}}
              likeLoading={null}
            />
          ))}
        </Row>
      )}
    </Container>
  );
}

export default Browse;
