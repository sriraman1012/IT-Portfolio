/* ==================================================================
   PORTFOLIO CONTACT MAILER
   ------------------------------------------------------------------
   Receives the contact form POST from index.html and emails it to you
   over Gmail SMTP.

   The 16-digit Gmail app password lives ONLY in server/.env — never in
   index.html, never in any file the browser downloads. This process is
   the only thing that ever sees it.
   ================================================================== */

require('dotenv').config();

const path      = require('path');
const express   = require('express');
const cors      = require('cors');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');

const app  = express();
const PORT = process.env.PORT || 8080;

/* ---------- required config ---------- */
const GMAIL_USER = process.env.GMAIL_USER;
/* Google shows the app password as "abcd efgh ijkl mnop" — spaces are
   display only, so strip them and let either form work. */
const GMAIL_APP_PASSWORD = (process.env.GMAIL_APP_PASSWORD || '').replace(/\s/g, '');
const MAIL_TO = process.env.MAIL_TO || GMAIL_USER;

if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
  console.error('\n  Missing GMAIL_USER or GMAIL_APP_PASSWORD.');
  console.error('  Copy .env.example to .env and fill both in, then restart.\n');
  process.exit(1);
}
if (GMAIL_APP_PASSWORD.length !== 16) {
  console.warn(`  Warning: app password is ${GMAIL_APP_PASSWORD.length} characters, expected 16.`);
}

/* ---------- who is allowed to call this API ----------
   Comma-separated list in .env, e.g.
     ALLOWED_ORIGINS=https://sriram.dev,http://localhost:5500
   Requests with no Origin (curl, Postman, a file:// page) are allowed
   through so local testing works.                                    */
const ALLOWED = (process.env.ALLOWED_ORIGINS || '')
  .split(',').map(s => s.trim()).filter(Boolean);

app.use(cors({
  origin(origin, cb) {
    if (!origin || !ALLOWED.length || ALLOWED.includes(origin)) return cb(null, true);
    cb(new Error('Origin not allowed: ' + origin));
  }
}));

app.use(express.json({ limit: '64kb' }));

/* ---------- throttle: 5 messages per IP per 15 minutes ---------- */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: 'Too many messages. Please try again in a little while.' }
});

/* ---------- SMTP transport ---------- */
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD }
});

/* ---------- helpers ---------- */
const esc = s => String(s == null ? '' : s)
  .replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* Strip CR/LF so nothing can inject extra mail headers via the subject. */
const oneLine = s => String(s == null ? '' : s).replace(/[\r\n]+/g, ' ').trim();

const validate = body => {
  const name    = oneLine(body.name).slice(0, 120);
  const email   = oneLine(body.email).slice(0, 160);
  const phone   = oneLine(body.phone).slice(0, 40);
  const message = String(body.message == null ? '' : body.message).slice(0, 5000).trim();

  if (!name)    return { error: 'Please add your name.' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: 'Please add a valid email address.' };
  /* exactly 10 digits — the form enforces this too, but a POST can
     arrive from anywhere, so the rule is re-checked here */
  const digits = phone.replace(/\D/g, '');
  if (digits.length !== 10) return { error: 'Please enter a 10-digit mobile number.' };
  if (!message) return { error: 'Please add a message.' };

  return { value: { name, email, phone, message } };
};

/* ---------- POST /api/contact ---------- */
app.post('/api/contact', limiter, async (req, res) => {
  /* honeypot — the form ships a hidden _gotcha field that only bots fill */
  if (req.body && req.body._gotcha) return res.json({ ok: true });

  const { error, value } = validate(req.body || {});
  if (error) return res.status(400).json({ ok: false, error });

  const { name, email, phone, message } = value;

  const text = [
    `Name:    ${name}`,
    `Email:   ${email}`,
    `Phone:   ${phone}`,
    '',
    message
  ].join('\n');

  const html = `
    <div style="font-family:system-ui,Segoe UI,Arial,sans-serif;font-size:15px;color:#1a1a1a">
      <h2 style="margin:0 0 16px;font-size:18px">New portfolio enquiry</h2>
      <table cellpadding="6" style="border-collapse:collapse;font-size:14px">
        <tr><td style="color:#666">Name</td><td><b>${esc(name)}</b></td></tr>
        <tr><td style="color:#666">Email</td><td><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
        <tr><td style="color:#666">Phone</td><td><a href="tel:${esc(phone.replace(/\s/g, ''))}">${esc(phone)}</a></td></tr>
      </table>
      <p style="margin:18px 0 6px;color:#666;font-size:13px">Message</p>
      <div style="white-space:pre-wrap;padding:14px 16px;background:#f5f6f8;border-radius:8px">${esc(message)}</div>
    </div>`;

  try {
    await transporter.sendMail({
      /* Gmail requires the authenticated account as the sender, so the
         visitor goes in Reply-To — hitting Reply answers them directly. */
      from: `"Portfolio Contact" <${GMAIL_USER}>`,
      to: MAIL_TO,
      replyTo: `"${name}" <${email}>`,
      subject: `Portfolio enquiry from ${oneLine(name)}`,
      text,
      html
    });
    res.json({ ok: true });
  } catch (err) {
    console.error('sendMail failed:', err.message);
    res.status(502).json({ ok: false, error: 'Could not send the message right now.' });
  }
});

/* ---------- serve the portfolio itself ----------
   Same origin as the API, so the form needs no CORS at all and one
   link covers the whole thing. The /server folder is blocked first so
   .env can never be fetched over HTTP.                               */
app.use((req, res, next) => {
  if (/^\/server(\/|$)/i.test(req.path)) return res.status(404).send('Not found');
  next();
});
app.use(express.static(path.join(__dirname, '..'), {
  dotfiles: 'deny',        /* blocks .env, .gitignore, anything dot-prefixed */
  index: 'index.html'
}));

/* ---------- health check ---------- */
app.get('/api/health', (_req, res) => res.json({ ok: true, mailTo: MAIL_TO }));

/* ---------- start ---------- */
transporter.verify()
  .then(() => console.log(`  SMTP ready — mail will be delivered to ${MAIL_TO}`))
  .catch(err => console.error('  SMTP check failed:', err.message));

app.listen(PORT, () => {
  console.log(`  Contact mailer listening on http://localhost:${PORT}`);
  console.log(`  Portfolio: http://localhost:${PORT}/`);
});
