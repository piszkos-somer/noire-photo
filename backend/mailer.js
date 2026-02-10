const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

async function sendWelcomeEmail({ to, username }) {
  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject: "Üdv a Noire Photo Collection-ben!",
    html: `<h2>Szia ${username}!</h2><p>Sikeres regisztráció.</p>`
  });
}

module.exports = { sendWelcomeEmail };
