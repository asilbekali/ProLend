// FILE MISSION: sends the "Welcome to TH-LABS" email to anyone who registers
// or joins the waitlist. Uses the Gmail SMTP credentials from .env via
// nodemailer. Called (fire-and-forget, errors logged not thrown) from the
// waitlist / register / google-signin flows so a mail hiccup never fails the
// signup itself.

import nodemailer from "nodemailer";

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_FROM,
} = process.env;

// One shared transport, created lazily so importing this module never throws
// when SMTP isn't configured (e.g. during a build).
let transporter: nodemailer.Transporter | null = null;

function getTransport() {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    throw new Error("SMTP is not configured — check SMTP_* vars in .env");
  }
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT ?? 587),
      secure: Number(SMTP_PORT ?? 587) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
  }
  return transporter;
}

const ACCENT = "#8b5cf6";
const BG = "#0a0a0f";
const SURFACE = "#120f17";
const BORDER = "#221f2b";
const TEXT = "#f5f5f7";
const MUTED = "#9a99a6";

function welcomeHtml(name: string) {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:${BG};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:${TEXT};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BG};padding:32px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${SURFACE};border:1px solid ${BORDER};border-radius:20px;overflow:hidden;">
            <tr>
              <td style="padding:36px 40px 8px;">
                <div style="font-size:13px;letter-spacing:3px;text-transform:uppercase;color:${MUTED};">Welcome to</div>
                <div style="font-size:26px;font-weight:700;letter-spacing:1px;margin-top:6px;">TH-LABS</div>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 40px 8px;">
                <h1 style="margin:0 0 16px;font-size:22px;font-weight:600;">Welcome, ${name}</h1>
                <p style="margin:0 0 14px;font-size:15px;line-height:1.65;color:${TEXT};">Thank you for joining TH-LABS. Your registration has been successfully completed.</p>
                <p style="margin:0 0 14px;font-size:15px;line-height:1.65;color:${MUTED};">You are now one of our early members and will receive exclusive product updates, early announcements, and launch notifications before our public release.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 40px;">
                <div style="border-top:1px solid ${BORDER};padding-top:22px;">
                  <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:${ACCENT};margin-bottom:10px;">Our Mission</div>
                  <p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:${TEXT};">To break language barriers through artificial intelligence and make the future more accessible for everyone.</p>
                  <p style="margin:0;font-size:14px;line-height:1.65;color:${MUTED};">Our team is actively developing TH-LABS. As an early member, you'll be among the first to be notified as soon as our AI dubbing system becomes available.</p>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:22px 40px 8px;">
                <div style="border-top:1px solid ${BORDER};padding-top:22px;">
                  <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:${MUTED};margin-bottom:12px;">Contact</div>
                  <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:14px;line-height:1.9;">
                    <tr><td style="color:${MUTED};padding-right:18px;">Email</td><td><a href="mailto:thethlabs.io@gmail.com" style="color:${ACCENT};text-decoration:none;">thethlabs.io@gmail.com</a></td></tr>
                    <tr><td style="color:${MUTED};padding-right:18px;">Website</td><td><a href="https://th-labs-flame.vercel.app" style="color:${ACCENT};text-decoration:none;">th-labs-flame.vercel.app</a></td></tr>
                    <tr><td style="color:${MUTED};padding-right:18px;">Instagram</td><td><a href="https://instagram.com/th_labs.io" style="color:${ACCENT};text-decoration:none;">instagram.com/th_labs.io</a></td></tr>
                    <tr><td style="color:${MUTED};padding-right:18px;">LinkedIn</td><td style="color:${TEXT};">Coming Soon</td></tr>
                  </table>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:26px 40px 36px;">
                <p style="margin:0 0 4px;font-size:15px;color:${TEXT};">Thank you for supporting TH-LABS.</p>
                <p style="margin:0;font-size:14px;color:${MUTED};">— TH-LABS Team</p>
              </td>
            </tr>
          </table>
          <p style="max-width:560px;margin:18px auto 0;padding:0 40px;font-size:12px;line-height:1.6;color:${MUTED};text-align:center;">This email was sent because you joined the TH-LABS early access community.</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function welcomeText(name: string) {
  return `Welcome, ${name}

Thank you for joining TH-LABS. Your registration has been successfully completed.

You are now one of our early members and will receive exclusive product updates, early announcements, and launch notifications before our public release.

OUR MISSION
To break language barriers through artificial intelligence and make the future more accessible for everyone. Our team is actively developing TH-LABS. As an early member, you'll be among the first to be notified as soon as our AI dubbing system becomes available.

Contact
Email     thethlabs.io@gmail.com
Website   th-labs-flame.vercel.app
Instagram instagram.com/th_labs.io
LinkedIn  Coming Soon

Thank you for supporting TH-LABS.
— TH-LABS Team

This email was sent because you joined the TH-LABS early access community.`;
}

export async function sendWelcomeEmail(to: string, name: string) {
  const from = SMTP_FROM ?? `TH-LABS <${SMTP_USER}>`;
  await getTransport().sendMail({
    from,
    to,
    subject: "Welcome to TH-LABS",
    text: welcomeText(name),
    html: welcomeHtml(name),
  });
}
