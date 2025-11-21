import React from 'react';
import { Container } from 'react-bootstrap';
import "../css/About.css";

function About() {
  return (
    <Container className="py-5">

      {/* HERO SZEKCIÓ */}
      <div className="about-hero">
        <h1>Rólunk</h1>
        <p className="lead">
          A <strong>Noire Photo Collection</strong> egy online fotógyűjtemény, ahol a képeid
          eleganciája és hangulata kerül előtérbe. Célunk, hogy lehetőséget adjunk
          a fotósoknak és művészeknek, hogy megosszák alkotásaikat egy inspiráló közösségben.
        </p>
      </div>

      <h2 className="about-subtitle">Ismerj meg minket, kik is vagyunk valójában.</h2>

      {/* GRID ELRENDEZÉS */}
      <div className="about-grid">
        
        {/* Attila */}
        <div className="about-item text-box">
          <div className="about-name">Perák Attila</div>
          <div>
            Számomra öröm, hogy ilyen kedves és okos kortársaimmal dolgozhattam együtt ezen a mestermunkán. 
            Szeretem az informatikát, és büszke tanulója vagyok a Pestszentlőrinci Technikumnak. 
            A mestermunka elkészítése során jobban megismerhettem a NodeJS fejlesztői környezetét és sokat tanultam a controller elkészítésében. 
            Szívesen segítettem másoknak, ha problémába ütköztek, és kifogástalanul együttműködtünk. 
            Bízok abban, hogy a weboldalunk képes egy olyan fotós közösség megteremtésére, amelyet a jóindulat és a fejlődés vágya vezérel, 
            és ahol a felhasználók elégedetten szereznek, vagy írnak építő jellegű, hiteles kritikát és javaslatokat.
          </div>
        </div>
        <div className="about-item image-box">
          <img src="../img/attilakep.jfif" alt="Attila" className='attilakep'/>
        </div>

        {/* Zsombor */}
        <div className="about-item image-box"> 
          <img src="../img/zsomborkep.jfif" alt="Zsombor" className='zsomborkep'/>
        </div>
        <div className="about-item text-box">
          <div className="about-name">Kabai Zsombor</div>
          <div>
            Nagyon örülök, hogy ennek a csapatnak a tagja lehetek, mert szerintem tökéletesen kiegészítjük egymást és jól dolgozunk együtt. 
            Nagyon szeretem az informatikát és a jövőben szeretnék továbbtanulni és ebben az iparágban dolgozni. 
            Ezek mellett szeretek sportolni — egyesület szinten röplabdázok és országos bajnokságokban szerepelek. 
            Ezek is bizonyítják, hogy nagyon kompetitív személyiség vagyok, és mindenben, amit csinálok, nyerni akarok vagy a legjobb akarok lenni. 
            Így ezt a weboldalt is a legjobb tudásom szerint készítettem, és nem csak az én célom, hanem a csapat célja is, 
            hogy a legtöbbet hozzuk ki ebből a munkából.
          </div>
        </div>

        {/* Tamás */}
        <div className="about-item text-box">
          <div className="about-name">Haberle Tamás</div>
          <div>
          Szenvedélyem a programozás, és örömmel vettem részt ebben a közös mestermunka projektben, amely lehetőséget adott elméleti tudásom gyakorlati alkalmazására. Célom, hogy a szerzett tapasztalatokat a jövőbeni munkáimban is kamatoztassam, különösen a modern webes technológiák és problémamegoldó készségek terén.
A csapatmunkában új tapasztalatokat szereztem, megtanultam a hatékony kommunikációt és a feladatok megosztását, melyek elengedhetetlenek egy közös projekt sikeréhez. Bízom benne, hogy az elkészült weboldal tetszeni fog a felhasználóknak, és a visszajelzések alapján tovább fejleszthetem szakmai tudásomat.
 
            
          </div>
        </div>
        <div className="about-item image-box">
          <img src="../img/tamaskep.jfif" alt="Tamás" className='tamaskep'/>
        </div>
      </div>

      {/* LÁBLÉC SZÖVEG */}
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
