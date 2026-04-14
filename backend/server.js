const express = require("express");
const multer = require("multer");
const mysql = require("mysql2/promise");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { sendWelcomeEmail } = require("./mailer");


const app = express();

app.use(cors());
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/profile-pictures", express.static(path.join(__dirname, "profile-pictures")));

if (!process.env.JWT_SECRET) {
  console.error("HIBA: JWT_SECRET nincs megadva az .env fájlban!");
  process.exit(1);
}

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

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  connectionLimit: 10,
});

(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("Adatbázis kapcsolat sikeres!");
    conn.release();
  } catch (err) {
    console.error("Adatbázis kapcsolat sikertelen:", err.message);
    process.exit(1);
  }
})();

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
    console.error("JWT hiba:", err.message);
    if (err.name === "TokenExpiredError")
      return res.status(401).json({ message: "A bejelentkezés lejárt, kérlek jelentkezz be újra." });
    if (err.name === "JsonWebTokenError")
      return res.status(403).json({ message: "Érvénytelen token formátum." });
    return res.status(403).json({ message: "Token hiba." });
  }
}

app.post("/api/register", async (req, res) => {
  let { username, email, password } = req.body;

  username = String(username || "").trim();
  email = String(email || "").trim();

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Minden mező kötelező." });
  }

  if (username.length > 40) {
    return res.status(400).json({ message: "A felhasználónév maximum 40 karakter lehet." });
  }

  if (email.length > 100) {
    return res.status(400).json({ message: "Az email cím maximum 100 karakter lehet." });
  }

  if (password.length > 255) {
    return res.status(400).json({ message: "A jelszó maximum 255 karakter lehet." });
  }

  try {
    const conn = await pool.getConnection();
    try {
      const [existingEmail] = await conn.execute("SELECT id FROM users WHERE email = ?", [email]);
      if (existingEmail.length > 0) {
        return res.status(400).json({ message: "Ez az email már regisztrálva van." });
      }

      const [existingUser] = await conn.execute("SELECT id FROM users WHERE username = ?", [username]);
      if (existingUser.length > 0) {
        return res.status(400).json({ message: "Ez a felhasználónév már foglalt." });
      }

      const hashed = await bcrypt.hash(password, 10);

      await conn.execute(
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
        [username, email, hashed]
      );

      try {
        await sendWelcomeEmail({ to: email, username });
      } catch (e) {}

      res.json({ message: "Sikeres regisztráció!" });
    } catch (err) {
      if (err && err.code === "ER_DUP_ENTRY") {
        const msg = String(err.message || "");
        if (msg.includes("users.username")) return res.status(400).json({ message: "Ez a felhasználónév már foglalt." });
        if (msg.includes("users.email")) return res.status(400).json({ message: "Ez az email már regisztrálva van." });
        return res.status(400).json({ message: "Duplikált adat." });
      }
      throw err;
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error("Regisztrációs hiba:", err);
    res.status(500).json({ message: "Szerverhiba regisztráció közben." });
  }
});


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
        { id: user.id, username: user.username, isAdmin: user.is_admin === 1 },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({ 
        token, 
        username: user.username, 
        isAdmin: user.is_admin === 1 
      });
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error("Bejelentkezési hiba:", err);
    res.status(500).json({ message: "Szerverhiba bejelentkezés közben." });
  }
});


app.post("/api/upload", verifyToken, upload.single("image"), async (req, res) => {
  const { title, description } = req.body;

  let tags = [];
  try {
    tags = JSON.parse(req.body.tags || "[]");
  } catch {
    return res.status(400).json({ error: "Hibás tags formátum." });
  }

  if (!Array.isArray(tags)) {
    return res.status(400).json({ error: "A tags mezőnek tömbnek kell lennie." });
  }

  tags = tags
    .map((t) => String(t).trim())
    .filter((t) => t.length > 0);

  tags = Array.from(new Set(tags));

  if (tags.length > 5) {
    return res.status(400).json({ error: "Maximum 5 tag adható meg." });
  }

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
    console.error("Hiba feltöltéskor:", err);
    res.status(500).json({ error: "Szerverhiba a feltöltés során." });
  } finally {
    conn.release();
  }
});


app.get("/api/my-images", verifyToken, async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const userId = req.user.id;

    const [images] = await conn.execute(
      `
      SELECT
        i.id, i.user_id, i.title, i.description, i.url,
        u.username AS author,
        COALESCE(SUM(CASE WHEN iv.vote = 1 THEN 1 ELSE 0 END), 0) AS upvotes,
        COALESCE(SUM(CASE WHEN iv.vote = -1 THEN 1 ELSE 0 END), 0) AS downvotes,
        (
          SELECT vote FROM image_votes 
          WHERE image_id = i.id AND user_id = ? LIMIT 1
        ) AS userVote,
        COALESCE(GROUP_CONCAT(DISTINCT t.tag SEPARATOR ','), '') AS tags
      FROM images i
      JOIN users u ON i.user_id = u.id
      LEFT JOIN image_tags it ON i.id = it.image_id
      LEFT JOIN tags t ON it.tag_id = t.id
      LEFT JOIN image_votes iv ON i.id = iv.image_id
      WHERE i.user_id = ?
      GROUP BY i.id
      ORDER BY i.id DESC
      `,
      [userId, userId]
    );

    images.forEach((img) => {
      img.upvotes = Number(img.upvotes) || 0;
      img.downvotes = Number(img.downvotes) || 0;
      img.userVote = Number(img.userVote) || 0;
      img.tags = img.tags ? img.tags.split(",").filter((t) => t.trim() !== "") : [];
      img.likes = img.upvotes;
      img.isLiked = img.userVote === 1;
    });

    res.json(images);
  } catch (err) {
    console.error("Hiba a képek lekérdezésénél:", err);
    res.status(500).json({ error: "Szerverhiba a képek lekérésekor." });
  } finally {
    conn.release();
  }
});



app.put("/api/update-profile", verifyToken, async (req, res) => {
  let { username, email, password } = req.body;

  const updates = [];
  const params = [];

  if (username !== undefined) {
    username = String(username || "").trim();
    if (username.length > 40) {
      return res.status(400).json({ message: "A felhasználónév maximum 40 karakter lehet." });
    }
  }

  if (email !== undefined) {
    email = String(email || "").trim();
  }

  const conn = await pool.getConnection();
  try {
    if (username) {
      const [rows] = await conn.execute(
        "SELECT id FROM users WHERE username = ? AND id <> ?",
        [username, req.user.id]
      );
      if (rows.length > 0) {
        return res.status(400).json({ message: "Ez a felhasználónév már foglalt." });
      }
      updates.push("username = ?");
      params.push(username);
    }

    if (email) {
      const [rows] = await conn.execute(
        "SELECT id FROM users WHERE email = ? AND id <> ?",
        [email, req.user.id]
      );
      if (rows.length > 0) {
        return res.status(400).json({ message: "Ez az email már használatban van." });
      }
      updates.push("email = ?");
      params.push(email);
    }

    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      updates.push("password = ?");
      params.push(hashed);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: "Nincs módosítandó adat." });
    }

    params.push(req.user.id);

    await conn.execute(`UPDATE users SET ${updates.join(", ")} WHERE id = ?`, params);

    res.json({ message: "Adatok frissítve!", username });
  } catch (err) {
    if (err && err.code === "ER_DUP_ENTRY") {
      const msg = String(err.message || "");
      if (msg.includes("users.username")) return res.status(400).json({ message: "Ez a felhasználónév már foglalt." });
      if (msg.includes("users.email")) return res.status(400).json({ message: "Ez az email már használatban van." });
      return res.status(400).json({ message: "Duplikált adat." });
    }
    console.error("Profil módosítási hiba:", err);
    res.status(500).json({ message: "Szerverhiba." });
  } finally {
    conn.release();
  }
});

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
      console.error("Profil frissítési hiba:", err);
      res.status(500).json({ error: "Szerverhiba a profil frissítéskor." });
    } finally {
      conn.release();
    }
  }
);

app.put("/api/update-image/:id", verifyToken, async (req, res) => {
  const imageId = req.params.id;
  let { title, description, tags } = req.body;

  if (typeof tags === "string") {
    try {
      tags = JSON.parse(tags);
    } catch {
      tags = [];
    }
  }

  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();
    await conn.execute(
      "UPDATE images SET title = ?, description = ? WHERE id = ? AND user_id = ?",
      [title, description, imageId, req.user.id]
    );

    await conn.execute("DELETE FROM image_tags WHERE image_id = ?", [imageId]);

    if (Array.isArray(tags)) {
      for (const tag of tags) {
        const trimmed = tag.trim();
        if (!trimmed) continue;

        const [existing] = await conn.execute("SELECT id FROM tags WHERE tag = ?", [trimmed]);
        let tagId;
        if (existing.length > 0) {
          tagId = existing[0].id;
        } else {
          const [tagRes] = await conn.execute("INSERT INTO tags (tag) VALUES (?)", [trimmed]);
          tagId = tagRes.insertId;
        }

        await conn.execute("INSERT INTO image_tags (image_id, tag_id) VALUES (?, ?)", [
          imageId,
          tagId,
        ]);
      }
    }

    await conn.commit();
    res.json({ success: true, message: "Kép és tagek frissítve!" });
  } catch (err) {
    await conn.rollback();
    console.error("Képfrissítési hiba:", err);
    res.status(500).json({ error: "Szerverhiba képfrissítés közben." });
  } finally {
    conn.release();
  }
});


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
    console.error("Tag keresési hiba:", err);
    res.status(500).json({ error: "Szerverhiba a tag keresésekor." });
  } finally {
    conn.release();
  }
});

async function cleanupUnusedTags() {
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.execute(`
      DELETE FROM tags
      WHERE id NOT IN (SELECT DISTINCT tag_id FROM image_tags)
    `);
    if (result.affectedRows > 0)
      console.log(`${result.affectedRows} használatlan tag törölve.`);
  } catch (err) {
    console.error("Tisztítási hiba:", err.message);
  } finally {
    conn.release();
  }
}

cleanupUnusedTags();
setInterval(cleanupUnusedTags, 60 * 60 * 1000);

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
    console.error("Profil lekérési hiba:", err);
    res.status(500).json({ error: "Szerverhiba." });
  } finally {
    conn.release();
  }
});

app.get("/api/latest-images", async (req, res) => {
  const authHeader = req.headers.authorization;
  let userId = null;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
    } catch (err) {}
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
        COALESCE(SUM(CASE WHEN iv.vote = 1 THEN 1 ELSE 0 END), 0) AS upvotes,
        COALESCE(SUM(CASE WHEN iv.vote = -1 THEN 1 ELSE 0 END), 0) AS downvotes,
        CASE
          WHEN ? IS NOT NULL THEN (
            SELECT vote FROM image_votes 
            WHERE image_id = i.id AND user_id = ? LIMIT 1
          )
          ELSE 0
        END AS userVote,
        u.username AS author,
        COALESCE(GROUP_CONCAT(t.tag SEPARATOR ','), '') AS tags
      FROM images i
      JOIN users u ON i.user_id = u.id
      LEFT JOIN image_tags it ON i.id = it.image_id
      LEFT JOIN tags t ON it.tag_id = t.id
      LEFT JOIN image_votes iv ON i.id = iv.image_id
      GROUP BY i.id
      ORDER BY i.id DESC
      LIMIT 12
      `,
      [userId, userId]
    );

    rows.forEach((img) => {
      img.upvotes = Number(img.upvotes) || 0;
      img.downvotes = Number(img.downvotes) || 0;
      img.userVote = img.userVote || 0;
      img.likes = img.upvotes;
      img.isLiked = img.userVote === 1;
      img.tags = img.tags
        ? img.tags.split(",").filter((t) => t.trim() !== "")
        : [];
    });

    res.json(rows);
  } catch (err) {
    console.error("Hiba képek lekérdezésénél:", err);
    res.status(500).json({ error: "Szerverhiba." });
  } finally {
    conn.release();
  }
});


app.post("/api/images/:id/like", verifyToken, async (req, res) => {
  const imageId = req.params.id;
  const userId = req.user.id;
  const bodyVote = req.body?.vote; 

  if (!userId) {
    return res.status(401).json({ error: "Felhasználó nincs bejelentkezve." });
  }

  const conn = await pool.getConnection();
  try {
    const [existingRows] = await conn.query(
      "SELECT id, vote FROM image_votes WHERE user_id = ? AND image_id = ?",
      [userId, imageId]
    );
    const existing = existingRows[0] || null;

    let newVote;

    if (bodyVote === 1 || bodyVote === -1 || bodyVote === 0) {
      newVote = bodyVote;
    } else {
      if (existing) {
        newVote = 0;
      } else {
        newVote = 1;
      }
    }

    if (existing) {
      if (newVote === 0) {
        await conn.query("DELETE FROM image_votes WHERE id = ?", [existing.id]);
      } else if (newVote !== existing.vote) {
        await conn.query("UPDATE image_votes SET vote = ? WHERE id = ?", [
          newVote,
          existing.id,
        ]);
      }
    } else if (newVote !== 0) {
      await conn.query(
        "INSERT INTO image_votes (user_id, image_id, vote) VALUES (?, ?, ?)",
        [userId, imageId, newVote]
      );
    }

    const [[agg]] = await conn.query(
      `
      SELECT
        COALESCE(SUM(CASE WHEN vote = 1 THEN 1 ELSE 0 END), 0) AS upvotes,
        COALESCE(SUM(CASE WHEN vote = -1 THEN 1 ELSE 0 END), 0) AS downvotes
      FROM image_votes
      WHERE image_id = ?
      `,
      [imageId]
    );

    const response = {
      upvotes: Number(agg.upvotes) || 0,
      downvotes: Number(agg.downvotes) || 0,
      userVote: newVote,
    };

    res.json(response);
  } catch (err) {
    console.error("Kép szavazás hiba:", err);
    res.status(500).json({ error: "Adatbázis hiba a szavazat művelet közben." });
  } finally {
    conn.release();
  }
});

app.post("/api/refresh-token", verifyToken, (req, res) => {
  const newToken = jwt.sign(
    { 
      id: req.user.id, 
      username: req.user.username,
      isAdmin: req.user.isAdmin 
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  
  res.json({ token: newToken });
});

app.get("/api/images/:id/comments", async (req, res) => {
  const imageId = req.params.id;
  const authHeader = req.headers.authorization;

  let userId = null;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
    } catch (err) {}
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
        COALESCE(SUM(CASE WHEN cv.vote = 1 THEN 1 ELSE 0 END), 0) AS upvotes,
        COALESCE(SUM(CASE WHEN cv.vote = -1 THEN 1 ELSE 0 END), 0) AS downvotes,
        CASE
          WHEN ? IS NOT NULL THEN (
            SELECT vote FROM comment_votes 
            WHERE comment_id = c.id AND user_id = ? LIMIT 1
          )
          ELSE 0
        END AS userVote
      FROM comments c
      JOIN users u ON c.user_id = u.id
      LEFT JOIN comment_votes cv ON c.id = cv.comment_id
      WHERE c.image_id = ?
      GROUP BY c.id
      ORDER BY c.upload_date DESC
      `,
      [userId, userId, imageId]
    );

    rows.forEach((c) => {
      c.upvotes = Number(c.upvotes) || 0;
      c.downvotes = Number(c.downvotes) || 0;
      c.userVote = c.userVote || 0;
      c.likes = c.upvotes;
      c.isLiked = c.userVote === 1;
    });

    res.json(rows);
  } catch (err) {
    console.error("Komment lekérési hiba:", err);
    res.status(500).json({ error: "Szerverhiba a kommentek lekérdezésénél." });
  } finally {
    conn.release();
  }
});

app.post("/api/images/:id/comments", verifyToken, async (req, res) => {
  const imageId = req.params.id;
  const userId = req.user.id;
  const { comment } = req.body;

  if (!comment || comment.trim() === "") {
    return res.status(400).json({ error: "A komment nem lehet üres." });
  }

  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      "CALL sp_add_comment(?, ?, ?)",
      [userId, imageId, comment]
    );
    
    const commentId = rows?.[0]?.[0]?.comment_id;
    res.json({ success: true, commentId });
  } catch (err) {
    console.error("Komment mentési hiba:", err);
    res.status(500).json({ error: "Szerverhiba a komment mentésénél." });
  } finally {
    conn.release();
  }
});

app.put("/api/comments/:id", verifyToken, async (req, res) => {
  const commentId = req.params.id;
  const userId = req.user.id;
  const { comment } = req.body;

  if (!comment || comment.trim() === "") {
    return res.status(400).json({ error: "A komment nem lehet üres." });
  }

  const conn = await pool.getConnection();
  try {
    const [commentRows] = await conn.query(
      "SELECT user_id FROM comments WHERE id = ?",
      [commentId]
    );

    if (commentRows.length === 0) {
      return res.status(404).json({ error: "A komment nem található." });
    }

    if (commentRows[0].user_id !== userId) {
      return res.status(403).json({ error: "Csak a saját kommentedet szerkesztheted." });
    }

    await conn.query(
      "UPDATE comments SET comment = ? WHERE id = ?",
      [comment, commentId]
    );

    res.json({ success: true, message: "Komment sikeresen frissítve." });
  } catch (err) {
    console.error("Komment szerkesztési hiba:", err);
    res.status(500).json({ error: "Szerverhiba a komment szerkesztésénél." });
  } finally {
    conn.release();
  }
});

app.post("/api/comments/:id/like", verifyToken, async (req, res) => {
  const commentId = req.params.id;
  const userId = req.user.id;
  const bodyVote = req.body?.vote;

  const conn = await pool.getConnection();
  try {
    const [existingRows] = await conn.query(
      "SELECT id, vote FROM comment_votes WHERE user_id = ? AND comment_id = ?",
      [userId, commentId]
    );
    const existing = existingRows[0] || null;

    let newVote;

    if (bodyVote === 1 || bodyVote === -1 || bodyVote === 0) {
      newVote = bodyVote;
    } else {
      if (existing) {
        newVote = 0;
      } else {
        newVote = 1;
      }
    }

    if (existing) {
      if (newVote === 0) {
        await conn.query("DELETE FROM comment_votes WHERE id = ?", [existing.id]);
      } else if (newVote !== existing.vote) {
        await conn.query("UPDATE comment_votes SET vote = ? WHERE id = ?", [
          newVote,
          existing.id,
        ]);
      }
    } else if (newVote !== 0) {
      await conn.query(
        "INSERT INTO comment_votes (user_id, comment_id, vote) VALUES (?, ?, ?)",
        [userId, commentId, newVote]
      );
    }

    const [[agg]] = await conn.query(
      `
      SELECT
        COALESCE(SUM(CASE WHEN vote = 1 THEN 1 ELSE 0 END), 0) AS upvotes,
        COALESCE(SUM(CASE WHEN vote = -1 THEN 1 ELSE 0 END), 0) AS downvotes
      FROM comment_votes
      WHERE comment_id = ?
      `,
      [commentId]
    );

    const response = {
      upvotes: Number(agg.upvotes) || 0,
      downvotes: Number(agg.downvotes) || 0,
      userVote: newVote,
    };

    res.json(response);
  } catch (err) {
    console.error("Komment szavazás hiba:", err);
    res.status(500).json({ error: "Szerverhiba a komment szavazásnál." });
  } finally {
    conn.release();
  }
});

app.get("/api/users/search", async (req, res) => {
  const { q } = req.query;
  const search = q ? `%${q}%` : "%";

  const authHeader = req.headers.authorization;
  let viewerId = null;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      viewerId = decoded.id;
    } catch (err) {}
  }

  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      `
      SELECT
        u.id,
        u.username,
        u.bio,
        u.profile_picture,
        COALESCE(imgStats.imageCount, 0) AS imageCount,
        COALESCE(fStats.followerCount, 0) AS followerCount
      FROM users u
      LEFT JOIN (
        SELECT user_id, COUNT(*) AS imageCount
        FROM images
        GROUP BY user_id
      ) imgStats ON imgStats.user_id = u.id
      LEFT JOIN (
        SELECT following_id, COUNT(*) AS followerCount
        FROM follows
        GROUP BY following_id
      ) fStats ON fStats.following_id = u.id
      WHERE u.is_admin = 0
        AND u.username LIKE ?
        AND (? IS NULL OR u.id <> ?)
      ORDER BY imgStats.imageCount DESC, fStats.followerCount DESC, u.username ASC
      LIMIT 50
      `,
      [search, viewerId, viewerId]
    );

    res.json(rows);
  } catch (err) {
    console.error("User search hiba:", err);
    res.status(500).json({ error: "Szerverhiba user keresés közben." });
  } finally {
    conn.release();
  }
});



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
    console.error("Felhasználó lekérési hiba:", err);
    res.status(500).json({ error: "Szerverhiba." });
  } finally {
    conn.release();
  }
});

app.get("/api/user-images/:id", async (req, res) => {
  const userId = req.params.id;
  const authHeader = req.headers.authorization;
  let viewerId = null;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      viewerId = decoded.id;
    } catch (err) {}
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
        COALESCE(SUM(CASE WHEN iv.vote = 1 THEN 1 ELSE 0 END), 0) AS upvotes,
        COALESCE(SUM(CASE WHEN iv.vote = -1 THEN 1 ELSE 0 END), 0) AS downvotes,
        CASE
          WHEN ? IS NOT NULL THEN (
            SELECT vote FROM image_votes 
            WHERE image_id = i.id AND user_id = ? LIMIT 1
          )
          ELSE 0
        END AS userVote,
        u.username AS author,
        COALESCE(GROUP_CONCAT(t.tag SEPARATOR ','), '') AS tags
      FROM images i
      JOIN users u ON i.user_id = u.id
      LEFT JOIN image_tags it ON i.id = it.image_id
      LEFT JOIN tags t ON it.tag_id = t.id
      LEFT JOIN image_votes iv ON i.id = iv.image_id
      WHERE i.user_id = ?
      GROUP BY i.id
      ORDER BY i.id DESC
      `,
      [viewerId, viewerId, userId]
    );

    rows.forEach((img) => {
      img.upvotes = Number(img.upvotes) || 0;
      img.downvotes = Number(img.downvotes) || 0;
      img.userVote = img.userVote || 0;
      img.likes = img.upvotes;
      img.isLiked = img.userVote === 1;
      img.tags = img.tags ? img.tags.split(",").filter((t) => t.trim() !== "") : [];
    });

    res.json(rows);
  } catch (err) {
    console.error("Felhasználó képeinek lekérési hiba:", err);
    res.status(500).json({ error: "Szerverhiba." });
  } finally {
    conn.release();
  }
});


app.get("/api/images/search", async (req, res) => {
  const { q } = req.query;
  const search = q && q.trim().length > 0 ? `%${q.trim()}%` : "%";

  const authHeader = req.headers.authorization;
  let userId = null;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
    } catch (err) {}
  }

  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      `
      SELECT
        i.id,
        i.title,
        i.description,
        i.url,
        COALESCE(SUM(CASE WHEN iv.vote = 1 THEN 1 ELSE 0 END), 0) AS upvotes,
        COALESCE(SUM(CASE WHEN iv.vote = -1 THEN 1 ELSE 0 END), 0) AS downvotes,
        CASE
          WHEN ? IS NOT NULL THEN (
            SELECT vote FROM image_votes 
            WHERE image_id = i.id AND user_id = ? LIMIT 1
          )
          ELSE 0
        END AS userVote,
        u.username AS author,
        u.id AS user_id,
        COALESCE(GROUP_CONCAT(DISTINCT t.tag SEPARATOR ','), '') AS tags
      FROM images i
      JOIN users u ON i.user_id = u.id
      LEFT JOIN image_tags it ON i.id = it.image_id
      LEFT JOIN tags t ON it.tag_id = t.id
      LEFT JOIN image_votes iv ON i.id = iv.image_id
      WHERE
        (
          i.title LIKE ?
          OR i.description LIKE ?
          OR EXISTS (
            SELECT 1
            FROM image_tags it2
            JOIN tags t2 ON it2.tag_id = t2.id
            WHERE it2.image_id = i.id AND t2.tag LIKE ?
          )
        )
      GROUP BY i.id
      ORDER BY i.id DESC
      `,
      [userId, userId, search, search, search]
    );

    rows.forEach((img) => {
      img.upvotes = Number(img.upvotes) || 0;
      img.downvotes = Number(img.downvotes) || 0;
      img.userVote = img.userVote || 0;
      img.likes = img.upvotes;
      img.isLiked = img.userVote === 1;
      img.tags = img.tags ? img.tags.split(",").filter((t) => t.trim() !== "") : [];
    });

    res.json(rows);
  } catch (err) {
    console.error("Kép keresési hiba:", err);
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
    console.error("Komment szám lekérési hiba:", err);
    res.status(500).json({ error: "Szerverhiba a kommentek számolásakor." });
  } finally {
    conn.release();
  }
});

app.delete("/api/images/:id", verifyToken, async (req, res) => {
  const imageId = req.params.id;
  const userId = req.user.id;
  const isAdmin = req.user.isAdmin === true;

  const conn = await pool.getConnection();
  try {
    const query = isAdmin
      ? "SELECT url FROM images WHERE id = ?"
      : "SELECT url FROM images WHERE id = ? AND user_id = ?";

    const params = isAdmin ? [imageId] : [imageId, userId];
    const [rows] = await conn.query(query, params);

    if (rows.length === 0) {
      return res.status(403).json({ error: "Nincs jogosultság a kép törléséhez." });
    }

    const imagePath = path.join(__dirname, rows[0].url);

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await conn.query("DELETE FROM comments WHERE image_id = ?", [imageId]);
    await conn.query("DELETE FROM image_votes WHERE image_id = ?", [imageId]);

    const deleteQuery = isAdmin
      ? "DELETE FROM images WHERE id = ?"
      : "DELETE FROM images WHERE id = ? AND user_id = ?";

    const deleteParams = isAdmin ? [imageId] : [imageId, userId];

    await conn.query(deleteQuery, deleteParams);

    res.json({ success: true, message: "A kép és minden kapcsolódó adat törölve lett." });

  } catch (err) {
    console.error("Kép törlési hiba:", err);
    res.status(500).json({ error: "Szerverhiba a törlés közben." });
  } finally {
    conn.release();
  }
});

app.post("/api/follow/:id", verifyToken, async (req, res) => {
  const followingId = parseInt(req.params.id);
  const followerId = req.user.id;

  if (followerId === followingId)
    return res.status(400).json({ message: "Nem követheted saját magad." });

  const conn = await pool.getConnection();
  try {
    const [existing] = await conn.query(
      "SELECT * FROM follows WHERE follower_id = ? AND following_id = ?",
      [followerId, followingId]
    );

    if (existing.length > 0) {
      await conn.query(
        "DELETE FROM follows WHERE follower_id = ? AND following_id = ?",
        [followerId, followingId]
      );
      return res.json({ following: false });
    } else {
      await conn.query(
        "INSERT INTO follows (follower_id, following_id) VALUES (?, ?)",
        [followerId, followingId]
      );
      return res.json({ following: true });
    }
  } catch (err) {
    console.error("Követés hiba:", err);
    res.status(500).json({ message: "Szerverhiba a követés műveletnél." });
  } finally {
    conn.release();
  }
});

app.get("/api/follow/status/:id", verifyToken, async (req, res) => {
  const targetId = parseInt(req.params.id);
  const followerId = req.user.id;

  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      "SELECT 1 FROM follows WHERE follower_id = ? AND following_id = ?",
      [followerId, targetId]
    );
    res.json({ following: rows.length > 0 });
  } catch (err) {
    console.error("Követés státusz hiba:", err);
    res.status(500).json({ message: "Szerverhiba a státusz lekéréskor." });
  } finally {
    conn.release();
  }
});

app.get("/api/following-images", verifyToken, async (req, res) => {
  const userId = req.user.id;

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
        COALESCE(SUM(CASE WHEN iv.vote = 1 THEN 1 ELSE 0 END), 0) AS upvotes,
        COALESCE(SUM(CASE WHEN iv.vote = -1 THEN 1 ELSE 0 END), 0) AS downvotes,
        CASE
          WHEN ? IS NOT NULL THEN (
            SELECT vote FROM image_votes 
            WHERE image_id = i.id AND user_id = ? LIMIT 1
          )
          ELSE 0
        END AS userVote,
        u.username AS author,
        COALESCE(GROUP_CONCAT(t.tag SEPARATOR ','), '') AS tags
      FROM images i
      JOIN users u ON i.user_id = u.id
      LEFT JOIN image_tags it ON i.id = it.image_id
      LEFT JOIN tags t ON it.tag_id = t.id
      LEFT JOIN image_votes iv ON i.id = iv.image_id
      WHERE i.user_id IN (
        SELECT following_id FROM follows WHERE follower_id = ?
      )
      GROUP BY i.id
      ORDER BY i.id DESC
      LIMIT 12
      `,
      [userId, userId, userId]
    );

    rows.forEach((img) => {
      img.upvotes = Number(img.upvotes) || 0;
      img.downvotes = Number(img.downvotes) || 0;
      img.userVote = img.userVote || 0;
      img.likes = img.upvotes;
      img.isLiked = img.userVote === 1;
      img.tags = img.tags
        ? img.tags.split(",").filter((t) => t.trim() !== "")
        : [];
    });

    res.json(rows);
  } catch (err) {
    console.error("Követett felhasználók képeinek lekérési hiba:", err);
    res.status(500).json({ error: "Szerverhiba." });
  } finally {
    conn.release();
  }
});

app.get("/api/images", async (req, res) => {
  const authHeader = req.headers.authorization;
  let userId = null;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
    } catch (err) {}
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
        COALESCE(SUM(CASE WHEN iv.vote = 1 THEN 1 ELSE 0 END), 0) AS upvotes,
        COALESCE(SUM(CASE WHEN iv.vote = -1 THEN 1 ELSE 0 END), 0) AS downvotes,
        CASE
          WHEN ? IS NOT NULL THEN (
            SELECT vote FROM image_votes 
            WHERE image_id = i.id AND user_id = ? LIMIT 1
          )
          ELSE 0
        END AS userVote,
        u.username AS author,
        COALESCE(GROUP_CONCAT(t.tag SEPARATOR ','), '') AS tags
      FROM images i
      JOIN users u ON i.user_id = u.id
      LEFT JOIN image_tags it ON i.id = it.image_id
      LEFT JOIN tags t ON it.tag_id = t.id
      LEFT JOIN image_votes iv ON i.id = iv.image_id
      GROUP BY i.id
      ORDER BY i.id DESC
      `,
      [userId, userId]
    );

    rows.forEach((img) => {
      img.upvotes = Number(img.upvotes) || 0;
      img.downvotes = Number(img.downvotes) || 0;
      img.userVote = img.userVote || 0;
      img.likes = img.upvotes;
      img.isLiked = img.userVote === 1;
      img.tags = img.tags
        ? img.tags.split(",").filter((t) => t.trim() !== "")
        : [];
    });

    res.json(rows);
  } catch (err) {
    console.error("Hiba az összes kép lekérdezésénél:", err);
    res.status(500).json({ error: "Szerverhiba." });
  } finally {
    conn.release();
  }
});

app.get("/api/random-images", async (req, res) => {
  const authHeader = req.headers.authorization;
  let userId = null;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
    } catch (err) {}
  }

  const excludeIds =
    String(req.query.exclude || "")
      .split(",")
      .map((id) => Number(id))
      .filter((id) => Number.isInteger(id) && id > 0);

  const conn = await pool.getConnection();
  try {
    const excludeClause = excludeIds.length
      ? `AND i.id NOT IN (${excludeIds.map(() => "?").join(",")})`
      : "";

    const params = [userId, userId, userId, userId, ...excludeIds];

    const [rows] = await conn.query(
      `
      SELECT 
        i.id,
        i.user_id,
        i.title,
        i.description,
        i.url,
        COALESCE(SUM(CASE WHEN iv.vote = 1 THEN 1 ELSE 0 END), 0) AS upvotes,
        COALESCE(SUM(CASE WHEN iv.vote = -1 THEN 1 ELSE 0 END), 0) AS downvotes,
        CASE
          WHEN ? IS NOT NULL THEN (
            SELECT vote FROM image_votes 
            WHERE image_id = i.id AND user_id = ? LIMIT 1
          )
          ELSE 0
        END AS userVote,
        u.username AS author,
        COALESCE(GROUP_CONCAT(DISTINCT t.tag SEPARATOR ','), '') AS tags
      FROM images i
      JOIN users u ON i.user_id = u.id
      LEFT JOIN image_tags it ON i.id = it.image_id
      LEFT JOIN tags t ON it.tag_id = t.id
      LEFT JOIN image_votes iv ON i.id = iv.image_id
      WHERE (i.user_id != ? OR ? IS NULL)
      ${excludeClause}
      GROUP BY i.id
      ORDER BY RAND()
      LIMIT 12
      `,
      params
    );

    rows.forEach((img) => {
      img.upvotes = Number(img.upvotes) || 0;
      img.downvotes = Number(img.downvotes) || 0;
      img.userVote = img.userVote || 0;
      img.likes = img.upvotes;
      img.isLiked = img.userVote === 1;
      img.tags = img.tags
        ? img.tags.split(",").filter((t) => t.trim() !== "")
        : [];
    });

    res.json(rows);
  } catch (err) {
    console.error("Hiba a random képek lekérdezésénél:", err);
    res.status(500).json({ error: "Szerverhiba." });
  } finally {
    conn.release();
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Szerver fut a ${PORT} porton!`));

app.delete("/api/comments/:id", verifyToken, async (req, res) => {
  const commentId = req.params.id;
  const userId = req.user.id;
  const isAdmin = req.user.isAdmin === true;

  const conn = await pool.getConnection();
  try {
    const [commentRows] = await conn.query(
      "SELECT user_id FROM comments WHERE id = ?",
      [commentId]
    );

    if (commentRows.length === 0) {
      return res.status(404).json({ error: "A komment nem található." });
    }

    const ownerId = commentRows[0].user_id;

    if (ownerId !== userId && !isAdmin) {
      return res.status(403).json({ error: "Nincs jogosultság a komment törléséhez." });
    }

    await conn.query("DELETE FROM comment_votes WHERE comment_id = ?", [commentId]);

    await conn.query("DELETE FROM comments WHERE id = ?", [commentId]);

    res.json({ success: true, message: "Komment sikeresen törölve." });
  } catch (err) {
    console.error("Komment törlési hiba:", err);
    res.status(500).json({ error: "Szerverhiba a komment törlésénél." });
  } finally {
    conn.release();
  }
});
app.delete("/api/admin/users/:id", verifyToken, async (req, res) => {
  const targetUserId = Number(req.params.id);
  const isAdmin = req.user?.isAdmin === true;

  if (!isAdmin) return res.status(403).json({ message: "Nincs jogosultság." });
  if (!targetUserId) return res.status(400).json({ message: "Hibás user id." });

  if (targetUserId === 11) {
    return res.status(403).json({ message: "Az admin fiók nem törölhető." });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [urows] = await conn.execute(
      "SELECT id, profile_picture, is_admin FROM users WHERE id = ?",
      [targetUserId]
    );
    if (urows.length === 0) {
      await conn.rollback();
      return res.status(404).json({ message: "Felhasználó nem található." });
    }
    if (urows[0].is_admin === 1) {
      await conn.rollback();
      return res.status(403).json({ message: "Admin fiók nem törölhető." });
    }

    const [imgRows] = await conn.execute(
      "SELECT url FROM images WHERE user_id = ?",
      [targetUserId]
    );

    const profilePicUrl = urows[0].profile_picture;

    await conn.execute("DELETE FROM image_votes WHERE user_id = ?", [targetUserId]);
    await conn.execute("DELETE FROM comment_votes WHERE user_id = ?", [targetUserId]);

    await conn.execute("DELETE FROM users WHERE id = ?", [targetUserId]);

    await conn.commit();

    const safeUnlink = (p) => {
      try {
        if (p && fs.existsSync(p)) fs.unlinkSync(p);
      } catch (e) {
        console.warn("Fájl törlés hiba:", e.message);
      }
    };

    for (const r of imgRows) {
      const absPath = path.join(__dirname, r.url);
      safeUnlink(absPath);
    }
    if (profilePicUrl) {
      const absProfilePath = path.join(__dirname, profilePicUrl);
      safeUnlink(absProfilePath);
    }

    return res.json({ success: true, message: "Profil teljesen törölve." });
  } catch (err) {
    try {
      await conn.rollback();
    } catch {}
    console.error("Admin user törlés hiba:", err);
    return res.status(500).json({ message: "Szerverhiba profil törlés közben." });
  } finally {
    conn.release();
  }
});



app.delete("/api/delete-profile", verifyToken, async (req, res) => {
  const userId = req.user.id;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();


    const [imgRows] = await conn.execute(
      "SELECT url FROM images WHERE user_id = ?",
      [userId]
    );

    const [userRows] = await conn.execute(
      "SELECT profile_picture FROM users WHERE id = ?",
      [userId]
    );


    await conn.execute("DELETE FROM image_votes WHERE user_id = ?", [userId]);
    await conn.execute("DELETE FROM comment_votes WHERE user_id = ?", [userId]);
    await conn.execute("DELETE FROM follows WHERE follower_id = ? OR following_id = ?", [userId, userId]);


    await conn.execute("DELETE FROM users WHERE id = ?", [userId]);

    await conn.commit();

  
    const safeUnlink = (p) => {
      try {
        if (p && fs.existsSync(p)) fs.unlinkSync(p);
      } catch (e) {
        console.warn("Fájl törlés hiba:", e.message);
      }
    };

    for (const r of imgRows) {
      safeUnlink(path.join(__dirname, r.url));
    }
    if (userRows[0]?.profile_picture) {
      safeUnlink(path.join(__dirname, userRows[0].profile_picture));
    }

    res.json({ message: "Profil sikeresen törölve." });
  } catch (err) {
    try { await conn.rollback(); } catch {}
    console.error("Profil törlés hiba:", err);
    res.status(500).json({ error: "Szerver hiba profil törléskor." });
  } finally {
    conn.release();
  }
});
