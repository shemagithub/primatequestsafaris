import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function logoPath() {
  const candidates = [
    path.resolve(__dirname, "../uploads/logo.png"),
    path.resolve(__dirname, "../../src/assets/logo.png"),
  ];
  return candidates.find((file) => fs.existsSync(file));
}

function mailConfig() {
  return {
    host: process.env.SMTP_HOST || "primatequestsafaris.com",
    port: Number(process.env.SMTP_PORT || 465),
    secure: String(process.env.SMTP_SECURE || "true") !== "false",
    user: process.env.SMTP_USER || "info@primatequestsafaris.com",
    pass: process.env.SMTP_PASS || "",
    fromName: process.env.MAIL_FROM_NAME || "Primates Quest Safaris",
    notify: process.env.MAIL_NOTIFY || process.env.SMTP_USER || "info@primatequestsafaris.com",
  };
}

let transporter;

export function getTransporter() {
  const cfg = mailConfig();
  if (!cfg.pass) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: cfg.host,
      port: cfg.port,
      secure: cfg.secure,
      auth: { user: cfg.user, pass: cfg.pass },
      tls: { servername: cfg.host },
    });
  }
  return transporter;
}

export async function verifyMailer() {
  const transport = getTransporter();
  if (!transport) {
    console.warn("Email is off: set SMTP_PASS in backend/.env");
    return false;
  }
  try {
    await transport.verify();
    console.log(`Mailer ready (${mailConfig().host}:${mailConfig().port})`);
    return true;
  } catch (err) {
    console.warn("Mailer could not connect:", err.message);
    return false;
  }
}

export async function sendMail({ to, subject, html, text, replyTo }) {
  const cfg = mailConfig();
  const transport = getTransporter();
  if (!transport) throw new Error("SMTP is not configured.");

  const logo = logoPath();
  const attachments = logo
    ? [{ filename: "logo.png", path: logo, cid: "pqlogo" }]
    : [];

  const info = await transport.sendMail({
    from: `"${cfg.fromName}" <${cfg.user}>`,
    to,
    subject,
    html,
    text,
    replyTo,
    attachments,
  });
  console.log(`Email sent: "${subject}" -> ${to} (${info.messageId || "ok"})`);
  return info;
}

export async function sendMailSafe(options) {
  try {
    await sendMail(options);
    return true;
  } catch (err) {
    console.error("Email send failed:", err.message);
    return false;
  }
}

export { mailConfig };
