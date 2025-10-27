const express = require("express");
const multer = require("multer");
const mysql = require("mysql2/promise");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "images"))); // képek kiszolgálása

// Multer konfigurálása fájlokhoz
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "images");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}${ext}`;
    cb(null, filename);
  },
});
const upload = multer({ storage });

// MySQL kapcsolat
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "noire",
  port: process.env.DB_PORT || 3306,
});

// 🔹 Inicializáció — ezzel biztosítjuk, hogy a kapcsolat létrejöjjön, és a szerver életben maradjon
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("✅ Adatbázis kapcsolat sikeres!");
    conn.release();
  } catch (err) {
    console.error("❌ Adatbázis kapcsolat sikertelen:", err.message);
  }
})();

// JWT ellenőrzés middleware
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "Nincs hitelesítés, kérlek jelentkezz be." });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "titkoskulcs");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Érvénytelen token." });
  }
}

// ===================
// 🔹 REGISZTRÁCIÓ
// ===================
app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ message: "Minden mező kötelező." });

  try {
    const hashed = await bcrypt.hash(password, 10);
    const conn = await pool.getConnection();
    await conn.execute(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashed]
    );
    conn.release();
    res.json({ message: "Sikeres regisztráció!" });
  } catch (err) {
    console.error("Hiba regisztrációkor:", err);
    res.status(500).json({ message: "Regisztrációs hiba." });
  }
});

// ===================
// 🔹 BEJELENTKEZÉS
// ===================
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Hiányzó adatok." });

  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.execute("SELECT * FROM users WHERE email = ?", [email]);
    conn.release();

    if (rows.length === 0)
      return res.status(401).json({ message: "Hibás email vagy jelszó." });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Hibás email vagy jelszó." });

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || "titkoskulcs",
      { expiresIn: "1h" }
    );

    res.json({ token, username: user.username });
  } catch (err) {
    console.error("Bejelentkezési hiba:", err);
    res.status(500).json({ message: "Szerverhiba." });
  }
});

// ===================
// 🔹 FELTÖLTÉS (védett)
// ===================
app.post("/upload", verifyToken, upload.single("image"), async (req, res) => {
  const { title, description } = req.body;
  const tags = JSON.parse(req.body.tags || "[]");
  const imageFile = req.file;
  const userId = req.user.id;

  if (!imageFile) return res.status(400).json({ error: "Kép nem található." });

  try {
    const conn = await pool.getConnection();
    const [imageResult] = await conn.execute(
      "INSERT INTO images (user_id, title, description, url) VALUES (?, ?, ?, ?)",
      [userId, title, description, `/images/${imageFile.filename}`]
    );

    const imageId = imageResult.insertId;

    for (const tag of tags) {
      const [existing] = await conn.execute("SELECT id FROM tags WHERE tag = ?", [tag]);
      let tagId;
      if (existing.length > 0) {
        tagId = existing[0].id;
      } else {
        const [tagResult] = await conn.execute("INSERT INTO tags (tag) VALUES (?)", [tag]);
        tagId = tagResult.insertId;
      }
      await conn.execute("INSERT INTO image_tags (image_id, tag_id) VALUES (?, ?)", [
        imageId,
        tagId,
      ]);
    }

    conn.release();
    res.json({ success: true, imageId });
  } catch (err) {
    console.error("Hiba feltöltéskor:", err);
    res.status(500).json({ error: "Szerverhiba" });
  }
});

// backend/server.js
app.get("/api/my-images", verifyToken, async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [images] = await conn.execute(
      "SELECT * FROM images WHERE user_id = ? ORDER BY upload_date DESC",
      [req.user.id]
    );
    conn.release();
    res.json(images);
  } catch (err) {
    console.error("Hiba a saját képek lekérdezésénél:", err);
    res.status(500).json({ error: "Szerverhiba" });
  }
});

app.put("/api/update-profile", verifyToken, async (req, res) => {
  const { username, email, password } = req.body;
  const updates = [];
  const params = [];

  if (username) {
    updates.push("username = ?");
    params.push(username);
  }

  if (email) {
    updates.push("email = ?");
    params.push(email);
  }

  if (password) {
    const hashed = await bcrypt.hash(password, 10);
    updates.push("password = ?");
    params.push(hashed);
  }

  if (updates.length === 0)
    return res.status(400).json({ message: "Nincs módosítandó adat." });

  params.push(req.user.id);

  try {
    const conn = await pool.getConnection();
    await conn.execute(`UPDATE users SET ${updates.join(", ")} WHERE id = ?`, params);
    conn.release();

    // ha username változott, frissítsük a tokenben is
    res.json({ message: "Adatok frissítve!", username });
  } catch (err) {
    console.error("Profil módosítási hiba:", err);
    res.status(500).json({ message: "Szerverhiba." });
  }
});



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ Szerver fut a ${PORT} porton!`));
