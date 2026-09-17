# Portfolio Contact Mailer

Receives the contact form from `index.html` and emails it to you over Gmail SMTP.

## Where the 16-digit app password goes

**`server/.env` — nowhere else.**

It must not go in `index.html`, in a `<script>` tag, or in any frontend `.env`
(Vite/CRA `.env` files get compiled into the JavaScript the browser downloads).
Anything the browser can read, a visitor can read — and with your app password
they could send mail as you. Gmail also refuses SMTP connections from browsers
outright, so a frontend-only version cannot work even in principle.

This server is the only thing that ever sees the password.

## Setup

1. **Get the app password** (you already have one)
   <https://myaccount.google.com/apppasswords> — requires 2-Step Verification on.

2. **Fill in `.env`** (already created, with a placeholder password):

   ```
   GMAIL_USER=sriramanrangarajan10@gmail.com
   GMAIL_APP_PASSWORD=abcd efgh ijkl mnop     <- paste your 16 digits here
   MAIL_TO=sriramanrangarajan10@gmail.com
   PORT=8080
   ALLOWED_ORIGINS=
   ```

   Spaces in the password are fine — the server strips them.

3. **Run it**

   ```
   cd server
   npm install      # already done
   npm start
   ```

   On boot you should see:

   ```
   SMTP ready — mail will be delivered to sriramanrangarajan10@gmail.com
   Contact mailer listening on http://localhost:8080
   ```

   If you instead see `Invalid login: 535-5.7.8`, the password in `.env` is
   still the placeholder or was typed wrong.

4. **Open the portfolio** and send yourself a test message from the Contact Me
   form. It arrives with the visitor's address in **Reply-To**, so hitting
   Reply answers them directly.

## Endpoints

| Method | Path            | Purpose                                  |
| ------ | --------------- | ---------------------------------------- |
| `POST` | `/api/contact`  | `{ name, email, phone, message }` → mail |
| `GET`  | `/api/health`   | liveness + the configured delivery inbox |

## Going live

`index.html` currently points at `http://localhost:8080/api/contact`, which
only works while the server runs on your own machine. After deploying, set two
things:

- in `index.html`, `formEndpoint:` → your live API URL
- in `.env`, `ALLOWED_ORIGINS=https://your-site.com` so only your site can use it

Free hosts that take this as-is: Render, Railway, Fly.io, Vercel (as a function).
Set `GMAIL_USER`, `GMAIL_APP_PASSWORD` and `MAIL_TO` as environment variables in
the host's dashboard rather than uploading `.env`.

## Built-in protection

- **Honeypot** — the form's hidden `_gotcha` field; if a bot fills it the
  request is silently accepted and dropped.
- **Rate limit** — 5 messages per IP per 15 minutes.
- **CORS allowlist** — via `ALLOWED_ORIGINS` (empty = allow all, for testing).
- **Header-injection guard** — CR/LF stripped from name, email, phone.
- **Size caps** — 64 KB body, 5000-character message.
- `.gitignore` already excludes `.env` and `node_modules/`.
