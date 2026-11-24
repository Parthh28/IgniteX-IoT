# Agent Handoff Document
## IgniteX IoT Club — Website Build Instructions

**For:** Developer / AI Coding Agent  
**Version:** 1.0  
**Companion Files:** `PRD.md`, `Design.md`

---

## 0. Before You Start — Read This

- This is a **static single-page website**. No backend. No database. No auth.
- All interactivity (nav, accordions, tabs) is handled in **Vanilla JS**. No React, no jQuery, no frameworks — keep the bundle zero-dependency.
- The entire site lives in **one HTML file** with an embedded or linked CSS file and one JS file.
- Color tokens are defined as CSS custom properties on `:root`. **Never hardcode hex values inside component styles** — always reference a token.
- The background tech animation is a `<canvas>` element rendered with Vanilla JS. It must be **non-blocking** (RAF-based, not setInterval).
- Mobile hamburger menu is **CSS-driven toggle** with JS only toggling a class. No inline styles from JS on nav elements.

---

## 1. File Structure

```
ignitex-iot/
├── index.html          ← Single page, all sections
├── css/
│   └── style.css       ← All styles, tokens, responsive
├── js/
│   ├── main.js         ← Nav, scroll, accordion, tabs
│   └── canvas.js       ← Tech background animation
├── assets/
│   ├── logo.png        ← IgniteX IoT logo (provided)
│   └── team/           ← Member photos (to be added by client)
│       ├── aashita.jpg
│       ├── sneha.jpg
│       ├── parth.jpg
│       ├── shreya.jpg
│       ├── suraj.jpg
│       └── sam.jpg
└── README.md
```

---

## 2. HTML Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="IgniteX IoT Club — Connect. Automate. Innovate." />
  <meta property="og:title" content="IgniteX IoT Club" />
  <meta property="og:description" content="Spark Ideas. Connect Possibilities." />
  <meta property="og:image" content="assets/logo.png" />
  <title>IgniteX IoT Club</title>
  <link rel="stylesheet" href="css/style.css" />
</head>
<body>

  <!-- NAV -->
  <nav id="navbar">...</nav>

  <!-- CANVAS BACKGROUND -->
  <canvas id="tech-bg"></canvas>

  <!-- SECTIONS -->
  <main>
    <section id="home">...</section>
    <section id="team">...</section>
    <section id="events">...</section>
    <section id="contact">...</section>
  </main>

  <!-- SCRIPTS -->
  <script src="js/canvas.js"></script>
  <script src="js/main.js"></script>
</body>
</html>
```

---

## 3. Component Specifications

### 3.1 Navbar

**Desktop (≥ 1024px):**
```html
<nav id="navbar">
  <div class="nav-container">
    <a href="#home" class="nav-logo">
      <img src="assets/logo.png" alt="IgniteX IoT Club" height="48" />
    </a>
    <ul class="nav-links">
      <li><a href="#home">Home</a></li>
      <li><a href="#team">Team</a></li>
      <li><a href="#events">Events</a></li>
      <li><a href="#contact">Contact</a></li>
    </ul>
  </div>
</nav>
```

**Mobile (< 1024px):**
- Hide `.nav-links` by default.
- Show hamburger button (`.nav-toggle`): three `<span>` bars.
- On click: add class `nav-open` to `<nav>`. CSS transitions `.nav-links` into a full-width dropdown.
- Close on outside click or on nav link click.

**JS behavior:**
```js
// main.js
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('#navbar');
toggle.addEventListener('click', () => nav.classList.toggle('nav-open'));
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => nav.classList.remove('nav-open'));
});
```

**Scroll behavior:**
- Add class `scrolled` to `<nav>` when `window.scrollY > 50`. This darkens the nav background slightly and adds a bottom border (see Design.md).
- Active link: on scroll, detect which section is in viewport. Add `.active` class to the corresponding nav link.

---

### 3.2 Home Section

```html
<section id="home">
  <div class="hero">
    <img src="assets/logo.png" alt="IgniteX IoT Club Logo" class="hero-logo" />
    <h1 class="hero-title">IgniteX IoT Club</h1>
    <p class="hero-tagline">Connect · Automate · Innovate</p>
    <p class="hero-sub">Spark Ideas. Connect Possibilities.</p>
    <a href="#events" class="btn btn-primary">Explore Events</a>
  </div>

  <div class="about-block">
    <h2>About the Club</h2>
    <p><!-- Client to provide text --></p>
  </div>

  <div class="stats-bar">
    <div class="stat"><span class="stat-num">12+</span><span class="stat-label">Events</span></div>
    <div class="stat"><span class="stat-num">200+</span><span class="stat-label">Members</span></div>
    <div class="stat"><span class="stat-num">3</span><span class="stat-label">Years Active</span></div>
  </div>

  <div class="past-events">
    <h2>Past Events</h2>
    <div class="events-grid">
      <!-- Repeat for each past event -->
      <div class="event-card past">
        <div class="event-img-placeholder"></div>
        <span class="event-tag">Workshop</span>
        <h3>Event Name</h3>
        <p class="event-date">Jan 2026</p>
        <p class="event-desc">Brief description of what happened.</p>
      </div>
    </div>
  </div>
</section>
```

---

### 3.3 Team Section

**Primary member card:**
```html
<div class="member-card" data-member="parth">
  <div class="member-photo">
    <img src="assets/team/parth.jpg" alt="Parth" />
  </div>
  <div class="member-info">
    <h3>Parth</h3>
    <span class="member-role">President</span>
    <p class="member-bio">Short bio here. 2–3 sentences max.</p>
  </div>
  <button class="expand-btn" aria-expanded="false" aria-controls="team-parth">
    <span class="expand-icon">+</span> View Team
  </button>
  <div class="sub-team" id="team-parth" hidden>
    <!-- Sub-team co-ordinators here -->
    <div class="coordinator-card">
      <div class="coord-avatar"><!-- photo or initials --></div>
      <div>
        <strong>Co-ordinator Name</strong>
        <span>Role</span>
      </div>
    </div>
  </div>
</div>
```

**Members with expand capability:** Parth (President → core team), Shreya (VP → event team), Suraj (Marketing Head → marketing co-ords), Sam (Media Head → media co-ords).

**Faculty cards (Aashita, Sneha):** Same card structure, no expand button.

**JS — Accordion:**
```js
document.querySelectorAll('.expand-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = document.getElementById(btn.getAttribute('aria-controls'));
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', !isOpen);
    btn.querySelector('.expand-icon').textContent = isOpen ? '+' : '−';
    if (isOpen) {
      target.hidden = true;
    } else {
      target.hidden = false;
    }
  });
});
```

**Layout:** CSS Grid. 3 columns desktop, 2 tablet, 1 mobile. Faculty co-ordinators span full width at the top row as a visual distinction.

---

### 3.4 Events Section

```html
<section id="events">
  <h2>Events</h2>
  <div class="events-filter">
    <button class="filter-btn active" data-filter="upcoming">Upcoming</button>
    <button class="filter-btn" data-filter="past">Past</button>
  </div>
  <div class="events-grid" id="events-grid">
    <div class="event-card" data-status="upcoming">
      <div class="event-header">
        <span class="event-tag">Hackathon</span>
        <span class="status-badge open">Open</span>
      </div>
      <h3>Event Name</h3>
      <p class="event-meta">📅 12 Nov 2026 · 10:00 AM · Offline</p>
      <p class="event-desc">What this event is about.</p>
      <a href="REGISTRATION_LINK" target="_blank" class="btn btn-primary btn-sm">Register</a>
    </div>
  </div>
</section>
```

**JS — Filter tabs:**
```js
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.event-card').forEach(card => {
      card.style.display = card.dataset.status === filter ? 'flex' : 'none';
    });
  });
});
```

**Status badge colors:**
- `open` → cyan (`#08B8F8`)
- `closed` → silver (`#777675`)
- `upcoming` → orange (`#F87818`)

---

### 3.5 Contact Section

```html
<section id="contact">
  <h2>Get in Touch</h2>
  <div class="contact-wrapper">
    <form class="contact-form" action="https://formspree.io/f/YOUR_ID" method="POST">
      <div class="form-group">
        <label for="name">Name</label>
        <input type="text" id="name" name="name" required placeholder="Your name" />
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" name="email" required placeholder="your@email.com" />
      </div>
      <div class="form-group">
        <label for="message">Message</label>
        <textarea id="message" name="message" rows="5" required placeholder="What's on your mind?"></textarea>
      </div>
      <button type="submit" class="btn btn-primary">Send Message</button>
    </form>

    <div class="contact-socials">
      <a href="mailto:club@email.com" class="social-link" aria-label="Email"><!-- email SVG icon --></a>
      <a href="https://instagram.com/HANDLE" class="social-link" aria-label="Instagram"><!-- IG SVG icon --></a>
      <a href="https://linkedin.com/in/HANDLE" class="social-link" aria-label="LinkedIn"><!-- LI SVG icon --></a>
      <a href="https://github.com/HANDLE" class="social-link" aria-label="GitHub"><!-- GH SVG icon --></a>
    </div>
  </div>
</section>
```

**Form:** Use Formspree free tier. Replace `YOUR_ID` with client's form ID after they sign up at formspree.io. No back-end needed.

---

## 4. Canvas Tech Background

File: `js/canvas.js`

**What it draws:** Animated floating nodes (dots) connected by thin lines when within distance threshold. Nodes drift slowly. Color palette: cyan `#08B8F8` for nodes, electric blue `#0878F8` for connection lines, very low opacity (0.08–0.15) on the overall canvas to keep it subtle.

**Algorithm:**
```js
// Pseudocode
const canvas = document.getElementById('tech-bg');
const ctx = canvas.getContext('2d');
let nodes = [];

function init() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  nodes = Array.from({ length: 60 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    r: Math.random() * 2 + 1
  }));
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Draw connections
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dist = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
      if (dist < 120) {
        ctx.strokeStyle = `rgba(8, 120, 248, ${(1 - dist / 120) * 0.3})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }
  }
  // Draw nodes
  nodes.forEach(n => {
    ctx.fillStyle = 'rgba(8, 184, 248, 0.6)';
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
    ctx.fill();
    // Move node
    n.x += n.vx;
    n.y += n.vy;
    // Bounce off edges
    if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
    if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
  });
  requestAnimationFrame(draw);
}

window.addEventListener('resize', init);
init();
draw();
```

**CSS positioning:**
```css
#tech-bg {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  z-index: 0;
  pointer-events: none;
  opacity: 0.4; /* Keep it subtle */
}
main, nav { position: relative; z-index: 1; }
```

---

## 5. Smooth Scroll & Active Nav

```js
// Smooth scroll to section on nav click
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector(anchor.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
  });
});

// Active nav link on scroll
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.5 });
sections.forEach(s => observer.observe(s));
```

---

## 6. Responsive Breakpoints

```css
/* Mobile first */
/* Base: 320px+ (mobile) */

/* Tablet */
@media (min-width: 768px) { ... }

/* Desktop */
@media (min-width: 1024px) { ... }

/* Large desktop */
@media (min-width: 1440px) { ... }
```

---

## 7. Content Placeholders — Client Must Provide

Mark all placeholder content with HTML comments `<!-- TODO: CLIENT -->` for easy find-and-replace:

| Placeholder | Location | Notes |
|---|---|---|
| About paragraph | Home section | 2–3 sentences |
| Past event data | Home section | Name, date, description, optional image |
| Real stats | Stats bar | Events count, member count, years active |
| Member photos | `assets/team/` | 400×400px min, JPG/PNG |
| Member bios | Team section cards | 2–3 sentences each |
| Sub-team co-ordinators | Expand panels | Names, roles, optional photos |
| Event data | Events section | Name, date, venue, description, registration link |
| Formspree ID | Contact form action | Sign up at formspree.io |
| Club email | Contact socials | Official email |
| Social handles | Contact socials | Instagram, LinkedIn, GitHub |

---

## 8. Accessibility Checklist

- [ ] All images have `alt` text.
- [ ] All interactive elements are keyboard-focusable.
- [ ] `aria-expanded` toggles correctly on accordion buttons.
- [ ] `aria-label` on icon-only social links.
- [ ] Color contrast meets WCAG AA (white on `#010612` passes easily).
- [ ] Focus styles visible (don't remove `outline` without replacing it).
- [ ] Form fields have associated `<label>` elements.

---

## 9. Deployment

1. Push to GitHub repository (public or private).
2. Enable **GitHub Pages** from Settings → Pages → Source: `main` branch, root.
3. Site is live at `https://USERNAME.github.io/REPO-NAME/`.
4. For custom domain: add a `CNAME` file in root with the domain, then configure DNS.
5. Alternative: drag the folder into **Netlify Drop** at netlify.com/drop for instant deploy.

---

## 10. Known Constraints & Decisions

- **No framework dependency** — keeps the site fast and maintainable by non-developers.
- **Canvas animation is optional** — if performance is a concern on low-end devices, replace with a static CSS SVG pattern background.
- **Formspree free tier** limits: 50 submissions/month. Upgrade if volume exceeds this.
- **Member photos:** Without photos, use CSS-generated initials avatars (colored circle + first letter). Do not use random stock photos.
- **Google Fonts:** Use a CDN link — Geist Mono or Space Grotesk are recommended. See Design.md.
