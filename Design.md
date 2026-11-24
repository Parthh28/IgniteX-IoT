# Design Specification
## IgniteX IoT Club — Website

**Version:** 1.0  
**Role:** UI/UX Design Lead  
**Companion Files:** `PRD.md`, `Agent.md`

---

## 1. Design Philosophy

**Minimal. Immersive. Tech-honest.**

The IgniteX IoT Club is a serious technical organization. The design should feel like you're looking at a command interface or a hardware dashboard — not a generic student club template. Every visual element must earn its place. If it doesn't communicate anything, it gets cut.

Three principles:
1. **Dark, deep, purposeful** — deep navy backgrounds, not flat black. Creates depth without being harsh.
2. **Cyan leads, orange punctuates** — never fight for dominance. Cyan handles the tech identity; orange is reserved for action.
3. **Information first** — users should find what they need in under 5 seconds. No decorative carousels that hide content. No auto-playing slideshows.

---

## 2. Color System

Full token reference from `color.md`, mapped to semantic usage:

### 2.1 CSS Custom Properties

```css
:root {
  /* Backgrounds */
  --bg-primary:     #010612;   /* Page base, hero */
  --bg-secondary:   #051528;   /* Cards, sections, nav */
  --bg-elevated:    #081e38;   /* Hover states, active cards */

  /* Brand Blues */
  --accent-cyan:    #08B8F8;   /* Primary accent: icons, links, highlights */
  --accent-blue:    #0878F8;   /* Circuit lines, secondary blue elements */

  /* Brand Warm */
  --accent-orange:  #F87818;   /* CTA buttons, open badges, emphasis */
  --accent-gold:    #E87818;   /* Secondary orange, subtle warm touches */

  /* Neutrals */
  --silver:         #777675;   /* Borders, muted text, metallic details */
  --silver-light:   #ACCBD0;   /* Secondary borders, icon fills */

  /* Text */
  --text-primary:   #FFFFFF;   /* Headings, body text on dark bg */
  --text-secondary: #ACCBD0;   /* Subheadings, meta info, captions */
  --text-muted:     #777675;   /* Timestamps, tertiary info */

  /* Status */
  --status-open:    #08B8F8;   /* Event open */
  --status-closed:  #777675;   /* Event closed */
  --status-upcoming:#F87818;   /* Event upcoming */

  /* UI */
  --border:         rgba(8, 184, 248, 0.15);  /* Subtle card borders */
  --border-hover:   rgba(8, 184, 248, 0.45);  /* Card hover state border */
  --glow-cyan:      0 0 20px rgba(8, 184, 248, 0.2);  /* Glow on hover */
  --glow-orange:    0 0 20px rgba(248, 120, 24, 0.25); /* CTA glow */
}
```

### 2.2 Color Usage Rules

- **Never** use orange and cyan in the same button or the same sentence-level element. They compete visually.
- Orange buttons are for **primary CTAs only** (Register, Send Message, Explore Events). Everything else uses cyan or outline.
- Silver is for **supporting info** — meta text, dates, borders. Never use it for anything interactive.
- Background always goes: `--bg-primary` as the base, `--bg-secondary` for raised surfaces (cards, nav), `--bg-elevated` for interactive states.

---

## 3. Typography

### 3.1 Font Stack

**Heading Font:** `Space Grotesk` (Google Fonts)
- Geometric, slightly quirky, modern — avoids the "generic AI" feel of Inter or Poppins.
- Used for: H1, H2, H3, nav links, member names, event titles, CTA buttons.
- Weight: 600 (semibold) and 700 (bold).

**Body Font:** `DM Mono` (Google Fonts)
- Monospace with personality. Reinforces the tech/IoT identity without being developer-geeky.
- Used for: taglines, meta text, stat numbers, badges, code-adjacent content.
- Weight: 400 (regular), 500 (medium).

**Fallback Stack:**
```css
--font-heading: 'Space Grotesk', 'Trebuchet MS', sans-serif;
--font-body:    'DM Mono', 'Courier New', monospace;
```

**Google Fonts import:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
```

### 3.2 Type Scale

| Element | Font | Size (desktop) | Size (mobile) | Weight | Color |
|---|---|---|---|---|---|
| H1 (Hero title) | Space Grotesk | 3.5rem (56px) | 2.25rem (36px) | 700 | `--text-primary` |
| H2 (Section heading) | Space Grotesk | 2.25rem (36px) | 1.75rem (28px) | 600 | `--text-primary` |
| H3 (Card title) | Space Grotesk | 1.25rem (20px) | 1.125rem (18px) | 600 | `--text-primary` |
| Hero tagline | DM Mono | 1rem (16px) | 0.875rem (14px) | 400 | `--accent-cyan` |
| Body text | DM Mono | 0.9rem (14.4px) | 0.875rem (14px) | 400 | `--text-secondary` |
| Meta / dates | DM Mono | 0.8rem (12.8px) | 0.8rem (12.8px) | 400 | `--text-muted` |
| Buttons | Space Grotesk | 0.875rem (14px) | 0.875rem | 600 | `--text-primary` |
| Badge / tag | DM Mono | 0.7rem (11.2px) | 0.7rem | 500 | varies |

### 3.3 Line Heights & Spacing

```css
h1 { line-height: 1.1; letter-spacing: -0.02em; }
h2 { line-height: 1.2; letter-spacing: -0.01em; }
h3 { line-height: 1.3; }
p  { line-height: 1.65; }
.mono { letter-spacing: 0.03em; }
```

---

## 4. Spacing System

8px base grid. All spacing in multiples of 4 or 8.

```css
:root {
  --space-xs:  4px;
  --space-sm:  8px;
  --space-md:  16px;
  --space-lg:  24px;
  --space-xl:  40px;
  --space-2xl: 64px;
  --space-3xl: 96px;
}
```

**Section padding:** `--space-3xl` top/bottom on desktop, `--space-2xl` on mobile.  
**Container max-width:** `1200px`, centered, `--space-xl` horizontal padding.  
**Card padding:** `--space-lg` (24px) all sides.  
**Card gap in grid:** `--space-lg` (24px).

---

## 5. Component Design Specs

### 5.1 Navbar

**Height:** 72px desktop, 64px mobile.  
**Background:** `--bg-secondary` with `backdrop-filter: blur(12px)` and `background-color: rgba(5, 21, 40, 0.85)`.  
**Position:** `fixed`, `top: 0`, `width: 100%`, `z-index: 100`.  
**Border bottom:** `1px solid var(--border)`. On scroll (`.scrolled`): border color shifts to `var(--border-hover)`.

**Nav links:**
- Font: Space Grotesk 600, 0.875rem.
- Color: `--text-secondary` default.
- On hover: `--text-primary` + `--accent-cyan` underline (2px, `::after` pseudo-element).
- Active state: `--accent-cyan` color, underline persistent.

**Mobile hamburger:**
- 3 `<span>` bars: 24px wide, 2px height, `--accent-cyan` color, 5px gap.
- On open: top bar rotates +45°, bottom bar rotates -45°, middle bar fades out (CSS transitions).
- Mobile menu: full-width dropdown from nav. `--bg-secondary` background. Links stack vertically with 48px tap target height.

---

### 5.2 Hero

**Layout:** Centered column. Full viewport height (`100vh`). Content centered vertically with flexbox.  
**Logo:** 120px height, no filter (original colors preserved).  
**Title:** H1, Space Grotesk 700, large.  
**Tagline:** DM Mono, `--accent-cyan`, letter-spacing 0.2em, uppercase.  
**Sub-tagline:** DM Mono, `--text-secondary`, normal case.  
**CTA button:** See Button spec below.  
**Bottom:** Subtle scroll indicator arrow (animated bounce, `--accent-cyan`).

---

### 5.3 Cards (General)

```css
.card {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: var(--space-lg);
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}
.card:hover {
  border-color: var(--border-hover);
  box-shadow: var(--glow-cyan);
  transform: translateY(-2px);
}
```

No drop shadows except the glow on hover. No gradients inside cards unless explicitly specified.

---

### 5.4 Member Cards (Team Section)

**Photo:** Circular, 96px × 96px desktop, 80px mobile. `object-fit: cover`. Bordered with `2px solid var(--accent-cyan)`.  
**Placeholder avatar (no photo):** CSS-only circle. Background: `--bg-elevated`. Initial letter in `--accent-cyan`, Space Grotesk 700, 2rem.  
**Role badge:** Pill shape. Background: `rgba(8, 184, 248, 0.1)`. Border: `1px solid var(--accent-cyan)`. Text: `--accent-cyan`, DM Mono 0.7rem, uppercase, letter-spacing 0.1em.  
**Faculty role badge:** Same shape but orange: `rgba(248, 120, 24, 0.1)` background, `--accent-orange` border and text. Distinguishes faculty from student leads.

**Expand button:**
- Full width, bottom of card.
- Background: transparent. Border-top: `1px solid var(--border)`.
- Text: `--accent-cyan`, DM Mono.
- On hover: background `rgba(8, 184, 248, 0.05)`.
- Icon: `+` rotates to `×` when expanded (CSS transform).

**Expanded sub-team panel:**
- Background: `--bg-primary` (one level darker than card).
- Border-radius: `0 0 12px 12px` (continues the card shape).
- Coordinator mini-cards: horizontal row (avatar 40px circle + name + role).
- Animate open: `max-height` transition from `0` to `auto` equivalent (use `grid-rows: 0fr → 1fr` trick or JS-measured height).

---

### 5.5 Event Cards

**Status badge position:** Top-right corner of card, absolute.  
**Tag:** Top-left. Background: `rgba(8, 184, 248, 0.1)`. Text: `--accent-cyan`.  
**Register button:** Primary orange button. Only on upcoming/open events. Closed events: button replaced with "Registration Closed" text in `--text-muted`.  
**Hover:** Standard card hover — border brightens, slight lift.

**Filter buttons (Upcoming / Past):**
- Pill shape. Background: `--bg-secondary`. Border: `1px solid var(--border)`. Text: `--text-secondary`.
- Active: Background: `--accent-cyan`. Border: `--accent-cyan`. Text: `--bg-primary`.

---

### 5.6 Buttons

**Primary (orange — CTAs):**
```css
.btn-primary {
  background: var(--accent-orange);
  color: var(--text-primary);
  border: 1px solid var(--accent-orange);
  padding: 12px 28px;
  border-radius: 8px;
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 0.875rem;
  letter-spacing: 0.02em;
  transition: all 0.2s ease;
}
.btn-primary:hover {
  background: var(--accent-gold);
  box-shadow: var(--glow-orange);
  transform: translateY(-1px);
}
```

**Secondary (cyan outline — secondary actions):**
```css
.btn-secondary {
  background: transparent;
  color: var(--accent-cyan);
  border: 1px solid var(--accent-cyan);
  /* Same padding, radius, font */
}
.btn-secondary:hover {
  background: rgba(8, 184, 248, 0.08);
  box-shadow: var(--glow-cyan);
}
```

**Small variant:** Add `.btn-sm` → `padding: 8px 16px`, `font-size: 0.8rem`.

---

### 5.7 Contact Form

**Fields:**
```css
input, textarea {
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text-primary);
  font-family: var(--font-body);
  padding: 12px 16px;
  width: 100%;
  transition: border-color 0.2s ease;
}
input:focus, textarea:focus {
  outline: none;
  border-color: var(--accent-cyan);
  box-shadow: 0 0 0 3px rgba(8, 184, 248, 0.1);
}
```

**Labels:** Space Grotesk 600, 0.85rem, `--text-secondary`. Float above field (static label, not animated for simplicity).

**Social icon buttons:** 44×44px tap target. Icon size 20px. `--silver-light` default color → `--accent-cyan` on hover. Circular background on hover: `rgba(8, 184, 248, 0.08)`.

---

### 5.8 Stats Bar

Horizontal row, centered. Each stat: number in large Space Grotesk 700 `--accent-cyan`, label in DM Mono `--text-muted`. Separated by a `1px solid var(--border)` vertical divider (hidden on mobile; stats stack vertically on mobile).

---

### 5.9 Section Dividers

No horizontal `<hr>` lines. Sections are separated by:
1. Background color change: alternating `--bg-primary` and `--bg-secondary` for sections.
2. The canvas background is always visible behind everything.

**Section background alternation:**
- `#home`: transparent (canvas visible fully)
- `#team`: `--bg-secondary`
- `#events`: transparent
- `#contact`: `--bg-secondary`

---

## 6. Background Animation Design

**Type:** Particle-and-line network (node graph). Inspired by circuit board traces.  
**Nodes:** Small circles (radius 1–3px), `--accent-cyan` at 60% opacity.  
**Lines:** Drawn between nodes within 120px distance. Opacity proportional to closeness. `--accent-blue` at max 30% opacity.  
**Count:** 60 nodes on desktop. 30 on mobile (detect via `window.innerWidth < 768`).  
**Speed:** Very slow drift, `vx/vy` max `±0.4`. This is ambiance, not entertainment.  
**Canvas opacity:** `0.4` on `#tech-bg`. Do not increase — text readability is non-negotiable.

---

## 7. Iconography

**System:** Use inline SVG icons only. No icon font libraries (they add HTTP overhead and FOUT).

Recommended icons to create/copy:
- Hamburger (3 horizontal lines)
- Close (×)
- Chevron down/up (expand toggle)
- External link
- Email
- Instagram
- LinkedIn
- GitHub
- Calendar
- Location pin
- Tag

All icons: `currentColor` fill/stroke so they inherit color from CSS. Default stroke-width: 1.5px.

---

## 8. Grid & Layout

```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-xl);
}

/* Team grid */
.team-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-lg);
}
@media (max-width: 1023px) { .team-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 767px)  { .team-grid { grid-template-columns: 1fr; } }

/* Events grid */
.events-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-lg);
}
@media (max-width: 1023px) { .events-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 767px)  { .events-grid { grid-template-columns: 1fr; } }

/* Past events (Home) */
.past-events-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-md);
}
@media (max-width: 767px)  { .past-events-grid { grid-template-columns: 1fr; } }
```

---

## 9. Micro-interactions & Animations

| Element | Interaction | Animation |
|---|---|---|
| Nav links | Hover | Underline slides in from left (`scaleX` 0→1) |
| Cards | Hover | `translateY(-2px)` + border glow |
| Expand button | Click | `+` rotates to `×`, sub-panel slides down |
| Filter buttons | Click | Background fill slides in |
| CTA button | Hover | Slight lift + glow |
| Hero | Load | Fade-in + `translateY(20px → 0)` staggered for logo, title, tagline |
| Scroll | Any | Navbar `backdrop-filter` intensifies |

**Timing:** All transitions `200ms ease`. Accordion: `300ms ease`. Hero load: `400ms ease`, staggered by `100ms` per element.

**Accessibility note:** All animations respect `@media (prefers-reduced-motion: reduce)` — transitions set to `0ms` for users who opt out.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
  #tech-bg { display: none; } /* Disable canvas animation entirely */
}
```

---

## 10. Footer

Minimal. One line.
- Center-aligned text: `© 2026 IgniteX IoT Club · Connect. Automate. Innovate.`
- Font: DM Mono, `--text-muted`, 0.8rem.
- Background: `--bg-primary`.
- Top border: `1px solid var(--border)`.
- Padding: `var(--space-lg)` top/bottom.

---

## 11. Design Don'ts

- **No pure black (#000000)** backgrounds — use `--bg-primary` (#010612).
- **No gradients as card backgrounds** — reserved only for the logo and potential hero accents.
- **No shadows except the defined glow tokens** — no standard CSS box-shadows with grey/black.
- **No rounded corners > 16px** — keep it geometric, not bubble-UI.
- **No centered body text blocks** — center only for hero and stats. All other content: left-aligned.
- **No auto-playing content** — no carousels, no slideshows, no looping videos.
- **No generic stock images** — use real photos or tech-themed placeholders (circuit board textures, etc.) that match the brand.
- **No Comic Sans, no system fonts as primary** — Space Grotesk and DM Mono only.

---

## 12. Design Assets Checklist

**Provided by client:**
- [x] Logo file (PNG with transparency recommended)
- [x] Color palette (`color.md`)

**To be provided by client:**
- [ ] Member photos (400×400px minimum, JPG/PNG)
- [ ] Any existing brand assets (posters, social media graphics)
- [ ] Event images for past events

**To be created by designer/developer:**
- [ ] Favicon (32×32 PNG from logo mark)
- [ ] Social OG image (1200×630px) for link previews
- [ ] SVG icon set (inline, see Section 7)
- [ ] Initials-based avatar placeholders (CSS-only)
