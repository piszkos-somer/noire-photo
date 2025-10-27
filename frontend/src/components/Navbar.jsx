import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Form, FormControl, Button, Dropdown } from "react-bootstrap";
import "../css/Navbar.css";
import { UserContext } from "../context/UserContext";

function NavbarNoire() {
  const [query, setQuery] = useState("");
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/Login");
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
            <Nav.Link as={Link} to="/Photos">Képek</Nav.Link>
            <Nav.Link as={Link} to="/Upload">Képek feltöltése</Nav.Link>
            <Nav.Link as={Link} to="/About">Rólunk</Nav.Link>
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
            {!user.username ? (
              <Nav.Link as={Link} to="/Registration">Bejelentkezés</Nav.Link>
            ) : (
              <Dropdown align="end">
                <Dropdown.Toggle variant="outline-dark" id="dropdown-user">
                  {user.username}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/Profile">Profilom</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>Kijelentkezés</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarNoire;
