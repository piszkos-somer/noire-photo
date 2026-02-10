import express from "express";
import { sendWelcomeEmail } from "mailer.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, username, password } = req.body;

  const user = await createUser({ email, username, password });

  try {
    await sendWelcomeEmail({
      to: user.email,
      username: user.username
    });
  } catch (e) {}

  res.status(201).json({ ok: true });
});

export default router;
