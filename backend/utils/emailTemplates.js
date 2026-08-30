const GOLD = "#c9a227";
const FOREST = "#143a18";
const CREAM = "#f3eee4";
const INK = "#1a1712";
const MUTED = "#6d6a63";

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function wrap({ preheader, heading, kicker, body, footerNote }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(heading)}</title>
</head>
<body style="margin:0;padding:0;background:${CREAM};font-family:'Georgia',Times,serif;color:${INK};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${CREAM};padding:28px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#fffdf8;border:1px solid #e4dccf;">
          <tr>
            <td style="height:6px;background:${GOLD};font-size:0;line-height:0;">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding:28px 36px 12px;text-align:center;background:${FOREST};">
              <img src="cid:pqlogo" alt="Primates Quest Safaris" width="72" height="72" style="display:block;margin:0 auto 14px;border-radius:50%;background:${CREAM};" />
              <p style="margin:0;color:${GOLD};letter-spacing:0.28em;font-size:11px;font-family:Arial,sans-serif;text-transform:uppercase;">Primates Quest Safaris</p>
              <h1 style="margin:10px 0 4px;color:#f4efe6;font-weight:normal;font-size:32px;line-height:1.15;">${escapeHtml(heading)}</h1>
              <p style="margin:0 0 8px;color:#d8c48a;font-size:13px;font-family:Arial,sans-serif;letter-spacing:0.08em;text-transform:uppercase;">${escapeHtml(kicker)}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 36px 12px;font-family:Arial,sans-serif;font-size:15px;line-height:1.65;color:${INK};">
              ${body}
            </td>
          </tr>
          <tr>
            <td style="padding:8px 36px 28px;text-align:center;">
              <a href="https://primatequestsafaris.com" style="display:inline-block;background:${GOLD};color:${FOREST};text-decoration:none;font-family:Arial,sans-serif;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;padding:12px 22px;">Visit the website</a>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 36px 24px;background:${FOREST};color:#d7d0c4;font-family:Arial,sans-serif;font-size:11px;line-height:1.6;text-align:center;">
              ${escapeHtml(footerNote || "Kigali, Rwanda · gorilla & chimpanzee expeditions")}
              <br />info@primatequestsafaris.com
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function row(label, value) {
  if (!value) return "";
  return `<tr>
    <td style="padding:8px 0;border-bottom:1px solid #eee7d8;width:38%;color:${MUTED};font-size:11px;letter-spacing:0.08em;text-transform:uppercase;font-family:Arial,sans-serif;">${escapeHtml(label)}</td>
    <td style="padding:8px 0;border-bottom:1px solid #eee7d8;color:${FOREST};font-size:14px;">${escapeHtml(value)}</td>
  </tr>`;
}

export function inquiryGuestEmail(data) {
  const heading = "Your quest is received";
  const body = `
    <p style="margin:0 0 16px;">Dear ${escapeHtml(data.name)},</p>
    <p style="margin:0 0 16px;">Thank you for writing to Primates Quest Safaris. A specialist will review your dates and reply within 24 hours — usually sooner.</p>
    <p style="margin:0 0 18px;color:${MUTED};font-size:13px;">This is what we have on file:</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">${row("Expeditions", data.tours)}${row("Travel dates", data.dates)}${row("Guests", data.guests)}${row("Country", data.country)}</table>
    <p style="margin:18px 0 0;">Until then, keep an eye on your inbox${data.whatsappPref ? " and WhatsApp" : ""}.</p>
    <p style="margin:16px 0 0;font-style:italic;color:${FOREST};">Where the mist parts for those who seek.</p>
  `;
  return {
    subject: "Your Rwanda expedition inquiry — Primates Quest Safaris",
    text: `Dear ${data.name},\n\nWe received your inquiry for ${data.tours}. A specialist will reply within 24 hours.\n\nPrimates Quest Safaris`,
    html: wrap({
      preheader: "We have your expedition request. A specialist will reply within 24 hours.",
      heading,
      kicker: "Confirmation",
      body,
    }),
  };
}

export function inquiryAdminEmail(data) {
  const heading = "New expedition inquiry";
  const body = `
    <p style="margin:0 0 16px;">A guest just sent a booking request from the website.</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      ${row("Guest", data.name)}
      ${row("Email", data.email)}
      ${row("Phone", data.phone)}
      ${row("Country", data.country)}
      ${row("Language", data.language)}
      ${row("Expeditions", data.tours)}
      ${row("Dates", data.dates)}
      ${row("Guests", data.guests)}
      ${row("Budget", data.budgetLabel)}
      ${row("WhatsApp first", data.whatsappPref ? "Yes" : "No")}
      ${row("Dietary", data.dietary)}
      ${row("Source", data.source)}
      ${row("Message", data.message)}
    </table>
    <p style="margin:18px 0 0;font-size:13px;color:${MUTED};">Reply directly to this email to reach the guest.</p>
  `;
  return {
    subject: `New inquiry: ${data.name} · ${data.tours}`,
    text: `${data.name} (${data.email}) inquired about ${data.tours} for ${data.dates}.`,
    html: wrap({
      preheader: `${data.name} asked about ${data.tours}`,
      heading,
      kicker: "Operations desk",
      body,
    }),
  };
}

export function subscriberEmail(email) {
  const heading = "Welcome to the Wild Circle";
  const body = `
    <p style="margin:0 0 16px;">You are on the list.</p>
    <p style="margin:0 0 16px;">Expect quiet notes from the forest: conservation news, permit reminders, and the occasional invitation that does not go to everyone.</p>
    <p style="margin:0;font-style:italic;color:${FOREST};">See you in the mist.</p>
  `;
  return {
    subject: "You joined the Wild Circle — Primates Quest Safaris",
    text: `Welcome to the Primates Quest Wild Circle. We will send conservation notes and safari offers to ${email}.`,
    html: wrap({
      preheader: "Insider stories, conservation notes, and safari offers.",
      heading,
      kicker: "Newsletter",
      body,
    }),
  };
}

export function subscriberAdminEmail(email) {
  const heading = "New Wild Circle subscriber";
  const body = `
    <p style="margin:0 0 16px;">Someone joined the newsletter from the website.</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      ${row("Email", email)}
    </table>
    <p style="margin:18px 0 0;font-size:13px;color:${MUTED};">They now appear in Admin → Subscribers.</p>
  `;
  return {
    subject: `New subscriber: ${email}`,
    text: `${email} joined the Wild Circle newsletter.`,
    html: wrap({
      preheader: `${email} joined the newsletter`,
      heading,
      kicker: "Operations desk",
      body,
    }),
  };
}
