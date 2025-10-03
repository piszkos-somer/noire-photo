import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container,  Form, FormControl, Button } from 'react-bootstrap';
import '../css/Navbar.css';

function NavbarNoire() {
  const [query, setQuery] = useState('');

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm sticky-top">
      <Container fluid>
        <Navbar.Brand className="szinatmenet" as={Link} to="/Home">
          Noire Photo Collection
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />

        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Képek</Nav.Link>
            <Nav.Link as={Link} to="/features">Képek feltöltése</Nav.Link>
          </Nav>

          <Form className="d-flex me-3">
            <FormControl
              type="search"
              placeholder="Keresés..."
              className="me-2"
              width="100px"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button variant="outline-primary">Keresés</Button>
          </Form>

          <Nav>
            <Nav.Link as={Link} to="/login">Bejelentkezés</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarNoire;