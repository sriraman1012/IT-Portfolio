# Hosting this portfolio on Render

## What kind of project is this?

**It is a Node project, not an HTML-only site.**

It looks like plain HTML because the whole front end is one file, but there is a small
Express server in `server/` that does two jobs:

1. **Handles the contact form** — `POST /api/contact` sends the enquiry to your Gmail
   over SMTP (`nodemailer`), with rate limiting and a honeypot for spam.
2. **Serves the portfolio itself** — `express.static()` publishes the repo root, so
   `index.html`, `photo.jpg` and your CV come from the same server.

Because of job 1, you need a Render **Web Service**, not a Render **Static Site**.
A Static Site can only serve files; it cannot run `server.js`, so the contact form
would stop working and every message would fail.

```
PORTFOLIO/
├── index.html                  ← the whole front end
├── photo.jpg                   ← profile picture
├── Sriraman-Rangarajan-CV.pdf  ← the CV the Download button hands over
├── favicon.svg
└── server/
    ├── server.js               ← Express: /api/contact + serves the files above
    ├── package.json            ← start script + dependencies
    └── .env                    ← Gmail app password — NEVER committed
```

---

## Step 1 — Put the code on GitHub

Render deploys from a Git repository. The repo is already initialised and committed
locally, with `.gitignore` set so your Gmail password, `node_modules` and your `.bak`
backups stay out of it.

1. Go to <https://github.com/new>, create a repository called **IT-Portfolio**.
   Leave "Add a README" unticked — this folder already has one.
2. Back here, push:

```bash
cd D:/Sriram/personal/PORTFOLIO
git remote add origin https://github.com/sriraman1012/IT-Portfolio.git
git push -u origin main
```

> **Check before pushing:** `git ls-files | grep .env` must return only
> `server/.env.example`. If it ever lists `server/.env`, stop — that file holds your
> Gmail app password.

---

## Step 2 — Create the Render Web Service

<https://dashboard.render.com> → **New** → **Web Service** → connect your GitHub repo.

| Setting | Value |
|---|---|
| **Name** | `sriraman-portfolio` (becomes `sriraman-portfolio.onrender.com`) |
| **Language / Runtime** | `Node` |
| **Branch** | `main` |
| **Root Directory** | `server` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` |

**Root Directory must be `server`** — that is where `package.json` lives. The server
still reaches the portfolio files, because it serves `..`, one level up from itself.

---

## Step 3 — Environment variables

In Render: **Environment** → **Add Environment Variable**. Copy the values out of your
local `server/.env` file.

| Key | Value |
|---|---|
| `GMAIL_USER` | `sriramanrangarajan10@gmail.com` |
| `GMAIL_APP_PASSWORD` | the 16-digit app password from `server/.env` |
| `MAIL_TO` | `sriramanrangarajan10@gmail.com` |
| `ALLOWED_ORIGINS` | `https://sriraman-portfolio.onrender.com` (fill in after the first deploy) |

**Do not set `PORT`.** Render assigns one and `server.js` already reads
`process.env.PORT`. Setting it yourself will stop the service binding correctly.

If the app password ever leaks, revoke it at
<https://myaccount.google.com/apppasswords> and paste a new one into Render.

---

## Step 4 — Deploy and check

Render builds and gives you a URL. Then check:

- `https://your-app.onrender.com/` — the portfolio loads
- `https://your-app.onrender.com/api/health` — returns `{"ok":true,...}`
- Send yourself a test message through the contact form
- Render **Logs** should say `SMTP ready — mail will be delivered to …`

---

## Step 5 — Point the site at its own address

Two values in `index.html` still assume the site is not online. Once you have the URL:

```js
siteUrl: "https://sriraman-portfolio.onrender.com",
```

That switches the WhatsApp / Email / LinkedIn / Copy-link buttons from your LinkedIn
profile to the real site. Optionally point the QR code at it too:

```js
qrData:    "https://sriraman-portfolio.onrender.com",
qrCaption: "My portfolio",
```

Then commit and push — Render redeploys automatically:

```bash
git add index.html && git commit -m "Point share links at the live site" && git push
```

---

## The one catch with the free plan

**Free Render web services sleep after 15 minutes without traffic.** The next visitor
waits roughly 30–60 seconds while it wakes up. For a portfolio you send to recruiters,
that first impression matters.

Three ways to handle it:

**A. Live with it** — free, nothing to change. Fine while you are still testing.

**B. Upgrade** — Render's paid Starter plan never sleeps.

**C. Split into two services** — the portfolio becomes a Static Site (free, instant,
never sleeps) and only the mailer stays a Web Service. The page always loads fast;
only the contact form pays the wake-up cost, and the visitor sees "Sending…" while it
happens.

To do C:

1. **Static Site** — New → Static Site, same repo.
   Build Command: *(leave empty)* · Publish Directory: `.`
2. **Web Service** — as in Steps 2–3 above, for the mailer.
3. In `index.html`, point the form at the mailer's absolute URL:

```js
formEndpoint: location.protocol === 'file:'
                ? 'http://localhost:8080/api/contact'
                : 'https://sriraman-mailer.onrender.com/api/contact',
```

4. Set `ALLOWED_ORIGINS` on the mailer to the **static site's** URL, so the browser's
   CORS check passes.

---

## Running it locally

```bash
cd server
npm install        # first time only
npm start
```

Then open <http://localhost:8080/>. The form posts to the local server, so you can test
real email delivery before deploying.
