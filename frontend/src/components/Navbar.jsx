// src/components/NavbarNoire.jsx
import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Form, FormControl, Button } from "react-bootstrap";
import { UserContext } from "../context/UserContext";
import "../css/Navbar.css";

function NavbarNoire() {
  const [query, setQuery] = useState("");
  const { user, logout } = useContext(UserContext);

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm sticky-top">
      <Container fluid>
        <Navbar.Brand className="szinatmenet" as={Link} to="/">
          Noire Photo Collection
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/Browse">
              Képek
            </Nav.Link>
            <Nav.Link as={Link} to="/Upload">
              Képek feltöltése
            </Nav.Link>
            <Nav.Link as={Link} to="/About">
              Rólunk
            </Nav.Link>
          </Nav>

          <Form className="d-flex me-3">
            <FormControl
              type="search"
              placeholder="Keresés..."
              className="me-2"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button variant="outline-primary">Keresés</Button>
          </Form>

          <Nav>
            {user?.username ? (
              <>
                <Nav.Link as={Link} to="/Profile">
                  👤 {user.username}
                </Nav.Link>
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="ms-2"
                  onClick={logout}
                >
                  Kijelentkezés
                </Button>
              </>
            ) : (
              <Nav.Link as={Link} to="/Login">
                Bejelentkezés
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarNoire;
