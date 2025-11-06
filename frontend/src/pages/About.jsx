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
        <div className="about-item text-box">Perák Attila vagyok, és számomra öröm, hogy ilyen kedves és okos kortársaimmal dolgozhattam együtt ezen a mestermunkán. Szeretem az informatikát, és büszke tanulója vagyok a Pestszentlőrinci Technikumnak. A mestermunka elkészítése soán jobban megismerhettem a NodeJS fejlesztői környezetét és sokat tanultam a controller elkészítésében. Szívesen segítettem másoknak, ha problémába ütköztek, és kifogástalanul együttműködtünk. Bízok abban, hogy a weboldalunk képes egy olyan fotós közösség megteremtésére, amelyet a jóindulat és a fejlődés vágya vezérel, és ahol a felhasználók elégedetten szereznek, vagy írnak építő jellegű, hiteles kritikát és javaslatokat.</div>
        <div className="about-item image-box"><img src="../img/attilakep.jfif" alt="Attila" className='attilakep'/></div>

        {/* Zsombor */}
        <div className="about-item image-box"> 
          <img src="../img/zsomborkep.jfif" alt="Zsombor" className='zsomborkep'/>
        </div>
        <div className="about-item text-box">Sziasztok Zsombor vagyok.</div>

        {/* Tamás */}
        <div className="about-item text-box">Haberle Tamás vagyok, szenvedélyem a programozás és örömmel vettem részt ebben a közös mestermunka projektben. A célom, hogy a projekt során megszerzett tapasztalatokat a következő munkáimban is hasznosítsam. A csapatmunkában új tapasztalatokat szereztem és remélem, hogy az elkészült weboldal elnyeri az emberek tetszést.
        </div>
        <div className="about-item image-box"><img src="../img/tamaskep.jfif" alt="Tamás" className='tamaskep'/></div>
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
