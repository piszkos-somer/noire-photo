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
    return res.status(401).json({ message: "Hiányzó token (Authorization header)." });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("❌ JWT hiba:", err.message);
    if (err.name === "TokenExpiredError")
      return res.status(401).json({ message: "A bejelentkezés lejárt, kérlek jelentkezz be újra." });
    if (err.name === "JsonWebTokenError")
      return res.status(403).json({ message: "Érvénytelen token formátum." });
    return res.status(403).json({ message: "Token hiba." });
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
// 🔹 KÉP ADATOK FRISSÍTÉSE
app.put("/api/update-image/:id", verifyToken, async (req, res) => {
  const imageId = req.params.id;
  const { title, description, tags } = req.body;
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // alapadatok frissítése
    await conn.execute(
      "UPDATE images SET title = ?, description = ? WHERE id = ? AND user_id = ?",
      [title, description, imageId, req.user.id]
    );

    // régi tagek törlése
    await conn.execute("DELETE FROM image_tags WHERE image_id = ?", [imageId]);

    // új tagek beszúrása
    if (Array.isArray(tags)) {
      for (const tag of tags) {
        const [existing] = await conn.execute("SELECT id FROM tags WHERE tag = ?", [tag]);
        let tagId;
        if (existing.length > 0) {
          tagId = existing[0].id;
        } else {
          const [tagRes] = await conn.execute("INSERT INTO tags (tag) VALUES (?)", [tag]);
          tagId = tagRes.insertId;
        }
        await conn.execute("INSERT INTO image_tags (image_id, tag_id) VALUES (?, ?)", [
          imageId,
          tagId,
        ]);
      }
    }

    await conn.commit();
    res.json({ success: true, message: "Kép frissítve!" });
  } catch (err) {
    await conn.rollback();
    console.error("❌ Képfrissítési hiba:", err);
    res.status(500).json({ error: "Szerverhiba képfrissítés közben." });
  } finally {
    conn.release();
  }
});

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

app.get("/api/latest-images", async (req, res) => {
  let userId = null;

  // Ha van token, próbáljuk dekódolni
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
    } catch (err) {
      // Token hibát nem logolunk hangosan – nem kötelező a token
    }
  }

  const conn = await pool.getConnection();
  try {
    // 🔹 Mostantól visszaadjuk az i.user_id-t is
    const [rows] = await conn.query(
      `
      SELECT 
        i.id,
        i.user_id,
        i.title,
        i.description,
        i.url,
        i.likes,
        u.username AS author,
        COALESCE(GROUP_CONCAT(t.tag SEPARATOR ','), '') AS tags
      FROM images i
      JOIN users u ON i.user_id = u.id
      LEFT JOIN image_tags it ON i.id = it.image_id
      LEFT JOIN tags t ON it.tag_id = t.id
      GROUP BY i.id
      ORDER BY i.id DESC
      LIMIT 12
      `
    );

    // 🔹 Like státusz beállítása
    if (userId) {
      const [likedRows] = await conn.query(
        "SELECT image_id FROM image_likes WHERE user_id = ?",
        [userId]
      );
      const likedSet = new Set(likedRows.map((r) => r.image_id));
      rows.forEach((img) => {
        img.isLiked = likedSet.has(img.id);
      });
    } else {
      rows.forEach((img) => (img.isLiked = false));
    }

    // 🔹 A tageket alakítsuk tömbbé a frontend kényelméért
    rows.forEach((img) => {
      img.tags = img.tags ? img.tags.split(",").filter((t) => t.trim() !== "") : [];
    });

    res.json(rows);
  } catch (err) {
    console.error("❌ Hiba képek lekérdezésénél:", err);
    res.status(500).json({ error: "Szerverhiba." });
  } finally {
    conn.release();
  }
});


// controllers/imageController.js
// ❤️ KÉP LIKE / UNLIKE
app.post("/api/images/:id/like", verifyToken, async (req, res) => {
  const imageId = req.params.id;
  const userId = req.user.id;

  if (!userId) {
    return res.status(401).json({ error: "Felhasználó nincs bejelentkezve." });
  }

  const conn = await pool.getConnection();
  try {
    // Ellenőrizzük, hogy már likeolta-e
    const [existing] = await conn.query(
      "SELECT * FROM image_likes WHERE user_id = ? AND image_id = ?",
      [userId, imageId]
    );

    if (existing.length > 0) {
      // 🔁 Ha már likeolta → unlike
      await conn.query("DELETE FROM image_likes WHERE user_id = ? AND image_id = ?", [
        userId,
        imageId,
      ]);
      await conn.query("UPDATE images SET likes = likes - 1 WHERE id = ?", [imageId]);

      const [[updatedImage]] = await conn.query(
        "SELECT likes FROM images WHERE id = ?",
        [imageId]
      );

      return res.json({ likes: updatedImage.likes, isLiked: false });
    } else {
      // ❤️ Ha még nem → like
      await conn.query("INSERT INTO image_likes (user_id, image_id) VALUES (?, ?)", [
        userId,
        imageId,
      ]);
      await conn.query("UPDATE images SET likes = likes + 1 WHERE id = ?", [imageId]);

      const [[updatedImage]] = await conn.query(
        "SELECT likes FROM images WHERE id = ?",
        [imageId]
      );

      return res.json({ likes: updatedImage.likes, isLiked: true });
    }
  } catch (err) {
    console.error("❌ Like művelet hiba:", err);
    res.status(500).json({ error: "Adatbázis hiba a like művelet közben." });
  } finally {
    conn.release();
  }
});


app.post("/api/refresh-token", verifyToken, (req, res) => {
  const newToken = jwt.sign(
    { id: req.user.id, username: req.user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  res.json({ token: newToken });
});

// ===============================================
// 💬 KOMMENTEK + LIKE RENDSZER
// ===============================================

// 🔹 Képhez tartozó kommentek lekérése (publikus)
// 💬 Kommentek lekérése adott képhez
// 💬 Kommentek lekérése adott képhez (like státuszokkal)
app.get("/api/images/:id/comments", async (req, res) => {
  const imageId = req.params.id;
  const authHeader = req.headers.authorization;

  let userId = null;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
    } catch (err) {
      // Token hiba nem kritikus itt
    }
  }

  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      `
      SELECT 
        c.id,
        c.user_id,
        c.comment,
        c.upload_date AS created_at,
        u.username,
        u.profile_picture,
        c.image_id,
        (SELECT COUNT(*) FROM comment_likes WHERE comment_id = c.id) AS likes,
        CASE
          WHEN ? IS NOT NULL AND EXISTS (
            SELECT 1 FROM comment_likes WHERE comment_id = c.id AND user_id = ?
          )
          THEN TRUE
          ELSE FALSE
        END AS isLiked
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.image_id = ?
      ORDER BY c.upload_date DESC
      `,
      [userId, userId, imageId]
    );

    res.json(rows);
  } catch (err) {
    console.error("❌ Komment lekérési hiba:", err);
    res.status(500).json({ error: "Szerverhiba a kommentek lekérdezésénél." });
  } finally {
    conn.release();
  }
});



// 🔹 Új komment létrehozása (csak bejelentkezve)
// 💬 Új komment létrehozása
app.post("/api/images/:id/comments", verifyToken, async (req, res) => {
  const imageId = req.params.id;
  const userId = req.user.id;
  const { comment } = req.body;

  if (!comment || comment.trim() === "") {
    return res.status(400).json({ error: "A komment nem lehet üres." });
  }

  const conn = await pool.getConnection();
  try {
    await conn.query(
      "INSERT INTO comments (user_id, image_id, comment) VALUES (?, ?, ?)",
      [userId, imageId, comment]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Komment mentési hiba:", err);
    res.status(500).json({ error: "Szerverhiba a komment mentésénél." });
  } finally {
    conn.release();
  }
});


// ❤️ Komment like / unlike
app.post("/api/comments/:id/like", verifyToken, async (req, res) => {
  const commentId = req.params.id;
  const userId = req.user.id;

  const conn = await pool.getConnection();
  try {
    const [existing] = await conn.query(
      "SELECT * FROM comment_likes WHERE user_id = ? AND comment_id = ?",
      [userId, commentId]
    );

    let isLiked;

    if (existing.length > 0) {
      await conn.query("DELETE FROM comment_likes WHERE user_id = ? AND comment_id = ?", [
        userId,
        commentId,
      ]);
      isLiked = false;
    } else {
      await conn.query("INSERT INTO comment_likes (user_id, comment_id) VALUES (?, ?)", [
        userId,
        commentId,
      ]);
      isLiked = true;
    }

    const [[updated]] = await conn.query(
      "SELECT COUNT(*) AS likes FROM comment_likes WHERE comment_id = ?",
      [commentId]
    );

    res.json({ likes: updated.likes, isLiked });
  } catch (err) {
    console.error("❌ Komment like hiba:", err);
    res.status(500).json({ error: "Szerverhiba a komment like műveletnél." });
  } finally {
    conn.release();
  }
});

// 🔓 Publikus: felhasználó adatainak lekérése
app.get("/api/users/:id", async (req, res) => {
  const userId = req.params.id;
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      "SELECT id, username, bio, profile_picture FROM users WHERE id = ?",
      [userId]
    );
    if (rows.length === 0)
      return res.status(404).json({ error: "Felhasználó nem található." });
    res.json(rows[0]);
  } catch (err) {
    console.error("❌ Felhasználó lekérési hiba:", err);
    res.status(500).json({ error: "Szerverhiba." });
  } finally {
    conn.release();
  }
});

// 🔓 Publikus: adott user képei
// 🔓 Publikus: adott user képei (tagekkel és like adatokkal)
// 🔓 Publikus: adott user képei (szerző névvel, tagekkel és like adatokkal)
app.get("/api/user-images/:id", async (req, res) => {
  const userId = req.params.id;
  const authHeader = req.headers.authorization;
  let viewerId = null;

  // Ha van token, próbáljuk dekódolni
  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      viewerId = decoded.id;
    } catch (err) {
      // ha nincs érvényes token, nem baj
    }
  }

  const conn = await pool.getConnection();
  try {
    // 🔹 Itt is visszaadjuk az i.user_id-t és a szerző nevét
    const [rows] = await conn.query(
      `
      SELECT 
        i.id,
        i.user_id,
        i.title,
        i.description,
        i.url,
        i.likes,
        u.username AS author,
        COALESCE(GROUP_CONCAT(t.tag SEPARATOR ','), '') AS tags
      FROM images i
      JOIN users u ON i.user_id = u.id
      LEFT JOIN image_tags it ON i.id = it.image_id
      LEFT JOIN tags t ON it.tag_id = t.id
      WHERE i.user_id = ?
      GROUP BY i.id
      ORDER BY i.id DESC
      `,
      [userId]
    );

    // Like státusz megjelölése (ha be van jelentkezve a néző)
    if (viewerId) {
      const [likedRows] = await conn.query(
        "SELECT image_id FROM image_likes WHERE user_id = ?",
        [viewerId]
      );
      const likedSet = new Set(likedRows.map((r) => r.image_id));
      rows.forEach((img) => (img.isLiked = likedSet.has(img.id)));
    } else {
      rows.forEach((img) => (img.isLiked = false));
    }

    // 🔹 A tageket alakítsuk tömbbé a frontend kényelméért
    rows.forEach((img) => {
      img.tags = img.tags ? img.tags.split(",").filter((t) => t.trim() !== "") : [];
    });

    res.json(rows);
  } catch (err) {
    console.error("❌ Felhasználó képeinek lekérési hiba:", err);
    res.status(500).json({ error: "Szerverhiba." });
  } finally {
    conn.release();
  }
});

// 🔓 Publikus: képek lekérdezése adott tag alapján
app.get("/api/images/by-tag/:tag", async (req, res) => {
  const { tag } = req.params;
  const authHeader = req.headers.authorization;
  let userId = null;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
    } catch (err) {
      // nem baj ha nincs token
    }
  }

  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      `
      SELECT 
        i.id,
        i.user_id,
        i.title,
        i.description,
        i.url,
        i.likes,
        u.username AS author,
        COALESCE(GROUP_CONCAT(t.tag SEPARATOR ','), '') AS tags
      FROM images i
      JOIN users u ON i.user_id = u.id
      JOIN image_tags it ON i.id = it.image_id
      JOIN tags t ON it.tag_id = t.id
      WHERE t.tag = ?
      GROUP BY i.id
      ORDER BY i.id DESC
      `,
      [tag]
    );

    // like státusz (ha van user)
    if (userId) {
      const [likedRows] = await conn.query(
        "SELECT image_id FROM image_likes WHERE user_id = ?",
        [userId]
      );
      const likedSet = new Set(likedRows.map((r) => r.image_id));
      rows.forEach((img) => (img.isLiked = likedSet.has(img.id)));
    } else {
      rows.forEach((img) => (img.isLiked = false));
    }

    // tagek tömbbé alakítása
    rows.forEach((img) => {
      img.tags = img.tags ? img.tags.split(",").filter((t) => t.trim() !== "") : [];
    });

    res.json(rows);
  } catch (err) {
    console.error("❌ Tag szerinti képlekérdezés hiba:", err);
    res.status(500).json({ error: "Szerverhiba." });
  } finally {
    conn.release();
  }
});

// 🔍 Kép keresés (cím, leírás, szerző vagy tag alapján)
app.get("/api/images/search", async (req, res) => {
  const { q, filter } = req.query;
  const search = q ? `%${q}%` : "%";

  const conn = await pool.getConnection();
  try {
    let query = `
      SELECT 
        i.id,
        i.title,
        i.description,
        i.url,
        i.likes,
        u.username AS author,
        u.id AS user_id,
        COALESCE(GROUP_CONCAT(t.tag SEPARATOR ','), '') AS tags
      FROM images i
      JOIN users u ON i.user_id = u.id
      LEFT JOIN image_tags it ON i.id = it.image_id
      LEFT JOIN tags t ON it.tag_id = t.id
    `;

    // Szűrés típus szerint
    if (filter === "author") {
      query += " WHERE u.username LIKE ?";
    } else if (filter === "tag") {
      query += " WHERE t.tag LIKE ?";
    } else {
      // Alapértelmezett: cím + leírás
      query += " WHERE i.title LIKE ? OR i.description LIKE ?";
    }

    query += " GROUP BY i.id ORDER BY i.id DESC";

    const [rows] =
      filter === "author"
        ? await conn.query(query, [search])
        : filter === "tag"
        ? await conn.query(query, [search])
        : await conn.query(query, [search, search]);

    res.json(rows);
  } catch (err) {
    console.error("❌ Keresési hiba:", err);
    res.status(500).json({ error: "Szerverhiba keresés közben." });
  } finally {
    conn.release();
  }
});

app.get("/api/images/:id/comment-count", async (req, res) => {
  const imageId = req.params.id;
  const conn = await pool.getConnection();
  try {
    const [[row]] = await conn.query(
      "SELECT COUNT(*) AS count FROM comments WHERE image_id = ?",
      [imageId]
    );
    res.json({ count: row.count });
  } catch (err) {
    console.error("❌ Komment szám lekérési hiba:", err);
    res.status(500).json({ error: "Szerverhiba a kommentek számolásakor." });
  } finally {
    conn.release();
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ Szerver fut a ${PORT} porton!`));
