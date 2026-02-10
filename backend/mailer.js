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

const htmlTemplate = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Üdv a Noire Photo Collection-ben</title>
  </head>
  <body style="margin:0;padding:0;background:linear-gradient(135deg,#c7d2fe,#fbcfe8,#bae6fd);font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:40px 16px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:rgba(255,255,255,0.25);border-radius:20px;box-shadow:0 20px 40px rgba(0,0,0,0.15);border:1px solid rgba(255,255,255,0.35);">
            <tr>
              <td style="padding:36px 32px;text-align:center;">
                <h1 style="margin:0 0 12px 0;font-size:28px;font-weight:700;color:#1e293b;">
                  Üdvözlünk, {{username}}!
                </h1>
                <p style="margin:0 0 24px 0;font-size:15px;line-height:1.6;color:#334155;">
                  Örülünk, hogy csatlakoztál a <strong>Noire Photo Collection</strong> közösségéhez.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

async function sendWelcomeEmail({ to, username }) {
  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject: "Üdv a Noire Photo Collection-ben!",
    html: htmlTemplate.replace("{{username}}", username)
  });
}

module.exports = { sendWelcomeEmail };
