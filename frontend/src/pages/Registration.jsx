import React, { useState } from "react";
import { Container, Form, Button, Alert, InputGroup, Modal } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeSlash } from "react-bootstrap-icons";

function Registration() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [accepted, setAccepted] = useState(false);
  const [showAszf, setShowAszf] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!accepted) return setMessage("Kérlek fogadd el az ÁSZF-et és az adatkezelési tájékoztatót!");
    if (formData.password !== formData.confirm)
      return setMessage("A jelszavak nem egyeznek!");

    try {
      await axios.post("http://localhost:3001/api/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      setMessage("Sikeres regisztráció! Most jelentkezz be.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Hiba történt.");
    }
  };

  return (
    <Container className="py-5" style={{ maxWidth: "500px" }}>
      <h1 className="mb-4 text-center">Regisztráció</h1>
      {message && <Alert variant="info">{message}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Felhasználónév</Form.Label>
          <Form.Control
            type="text"
            name="username"
            placeholder="Felhasználónév"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="Email cím"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Jelszó</Form.Label>
          <InputGroup>
            <Form.Control
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Jelszó"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <Button
              variant="outline-secondary"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              type="button"
            >
              {showPassword ? <EyeSlash /> : <Eye />}
            </Button>
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Jelszó mégegyszer</Form.Label>
          <InputGroup>
            <Form.Control
              type={showConfirm ? "text" : "password"}
              name="confirm"
              placeholder="Jelszó mégegyszer"
              value={formData.confirm}
              onChange={handleChange}
              required
            />
            <Button
              variant="outline-secondary"
              onClick={() => setShowConfirm(!showConfirm)}
              tabIndex={-1}
              type="button"
            >
              {showConfirm ? <EyeSlash /> : <Eye />}
            </Button>
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-3">
  <Form.Check type="checkbox" id="acceptTerms">
    <Form.Check.Input
      checked={accepted}
      onChange={(e) => setAccepted(e.target.checked)}
      required
    />
    <Form.Check.Label>
      Elolvastam és elfogadom az{" "}
      <span
        style={{ color: "#0d6efd", cursor: "pointer", textDecoration: "underline" }}
        onClick={() => setShowAszf(true)}
      >
        ÁSZF-et és adatkezelési tájékoztatót
      </span>
      .
    </Form.Check.Label>
  </Form.Check>
</Form.Group>

<Modal
  show={showAszf}
  onHide={() => setShowAszf(false)}
  size="lg"
  centered
>
  <Modal.Header closeButton>
    <Modal.Title>ÁSZF és adatkezelési tájékoztató</Modal.Title>
  </Modal.Header>

  <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
    <h5>Általános Felhasználási Feltételek</h5>

<p>
  Az oldal használatával a felhasználó elfogadja, hogy a szolgáltatást
  rendeltetésszerűen, a hatályos jogszabályok betartásával használja.
</p>

<p>A felhasználó vállalja, hogy:</p>

<ul>
  <li>
    Tartózkodik a trágár, sértő, gyűlölködő vagy másokat megalázó
    megfogalmazásoktól.
  </li>
  <li>
    Mások munkáját nem becsmérli, kritikát kizárólag kulturált, építő
    jelleggel fogalmaz meg. A negatív vélemény megengedett, amennyiben az
    nem személyeskedő vagy obszcén.
  </li>
  <li>
    Nem tölt fel és nem oszt meg illegális tartalmat, különösen:
    <ul>
      <li>felnőtt (pornográf) tartalmat,</li>
      <li>erőszakos vagy gyűlöletkeltő anyagokat,</li>
      <li>szerzői jogot sértő tartalmakat.</li>
    </ul>
  </li>
  <li>
    Elfogadja, hogy más felhasználók részéről kritikát kaphat, amely akár
    határozottabb hangvételű is lehet, amennyiben az nem sértő vagy
    jogsértő.
  </li>
</ul>

<p>A felhasználó tudomásul veszi továbbá, hogy:</p>

<ul>
  <li>
    Az általa feltöltött tartalmak szabadon felhasználhatók, letölthetők,
    megoszthatók és továbbterjeszthetők az oldal működésével összhangban.
  </li>
  <li>
    A feltöltött tartalmakért teljes felelősséget vállal.
  </li>
</ul>

<p>
  Az oldal üzemeltetője fenntartja a jogot a szabályokat sértő tartalmak
  eltávolítására, valamint a szabályszegő felhasználók korlátozására vagy
  kizárására.
</p>
<h5>Személyiségi jogok és kereskedelmi felhasználás korlátozása</h5>

<p>
  Az oldalon elérhető képek és videók feltöltése során a feltöltők kötelesek
  törekedni arra, hogy a tartalmak ne ábrázoljanak felismerhető személyeket
  olyan módon, amely sértő, megtévesztő, vagy a személy jó hírnevét,
  méltóságát, illetve magánszféráját sértheti.
</p>

<p>
  A felhasználó tudomásul veszi, hogy a képeken esetlegesen szereplő személyek,
  márkák, logók vagy egyéb megjelölések megjelenése nem értelmezhető úgy,
  hogy azok a felhasználó termékét, szolgáltatását vagy tevékenységét
  támogatnák, jóváhagynák vagy népszerűsítenék.
</p>

<ul>
  <li>
    Tilos a képek vagy videók eredeti, változatlan formában történő
    értékesítése vagy fizikai termékként történő forgalmazása
    (különösen: plakát, nyomat, vászonkép, ajándéktárgy),
    a jogosult előzetes engedélye nélkül.
  </li>
  <li>
    Tilos a képekben szereplő személyek, illetve megjelenő brandek, logók
    vagy termékek felhasználása oly módon, hogy az a termék vagy szolgáltatás
    reklámozásának, támogatásának vagy ajánlásának látszatát keltse.
  </li>
</ul>

<p>
  A felhasználó a tartalmak felhasználása során köteles betartani a vonatkozó
  személyiségi jogi, adatvédelmi és szerzői jogi szabályokat. Amennyiben a
  felhasználás harmadik személy jogát sérti, azért a felelősség a felhasználót
  terheli.
</p>

  </Modal.Body>
</Modal>



        <div className="d-grid gap-2">
          <Button type="submit" variant="primary" disabled={!accepted}>
            Regisztrálok
          </Button>

          <Button
            variant="secondary"
            type="button"
            onClick={() => navigate("/Login")}
          >
            Bejelentkezés
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default Registration;
