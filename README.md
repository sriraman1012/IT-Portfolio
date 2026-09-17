# Sriraman Rangarajan — Implementation Lead Portfolio

A single-file portfolio site in the **Soft UI** style — rounded white cards, diffuse shadows,
blue/cyan gradient accents and muted navy text on a light grey background.
No build step, no dependencies, no internet needed.

## Changing the colours

Every colour on the site comes from a handful of tokens at the very top of the `<style>` block in
`index.html`. Change one line and the whole site follows — panels, chips, icons, buttons, borders:

```css
--grad-main:linear-gradient(310deg,#2152ff,#21d4fd);  /* the accent gradient */
--grad-dark:linear-gradient(310deg,#0b2f8f,#2152ff);  /* deeper blue, section headers */
--accent:#2152ff;      /* solid version, for links and small text */
--bg:#eef2fa;          /* page background behind the cards */
--sheet:#ffffff;       /* card surface */
--sunken:#f4f7fd;      /* inset tiles inside a card */
--ink:#1c3f7c;         /* headings — blue navy */
--ink-2:#55689b;       /* body copy */
--ink-3:#5b6e99;       /* small muted labels */
--r-lg:16px;           /* card corner radius */
```

Every neutral is a blue tint rather than grey, so the whole page reads blue rather than graphite.

Want a different accent? Swap `--grad-main` for one of the other Soft UI gradients —
purple/pink `linear-gradient(310deg,#7928ca,#ff0080)`, green `linear-gradient(310deg,#17ad37,#98ec2d)`,
or dark navy `linear-gradient(310deg,#141727,#3a416f)`. Nothing is hardcoded, so the whole site follows.

## Open it

Double-click `index.html`. It opens in any browser.

## Pages

| # | Page | What's on it |
|---|------|--------------|
| — | **Cover** | "Portfolio" right-aligned on a blue/cyan gradient card, white strip with your name and role |
| — | **About** | About Me, gradient photo slot, stat tiles (2.8+ yrs · 35+ stores · 6 app types · 2+ rollouts), Education, social icon row |
| 01 | **Experience** | Timeline with gradient dots — Uniprotech and ZF |
| 02 | **Projects** | Five project cards with gradient numerals: PAARRever/KRPL, Revathi Stores, 35+ store POS support, Industrial (WIP/WMS/Asset Tracking/Dispatch), AI-Powered Attendance app |
| 03 | **Expertise** | 16 skill tiles with gradient icons + Strengths pills |
| 04 | **Process** | The 7 stages as numbered cards |
| 05 | **Toolkit** | Five grouped cards with outlined chips, including Build & AI-Assisted Dev |
| 06 | **Testimonials** | *Hidden until you add one* |
| 07 | **Certifications** | *Hidden until you add one* |
| 08 | **Contact** | Dark gradient header, Phone / Email / Address tiles, social row, CV + Portfolio download cards, share block, SCAN HERE + QR |
| 09 | **Contact Me** | "Have an implementation project or opportunity? Let's connect!" + working message form |

Section numbers renumber themselves automatically when a hidden page is switched on.

## Your photo — the flip card

The About page carries a **flip card** (adapted from the Uiverse.io card by *aadium*):

- **Front** — your portrait in a circle
- **Back** — a short pitch and your LinkedIn / GitHub / Instagram icons

It turns over on hover, on tap (phones have no hover), and on Enter when focused by keyboard.

**Your picture** is already in place as `photo.jpg`. To swap it, save a new one over that file.

Because the current picture is a wide scene rather than a head-and-shoulders shot, it is zoomed
and offset so your face sits in the middle of the circle. Three values in `:root` control that:

```css
--photo-zoom:1.8;   /* 1 = the whole picture; higher closes in       */
--photo-x:-58%;     /* slides the picture left/right behind the ring */
--photo-y:-6%;      /* slides it up/down                             */
```

If you later swap in a normal square headshot, set `--photo-zoom:1` and both offsets to `0`.

Change the back text in `DATA`:

```js
cardBackTitle: "Let's work together",
cardBackText:  "ERP, Retail POS and WMS rollouts across Tamil Nadu — …",
```

## Sharing

Visitors (and you) can pass the portfolio on from two places:

- The **share button** in the top bar — opens a small menu
- A **Share this portfolio** block on the Contact page — buttons plus a copy-the-link bar

| Target | What happens |
|--------|--------------|
| **WhatsApp** | Opens WhatsApp with the message and link ready to send |
| **Email** | Opens a new email with subject and body filled in |
| **LinkedIn** | Opens LinkedIn's share composer |
| **Telegram** | Opens Telegram's share sheet |
| **X** | Opens a pre-written post |
| **Copy link** | Copies the address; the button confirms with a tick |
| **More…** | On phones only — opens the system share sheet (any installed app) |

### ⚠ Set your site address before sharing

Until the portfolio is online there is no address worth sending — a `file:///D:/...` path only
works on your own PC. So while you're opening the page from disk, sharing falls back to your
**LinkedIn profile** instead of a dead link.

Once you publish it, paste the real address into `DATA`:

```js
siteUrl: "https://sriraman1012.github.io/portfolio/",
```

From then on, every share button and the copy bar use that. You can also change the message:

```js
shareTitle: "Sriraman Rangarajan — Software Implementation Lead",
shareText:  "…the message that goes with the link…",
```

## The QR code

The "SCAN HERE" code on the Contact page is **drawn by the page itself** — there's a small QR
encoder built into `index.html`. Nothing to download, nothing to regenerate, and it can never
fall out of step with your details.

Right now it points at your LinkedIn profile. To change what it does, edit one line in `DATA`:

```js
qrData:    "https://in.linkedin.com/in/sriraman-rangarajan-656a81363",
qrCaption: "LinkedIn profile",
```

Useful alternatives:

| Put this in `qrData` | Scanning it does this |
|----------------------|----------------------|
| `tel:+919585261683` | Dials your number |
| `mailto:sriramanrangarajan10@gmail.com` | Opens a new email to you |
| `https://your-site.com` | Opens your live portfolio |
| `MECARD:N:Sriraman Rangarajan;TEL:+919585261683;EMAIL:sriramanrangarajan10@gmail.com;;` | Saves you to their phone contacts |

`qrCaption` is the small label under "Scan here", so people know what they'll get.

The encoder handles roughly 200 characters. Longer text shows "QR too long" instead of a broken
code. It draws as SVG, so it stays sharp at any size and prints cleanly.

## Icons

All icons are **inline SVG** written into `index.html` — nothing is downloaded, so they render
identically offline, in print, and on any machine. Two sets live just above the render code:

- **`ICONS`** — outline icons used on the skill cards and contact boxes:
  `gear` `grid` `users` `target` `check` `up` `alert` `cap` `doc` `monitor` `db` `transfer`
  `shield` `chart` `link` `server` `phone` `mail` `pin`
- **`BRANDS`** — solid logos: `linkedin` `github` `instagram`

To change a skill's icon, just swap the name:

```js
{ icon: "shield", name: "Database Management & Integrity" },
```

**To add a new icon:** copy the SVG's inner markup (the `<path>` / `<circle>` bits, not the
`<svg>` wrapper) from any 24×24 icon set into a new key, then use that key by name:

```js
const ICONS = {
  ...
  truck: '<rect x="2" y="7" width="12" height="9"/><circle cx="7" cy="18" r="2"/>',
};
```

Outline icons inherit `stroke="currentColor"`; brand logos inherit `fill="currentColor"` —
so they recolor themselves automatically in dark mode and on hover.

### Your social links

Already wired in, on both the About and Contact pages:

| Icon | Handle | Link |
|------|--------|------|
| LinkedIn | sriraman-rangarajan | https://in.linkedin.com/in/sriraman-rangarajan-656a81363 |
| GitHub | sriraman1012 | https://github.com/sriraman1012 |
| Instagram | sriram10_ | https://instagram.com/sriram10_ |

Edit or add to the `social` array in `DATA`:

```js
social: [
  { icon: "linkedin", handle: "display-text", url: "https://..." }
],
```

## Edit anything else

All content lives in **one place** — scroll to the block near the bottom of `index.html`
marked `▼▼▼ YOUR CONTENT — EDIT THIS BLOCK ONLY ▼▼▼`. Change the text, save, refresh.
You never touch the layout.

| Key in `DATA` | Page |
|---------------|------|
| `name`, `role`, `kicker` | Cover |
| `subrole`, `summary`, `stats`, `education` | About |
| `experience` | Experience |
| `projects` | Projects |
| `skills`, `strengths` | Expertise |
| `process` | Process |
| `tools` | Toolkit |
| `testimonials` | Testimonials *(hidden while empty)* |
| `certifications` | Certifications *(hidden while empty)* |
| `contact`, `social`, `declaration` | Contact (`social` also appears on About and Contact Me) |
| `formEndpoint`, `formKey`, `formPitch` | Contact Me form — see below |
| `resumePdf` | What the nav Download button hands over — see below |

**Adding a project:** copy a whole `{ ... }` block inside `projects` (with its trailing comma)
and edit the copy. Same for skills, tools and experience entries.

**Turning on Testimonials:**

```js
testimonials: [
  { text: "How the rollout went, in the client's words.", who: "Name — Role, Company" }
],
```

**Turning on Certifications:**

```js
certifications: [
  { name: "Certification Name", issuer: "Issuing Body · 2025" }
],
```

## The contact form

The form at the bottom (Name · Email · Phone · Message · **Send Message**) works out of the box,
but you should know how it sends — a plain HTML page can't deliver email by itself, so there are
two modes.

### Mode 1 — mail app (active now, no setup)

Pressing **Send Message** opens the visitor's own email app with a message pre-filled and
addressed to you, then they press Send there. Works offline and costs nothing, but it depends on
the visitor having an email app configured — on a phone that's normal, on a shared PC it may not be.

### Mode 2 — straight to your inbox (recommended once it's online)

Messages arrive in your Gmail without the visitor leaving the page. Free, about two minutes:

**Web3Forms** (simplest — no account needed)

1. Go to <https://web3forms.com>, enter `sriramanrangarajan10@gmail.com`, get an access key by email.
2. In `index.html`, set:

```js
formEndpoint: "https://api.web3forms.com/submit",
formKey:      "paste-your-access-key-here",
```

**Formspree** (alternative)

1. Sign up at <https://formspree.io>, create a form, copy its ID.
2. In `index.html`, set:

```js
formEndpoint: "https://formspree.io/f/yourFormId",
formKey:      "",
```

Mode 2 only works once the site is hosted online — it won't send from a local `file://` page.

### Built in either way

- Required-field and email-format checks, with the error shown next to the button
- A hidden "spam trap" field that silently drops bot submissions
- Live status messages ("Sending…", "Thanks — your message is on its way")
- A fallback message pointing at your email address if sending ever fails
- The form is hidden when printing (the heading and your details still print)

Change the line under the heading via `formPitch` in `DATA`.

## The two downloads

Visitors can take away **two different documents**, each offered in two places — a round button
in the top bar and a card on the Contact page:

| | What it is | How it works |
|---|---|---|
| **⬇ Download CV** | Your 2-page resume, `Sriraman-Rangarajan-CV.pdf` | Downloads the file directly, one click |
| **🖨 Download Portfolio** | This designed web page, one section per page | Opens the print dialog → *Save as PDF* |

Your resume was copied here from `D:\Sriram\personal\SRIRAMAN.pdf`.

Want the portfolio to download as a fixed file too, instead of opening the print dialog?
Press `Ctrl+P`, save the result beside `index.html`, and name it in `DATA`:

```js
portfolioPdf: "Sriraman-Rangarajan-Portfolio.pdf",
```

The button and card switch to a direct download automatically. The trade-off: a saved file goes
stale when you edit the page, while the print route is always current.

**When you update your resume**, save the new version over
`Sriraman-Rangarajan-CV.pdf` in this folder. The filename is what the page points at, so keeping
the name the same means nothing else has to change. Upload it alongside `index.html` when you
publish the site, or the download will 404.

To change the wording or point at a different file, edit these in `DATA`:

```js
resumePdf:   "Sriraman-Rangarajan-CV.pdf",
resumeLabel: "Download CV",
resumeNote:  "Full resume — experience, technical skills, strengths and key achievements. PDF, 2 pages.",
```

Set `resumePdf: ""` and both controls fall back to the print dialog instead.

## Print the portfolio as a PDF

Separately from the CV file, the **web page itself** can be saved as a PDF: press `Ctrl+P` and
choose *Save as PDF*. Print styles drop the navigation and the contact form, keep the gradient
blocks, and put **one section per page** — so the result is a real multi-page portfolio.

> In the print dialog, tick **Background graphics** so the gradients and icons print.

This is useful if you want a designed portfolio document to send alongside the plain resume.

## Responsive behaviour

The page is built to work from a 320px phone up to a wide desktop. What changes, and where:

| Width | Behaviour |
|-------|-----------|
| **1180px +** (desktop / laptop) | Full nav on one line including the job title; two-column projects; four-across stats |
| **820–1180px** (small laptop, landscape tablet) | Job title drops from the logo so the nav stays on one line |
| **≤ 820px** (tablet, phone) | Nav links collapse into a **☰ drop-down menu**; Download and theme buttons stay visible |
| **≤ 780px** | Project Responsibilities / Achievements stack into one column |
| **≤ 768px** | Tighter page margins and gaps; smaller project number circles |
| **≤ 640px** (phone) | Photo moves **above** the About text and goes full width; skills, tools, contact and stats go single-column; process becomes 2×4; stat dividers become horizontal rules; form fields go full width with a full-width Send button |
| **≤ 380px** (small phone) | Process goes single column; compact skill cards and logo |

Other handling built in:

- **Menu closes itself** after you tap a link, on `Escape`, and when the window widens back out
- **Form fields use 16px on phones** — anything smaller makes iOS Safari zoom in on focus
- **No sideways scrolling** — minimum column widths are released on narrow screens rather than
  forcing the page wider than the viewport
- **Landscape phones** — the cover shrinks to fit instead of filling a short screen
- **Reduced motion** — hover lifts and smooth scrolling switch off for anyone who has that
  system preference set

## The top bar

Your name on the left, page links in the middle, and three matching round buttons on the right —
the download button is based on the Uiverse.io component by *vinodjangid07*. Each is a soft white
circle that fills with the accent gradient on hover and shows a tooltip underneath.

| Button | Does | Tooltip |
|--------|------|---------|
| ⌂ Home | Jumps back to the first page (the cover); stays filled while you're there | "Home" |
| ⬇ CV | Downloads your resume PDF | "Download CV" |
| 🖨 Portfolio | Saves this page as a multi-page PDF | "Download Portfolio" |
| ⤴ Share | Opens the share menu — WhatsApp, Email, LinkedIn, Telegram, X, Copy link | "Share" |
| ☾ / ☀ Theme | Switches light ↔ dark; remembers your choice | "Dark mode" / "Light mode" |
| ☰ Menu | Opens the page list — appears at 820px and below | "Menu" |

The theme button swaps between a **moon** (click for dark) and a **sun** (click for light), and the
menu button swaps between **☰** and **✕** while open, so each one shows what it will do next.

**Your name on the left is also a Home link** — clicking it returns to the cover, the way a logo
does on most sites. Below 430px the name hides so the five buttons keep their spacing; the cover
shows your name immediately anyway.

### The menu

The page links sit in a **frosted-glass pill** (adapted from the Uiverse.io menu by *mymiamo*) —
translucent blue with a blurred backdrop and an inner highlight, each item an icon above its
label. Hovering lights the item up; the page you're on turns into a white pill.

Icons come from the same `ICONS` set as the rest of the site. To change one, edit the `PAGES`
list near the bottom of `index.html`:

```js
{ id:'experience', label:'Experience', icon:'briefcase' },
```

Below 1140px the pill folds into the ☰ menu and becomes a plain white drop-down with the icons
beside the labels — glass effects don't read well as a tall list on a phone.

## Other features

- **Scroll-spy navigation** — the active page lifts into a raised pill as you scroll.
- **Holographic stat figures** — 2.8+ / 35+ / 6+ / 2+ are each drawn three times, stacked at
  different depths and slowly wobbling in 3D (adapted from the Uiverse.io holo card by
  *Thomas-Cabrit*). The four cards are staggered so the row doesn't move in unison.
- **3D focus hover** — point at any card and it lifts toward you while the others in that group
  ease back slightly (adapted from the Uiverse.io "cards" effect by *kamehame-ha*). Applies to
  stats, education, projects, skills, strengths, process, toolkit, contact, downloads, share
  buttons and social links. The siblings are **not** blurred, so everything stays readable.

To tune the effect, find the **3D FOCUS HOVER** block in the `<style>` section:

```css
transform:scale(1.06) translateZ(40px);              /* the card you point at */
opacity:.82;transform:scale(.96) translateZ(-30px);  /* the others            */
```

It is deliberately switched off on touch screens — a tap leaves `:hover` stuck, which would
freeze the group in a blurred state — and for anyone who has reduced-motion turned on.

## Publishing it online (optional)

Self-contained, so any static host works:

- **GitHub Pages** — push the folder to a repo, enable Pages in Settings.
- **Netlify Drop** — drag the folder onto <https://app.netlify.com/drop>.
- **Vercel / Cloudflare Pages** — point them at the folder.

Upload `Sriraman-Rangarajan-CV.pdf` alongside `index.html`, plus `photo.jpg` if you've added one.

## Files

```
PORTFOLIO/
├── index.html                   ← the entire site (HTML + CSS + content + QR encoder)
├── Sriraman-Rangarajan-CV.pdf   ← your resume, served by the Download CV button
├── README.md                    ← this file
└── photo.jpg                    ← optional, your portrait
```
