# Product Requirements Document (PRD)
## IgniteX IoT Club — Official Website

**Version:** 1.0  
**Author:** UI/UX Design Lead  
**Status:** Draft  
**Last Updated:** November 2026

---

## 1. Overview

### 1.1 Product Summary
A minimal, interactive, single-page website for **IgniteX IoT Club** — a college tech club focused on IoT, AI, and emerging technologies. The site serves as the club's public face: showcasing its identity, team, events, and providing a contact channel.

### 1.2 Problem Statement
The club currently has no centralized digital presence. Students and faculty have no single place to discover the club, its events, or contact the leadership — leading to fragmented communication and missed recruitment opportunities.

### 1.3 Goals
- Establish a credible, professional digital identity for IgniteX IoT Club.
- Provide a low-friction way for students to discover events and register.
- Showcase the team in a structured, expandable format.
- Enable easy contact without requiring complex forms or third-party integrations.

### 1.4 Non-Goals
- No back-end admin dashboard (out of scope for v1).
- No user authentication or login.
- No payment integration.
- No blog or content management system.

---

## 2. Target Users

| User Type | Description | Primary Need |
|---|---|---|
| **Prospective Members** | Students who don't know about the club yet | Discover what the club does, who's in it, how to join |
| **Existing Members** | Current club participants | Check upcoming events, find contact info |
| **Faculty / Administration** | Teachers and staff | Verify club legitimacy, contact coordinators |
| **External Visitors** | General audience | Learn about the club's work and ethos |

---

## 3. Functional Requirements

### 3.1 Navigation
- **Desktop:** Horizontal navbar with links to all 4 sections. Sticky on scroll. Logo on the left.
- **Mobile:** Hamburger menu (3-line icon). Opens a full-width or side-drawer menu on tap.
- Smooth scroll behavior to anchor sections.
- Active link highlighting based on scroll position.

---

### 3.2 Section 1 — Home

**Purpose:** First impression. Club identity, motto, and quick past event highlights.

**Required Elements:**
- Hero block with club logo, name, tagline ("Connect. Automate. Innovate."), and sub-tagline ("Spark Ideas. Connect Possibilities.")
- CTA button: "Explore Events" → scrolls to Events section.
- "About the Club" brief paragraph (2–3 sentences about IgniteX IoT's mission and focus areas: IoT, AI, automation).
- **Past Events Highlights:** Grid or carousel of 3–6 past events. Each card shows: event name, date, brief description, and an optional image placeholder.
- **Stats bar** (optional but recommended): e.g., "12 Events Hosted · 200+ Members · 3 Years Active" — placeholders until real data is provided.
- **Tech-themed animated background:** Subtle circuit board or node-and-line pattern using brand colors. Must not distract from content.

**Content Placeholders Needed From Client:**
- About paragraph text.
- Past event names, dates, descriptions, and photos (optional).
- Real stats if available.

---

### 3.3 Section 2 — Team

**Purpose:** Transparent team structure. Expandable cards for coordinators under each head.

**Required Elements:**
- Section heading: "Meet the Team"
- 5 primary member cards displayed in a responsive grid.

**Primary Members:**

| Name | Role | Sub-team Trigger |
|---|---|---|
| Aashita Ma'am | Faculty Co-ordinator | No expand (top-level) |
| Sneha Ma'am | Faculty Co-ordinator | No expand (top-level) |
| Parth | President | Expands to show core team co-ordinators |
| Shreya | Vice-President | Expands to show event team co-ordinators |
| Suraj | Marketing Head | Expands to show marketing team |
| Sam | Media Head | Expands to show media team |

> **Note:** Client specified 5 main members but listed 6 names. Flagging this — either combine both faculty co-ordinators into one card (Faculty Co-ordinators) or display 6 cards. Recommend 6 for clarity.

**Card Elements (each):**
- Photo (circular crop, with placeholder if not provided).
- Name.
- Role/Title badge.
- Short bio (2–3 lines).
- Expand/Collapse toggle (chevron or "+" icon).

**Expanded State (on click):**
- Smooth accordion/modal reveal.
- Shows subordinate co-ordinators of that team.
- Each co-ordinator: name, role, photo placeholder.

**Content Placeholders Needed From Client:**
- Photos of all 6 members.
- Short bios for each.
- Names and roles of sub-team co-ordinators.

---

### 3.4 Section 3 — Events

**Purpose:** Display current and upcoming events. Allow students to register.

**Required Elements:**
- Section heading: "Events"
- Tab or toggle: **Upcoming / Past** (filter between the two).
- Event cards in a responsive grid. Each card includes:
  - Event name.
  - Date and time.
  - Venue / mode (online/offline).
  - Short description.
  - Tags (e.g., Workshop, Hackathon, Seminar).
  - **"Register" button** — links to Google Form or external registration link (per event).
  - Status badge: "Open", "Closed", "Upcoming".
- Empty state message if no events exist yet: "Stay tuned — something is coming."

**Content Placeholders Needed From Client:**
- Event names, dates, descriptions, registration links.

---

### 3.5 Section 4 — Contact

**Purpose:** Simple way for students or external parties to reach the club.

**Required Elements:**
- Section heading: "Get in Touch"
- Contact form fields:
  - Name (required).
  - Email (required, validated).
  - Message (required, textarea).
  - Submit button.
- Form submission: Email via `mailto:` link or a free service like Formspree (no back-end needed).
- Social links: Instagram, LinkedIn, GitHub, Email — as icon buttons.
- Optional: Club's physical room/lab location (if applicable).

**Content Placeholders Needed From Client:**
- Official club email.
- Social media handles/links.
- Physical location (optional).

---

## 4. Non-Functional Requirements

| Requirement | Detail |
|---|---|
| **Performance** | Page should load under 3 seconds on a 4G connection. No heavy libraries unless necessary. |
| **Responsiveness** | Must work on mobile (320px+), tablet (768px+), and desktop (1024px+). |
| **Accessibility** | WCAG AA contrast ratios. Alt text on all images. Keyboard-navigable. |
| **Browser Support** | Chrome, Firefox, Safari, Edge — latest 2 versions. |
| **Hosting** | Static site. Deployable to GitHub Pages, Vercel, or Netlify with zero config. |
| **Tech Stack** | HTML5, CSS3 (custom properties), Vanilla JS or lightweight framework (React if component complexity warrants it). No jQuery. |
| **SEO** | Proper meta tags, Open Graph tags, descriptive page title. |

---

## 5. Color Palette Reference

Per `color.md` supplied by client:

| Token | Hex |
|---|---|
| Primary Background | `#010612` |
| Secondary Background | `#051528` |
| Primary Accent (Cyan) | `#08B8F8` |
| Secondary Blue | `#0878F8` |
| Warm Accent (Orange) | `#F87818` |
| Golden Orange | `#E87818` |
| Silver | `#777675` |
| Light Silver | `#ACCBD0` |
| Text (Primary) | `#FFFFFF` |

Orange is the secondary accent. Cyan/blue is dominant. Orange used only for CTAs and highlights.

---

## 6. Open Questions / Client Decisions Required

1. **Member count:** 5 or 6 primary cards? (Both faculty co-ordinators listed separately or combined?)
2. **Sub-team co-ordinators:** Names and roles for teams under Parth, Shreya, Suraj, Sam?
3. **Photos:** Are member photos available? If not, should we use initials-based avatars?
4. **Registration flow:** External form link (Google Form) per event, or a unified registration system?
5. **Contact form backend:** Formspree free tier acceptable? Or email directly via mailto?
6. **Animations:** Preference for subtle (performance-first) vs rich (visual-first) tech background effects?
7. **Domain:** Does the club have a custom domain, or will GitHub Pages suffice?

---

## 7. Deliverables

| File | Purpose |
|---|---|
| `PRD.md` | This document — product requirements |
| `Agent.md` | Developer handoff — component breakdown, build instructions |
| `Design.md` | Visual design spec — typography, spacing, color tokens, component states |
| `index.html` | Main site file (future) |
| `style.css` / tokens | Design system implementation (future) |
| `script.js` | Interactivity — nav, accordion, tabs (future) |

---

## 8. Success Metrics

- Site loads correctly on all target devices and browsers.
- All 4 sections are reachable via nav and smooth scroll.
- Team member expand/collapse works without bugs.
- Event registration button links open correctly.
- Contact form submits without errors.
- Zero console errors in production.
