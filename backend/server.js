const express = require("express");
const multer = require("multer");
const mysql = require("mysql2/promise");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

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

// MySQL kapcsolat létrehozása
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "noire",
  port: process.env.DB_PORT || 3306,
});

app.post("/upload", upload.single("image"), async (req, res) => {
  const { title, description, userId } = req.body;
  const tags = JSON.parse(req.body.tags || "[]");
  const imageFile = req.file;

  if (!imageFile) return res.status(400).json({ error: "Kép nem található." });

  try {
    const conn = await pool.getConnection();

    // 1. kép mentése az "images" táblába
    const [imageResult] = await conn.execute(
      "INSERT INTO images (user_id, title, description, url) VALUES (?, ?, ?, ?)",
      [userId, title, description, `/images/${imageFile.filename}`]
    );

    const imageId = imageResult.insertId;

    // 2. tagek kezelése: beszúrjuk a hiányzó tageket
    for (const tag of tags) {
      // ellenőrzés, hogy létezik-e már
      const [existing] = await conn.execute("SELECT id FROM tags WHERE tag = ?", [tag]);
      let tagId;

      if (existing.length > 0) {
        tagId = existing[0].id;
      } else {
        const [tagResult] = await conn.execute("INSERT INTO tags (tag) VALUES (?)", [tag]);
        tagId = tagResult.insertId;
      }

      // 3. összerendelés image_tags táblában
      await conn.execute("INSERT INTO image_tags (image_id, tag_id) VALUES (?, ?)", [imageId, tagId]);
    }

    conn.release();
    res.json({ success: true, imageId });
  } catch (err) {
    console.error("Hiba feltöltéskor:", err);
    res.status(500).json({ error: "Szerverhiba" });
  }
});

// Szerver indítása
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Szerver fut a ${PORT} porton!`);
});
