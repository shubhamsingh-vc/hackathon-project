import nodemailer from "nodemailer";

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

export async function sendResetEmail(
  to: string,
  resetUrl: string,
  name: string
) {
  const transporter = createTransporter();

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #050505; color: #FAFAFA; margin: 0; padding: 40px 20px; }
        .container { max-width: 520px; margin: 0 auto; background: #0D0D0D; border: 1px solid rgba(124,58,237,0.2); border-radius: 24px; padding: 48px; text-align: center; }
        .logo { width: 56px; height: 56px; background: linear-gradient(135deg, #7C3AED, #A855F7); border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; color: white; margin: 0 auto 24px; }
        h1 { font-size: 24px; font-weight: 800; margin: 0 0 12px; }
        p { color: #9CA3AF; font-size: 15px; line-height: 1.6; margin: 0 0 32px; }
        .btn { display: inline-block; background: linear-gradient(135deg, #7C3AED, #A855F7); color: white; text-decoration: none; font-weight: 600; font-size: 15px; padding: 14px 32px; border-radius: 50px; margin-bottom: 32px; }
        .link { color: #6B7280; font-size: 12px; word-break: break-all; }
        .footer { margin-top: 32px; color: #374151; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">C</div>
        <h1>Reset your password</h1>
        <p>Hi ${name}, we received a request to reset your password. Click the button below to choose a new one.</p>
        <a href="${resetUrl}" class="btn">Reset Password</a>
        <p class="link">Or copy this link: ${resetUrl}</p>
        <p style="color:#374151;font-size:12px;margin-top:24px;">If you didn't request this, you can safely ignore this email. This link expires in 1 hour.</p>
        <div class="footer">ContentCraft · Hackathon Project 2026</div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || "\"ContentCraft\" <noreply@contentcraft.ai>",
    to,
    subject: "Reset your ContentCraft password",
    html,
  });
}
