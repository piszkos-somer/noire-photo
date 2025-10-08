import React from 'react';
import { Container } from 'react-bootstrap';

function About() {
  return (
    <Container className="py-5">
      <h1 className="mb-4 text-center">Rólunk</h1>
      <p className="lead text-center">
        A <strong>Noire Photo Collection</strong> egy online fotógyűjtemény, ahol a fekete-fehér képek
        eleganciája és hangulata kerül előtérbe. Célunk, hogy lehetőséget adjunk
        a fotósoknak és művészeknek, hogy megosszák alkotásaikat egy inspiráló közösségben.
      </p>

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
