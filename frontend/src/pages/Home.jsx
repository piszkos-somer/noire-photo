import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <Container className="py-5 text-center">
      <h1 className="mb-4 szinatmenet">Noire Photo Collection</h1>
      <p className="lead mb-4">
        Fedezd fel a színesebbnél színesebb fényképek világát – időtlen hangulat, egyedi kompozíciók,
        és inspiráló művészek egy helyen.
      </p>
      <Button as={Link} to="/Upload" variant="dark">
        Kezdj el feltölteni
      </Button>
    </Container>
  );
}

export default Home;
