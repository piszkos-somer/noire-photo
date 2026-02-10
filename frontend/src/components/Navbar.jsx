import React, { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Navbar,
  Nav,
  Container,
  Form,
  FormControl,
  Button,
} from "react-bootstrap";
import { UserContext } from "../context/UserContext";
import "../css/Navbar.css";

function NavbarNoire() {
  const [query, setQuery] = useState("");
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    navigate(`/browse?q=${encodeURIComponent(query.trim())}`);
    setQuery("");
  };

  const handleLogout = () => {
    logout();

    const path = (location.pathname || "").toLowerCase();
    if (path === "/profile") {
      navigate("/");
    }
  };

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm sticky-top">
      <Container fluid>
        <Navbar.Brand className="szinatmenet" as={Link} to="/">
          Noire Photo Collection
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/browse">
              Képek
            </Nav.Link>
            <Nav.Link as={Link} to="/upload">
              Képek feltöltése
            </Nav.Link>
            <Nav.Link as={Link} to="/about">
              Rólunk
            </Nav.Link>
          </Nav>

          <Form className="d-flex me-3" onSubmit={handleSearch}>
            <FormControl
              type="search"
              placeholder="Keresés..."
              className="me-2"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button variant="outline-primary" type="submit">
              Keresés
            </Button>
          </Form>

          <Nav>
            {user?.username ? (
              <>
              {!user.isAdmin && (
                <Nav.Link as={Link} to="/profile">
                  {user.username}
                </Nav.Link>
              )}
              <Button
                variant="outline-danger"
                size="sm"
                className="ms-2"
                onClick={handleLogout}
              >
                Kijelentkezés
              </Button>
            </>
            
            ) : (
              <Nav.Link as={Link} to="/login">
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
