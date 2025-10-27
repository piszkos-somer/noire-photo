// =======================================
// ✅ FOTO FELTÖLTŐ BACKEND – JAVÍTOTT VERZIÓ
// =======================================

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

// -----------------------------
// 🔹 Alap beállítások
// -----------------------------
app.use(cors());
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/profile-pictures", express.static(path.join(__dirname, "profile-pictures")));

// Ellenőrzés: legyen JWT_SECRET
if (!process.env.JWT_SECRET) {
  console.error("❌ HIBA: JWT_SECRET nincs megadva az .env fájlban!");
  process.exit(1);
}

// -----------------------------
// 🔹 Multer konfiguráció
// -----------------------------
const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath);
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "images");
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

const profilePicStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "profile-pictures");
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});
const uploadProfilePic = multer({ storage: profilePicStorage });

// -----------------------------
// 🔹 MySQL kapcsolat (pool)
// -----------------------------
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "noire",
  port: process.env.DB_PORT || 3306,
  connectionLimit: 10,
});

(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("✅ Adatbázis kapcsolat sikeres!");
    conn.release();
  } catch (err) {
    console.error("❌ Adatbázis kapcsolat sikertelen:", err.message);
    process.exit(1);
  }
})();

// -----------------------------
// 🔹 JWT Middleware
// -----------------------------
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "Nincs hitelesítés, kérlek jelentkezz be." });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("❌ JWT hiba:", err.message);
    return res.status(403).json({ message: "Érvénytelen vagy lejárt token." });
  }
}

// -----------------------------
// 🔹 REGISZTRÁCIÓ
// -----------------------------
app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ message: "Minden mező kötelező." });

  try {
    const conn = await pool.getConnection();
    try {
      const [existing] = await conn.execute("SELECT id FROM users WHERE email = ?", [email]);
      if (existing.length > 0)
        return res.status(400).json({ message: "Ez az email már regisztrálva van." });

      const hashed = await bcrypt.hash(password, 10);
      await conn.execute("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [
        username,
        email,
        hashed,
      ]);
      res.json({ message: "✅ Sikeres regisztráció!" });
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error("❌ Regisztrációs hiba:", err);
    res.status(500).json({ message: "Szerverhiba regisztráció közben." });
  }
});

// -----------------------------
// 🔹 BEJELENTKEZÉS
// -----------------------------
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Hiányzó adatok." });

  try {
    const conn = await pool.getConnection();
    try {
      const [rows] = await conn.execute("SELECT * FROM users WHERE email = ?", [email]);
      if (rows.length === 0)
        return res.status(401).json({ message: "Hibás email vagy jelszó." });

      const user = rows[0];
      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(401).json({ message: "Hibás email vagy jelszó." });

      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({ token, username: user.username });
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error("❌ Bejelentkezési hiba:", err);
    res.status(500).json({ message: "Szerverhiba bejelentkezés közben." });
  }
});

// -----------------------------
// 🔹 KÉPFELTÖLTÉS
// -----------------------------
app.post("/api/upload", verifyToken, upload.single("image"), async (req, res) => {
  const { title, description } = req.body;
  const tags = JSON.parse(req.body.tags || "[]");
  const imageFile = req.file;
  const userId = req.user.id;

  if (!imageFile) return res.status(400).json({ error: "Kép nem található." });

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

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

    await conn.commit();
    res.json({ success: true, imageId });
  } catch (err) {
    await conn.rollback();
    console.error("❌ Hiba feltöltéskor:", err);
    res.status(500).json({ error: "Szerverhiba a feltöltés során." });
  } finally {
    conn.release();
  }
});

// -----------------------------
// 🔹 SAJÁT KÉPEK LEKÉRÉSE
// -----------------------------
app.get("/api/my-images", verifyToken, async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const [images] = await conn.execute(
      `
      SELECT 
        i.id, i.title, i.description, i.url,
        COALESCE(GROUP_CONCAT(t.tag SEPARATOR ','), '') AS tags
      FROM images i
      LEFT JOIN image_tags it ON i.id = it.image_id
      LEFT JOIN tags t ON it.tag_id = t.id
      WHERE i.user_id = ?
      GROUP BY i.id
      ORDER BY i.id DESC
      `,
      [req.user.id]
    );

    res.json(images);
  } catch (err) {
    console.error("❌ Hiba a képek lekérdezésénél:", err);
    res.status(500).json({ error: "Szerverhiba a képek lekérésekor." });
  } finally {
    conn.release();
  }
});

// -----------------------------
// 🔹 PROFIL FRISSÍTÉS
// -----------------------------
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

  const conn = await pool.getConnection();
  try {
    await conn.execute(`UPDATE users SET ${updates.join(", ")} WHERE id = ?`, params);
    res.json({ message: "✅ Adatok frissítve!", username });
  } catch (err) {
    console.error("❌ Profil módosítási hiba:", err);
    res.status(500).json({ message: "Szerverhiba." });
  } finally {
    conn.release();
  }
});

// -----------------------------
// 🔹 PROFIL BIO + KÉP FRISSÍTÉS
// -----------------------------
app.put(
  "/api/update-profile-extended",
  verifyToken,
  uploadProfilePic.single("profile_picture"),
  async (req, res) => {
    const { bio } = req.body;
    const file = req.file;

    const conn = await pool.getConnection();
    try {
      let query = "UPDATE users SET bio = ?";
      let params = [bio || null];

      if (file) {
        const profilePicUrl = `/profile-pictures/${file.filename}`;
        query += ", profile_picture = ?";
        params.push(profilePicUrl);
      }

      query += " WHERE id = ?";
      params.push(req.user.id);

      await conn.execute(query, params);
      res.json({ success: true, message: "Profil frissítve!" });
    } catch (err) {
      console.error("❌ Profil frissítési hiba:", err);
      res.status(500).json({ error: "Szerverhiba a profil frissítéskor." });
    } finally {
      conn.release();
    }
  }
);

// -----------------------------
// 🔹 TAG KERESÉS
// -----------------------------
app.get("/api/tags/search", verifyToken, async (req, res) => {
  const query = req.query.q;
  if (!query || query.trim().length < 1) return res.json([]);

  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.execute(
      "SELECT tag FROM tags WHERE tag LIKE ? ORDER BY tag LIMIT 10",
      [`%${query}%`]
    );
    res.json(rows.map((r) => r.tag));
  } catch (err) {
    console.error("❌ Tag keresési hiba:", err);
    res.status(500).json({ error: "Szerverhiba a tag keresésekor." });
  } finally {
    conn.release();
  }
});

// -----------------------------
// 🔹 Árva tagek automatikus törlése
// -----------------------------
async function cleanupUnusedTags() {
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.execute(`
      DELETE FROM tags
      WHERE id NOT IN (SELECT DISTINCT tag_id FROM image_tags)
    `);
    if (result.affectedRows > 0)
      console.log(`🧹 ${result.affectedRows} használatlan tag törölve.`);
  } catch (err) {
    console.error("❌ Tisztítási hiba:", err.message);
  } finally {
    conn.release();
  }
}

cleanupUnusedTags();
setInterval(cleanupUnusedTags, 60 * 60 * 1000);

// -----------------------------
// 🔹 Saját profil lekérése
// -----------------------------
app.get("/api/me", verifyToken, async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.execute(
      "SELECT username, email, bio, profile_picture FROM users WHERE id = ?",
      [req.user.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ error: "Felhasználó nem található." });
    res.json(rows[0]);
  } catch (err) {
    console.error("❌ Profil lekérési hiba:", err);
    res.status(500).json({ error: "Szerverhiba." });
  } finally {
    conn.release();
  }
});

// -----------------------------
// 🔹 Szerver indítás
// -----------------------------
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ Szerver fut a ${PORT} porton!`));
