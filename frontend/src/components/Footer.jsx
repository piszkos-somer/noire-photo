import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import '../css/Footer.css';

const Footer = () => {
  return (
    <footer className="bg-light py-4">
      <Container>
        <Row>
          <Col md={6}>
            <h5>Hasznos linkek</h5>
            <ul className="list-unstyled">
              <li><a href="/" >Főoldal</a></li>
              <li><a href="/browse" >Képek</a></li>
              <li><a href="/Upload" >Képek feltöltése</a></li>
              <li><a href="/About" >Rólunk</a></li>
            </ul>
          </Col>
          <Col md={6}>
            <h5>Kapcsolat</h5>
            <p>Perák Attila: peratt816@hengersor.hu</p>
            <p>Kabai Zsombor: kabzso820@hengersor.hu</p>
            <p>Haberle Tamás: habtam963@hengersor.hu</p>
          </Col>
        </Row>
        <hr className="bg-white" />
        <Row>
          <Col className="text-center">
            <p>&copy; {new Date().getFullYear()} Noire Photo Collection. Minden jog fenntartva.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
