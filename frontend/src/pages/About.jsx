import React from 'react';
import { Container } from 'react-bootstrap';
import "../css/About.css";

function About() {
  return (
    <Container className="py-5">
      <h1 className="mb-4 text-center">Rólunk</h1>
      <p className="lead text-center">
        A <strong>Noire Photo Collection</strong> egy online fotógyűjtemény, ahol a képeid
        eleganciája és hangulata kerül előtérbe. Célunk, hogy lehetőséget adjunk
        a fotósoknak és művészeknek, hogy megosszák alkotásaikat egy inspiráló közösségben.
      </p>

      <h2 className="mb-4 text-center">Ismerj meg minket, kik is vagyunk valójában.</h2>

      <div className="about-grid">
        {/* Attila */}
        <div className="about-item text-box">Sziasztok Attila vagyok.</div>
        <div className="about-item image-box">Kép Attiláról</div>

        {/* Zsombor */}
        <div className="about-item image-box">Kép Zsomborról</div>
        <div className="about-item text-box">Sziasztok Zsombor vagyok.</div>

        {/* Tamás */}
        <div className="about-item text-box">Sziasztok Tamás vagyok.</div>
        <div className="about-item image-box">Kép Tamásról</div>
      </div>



      <p className="mt-4 text-center">
        Az oldalt 2025-ben hoztuk létre, és azóta is folyamatosan fejlesztjük, hogy a látogatók
        könnyedén böngészhessenek, feltölthessenek és felfedezhessenek különleges képeket.
      </p>

      <p className="text-center mt-4 fw-bold">
        Köszönjük, hogy ellátogattál hozzánk!
      </p>
    </Container>
  );
}

export default About;
