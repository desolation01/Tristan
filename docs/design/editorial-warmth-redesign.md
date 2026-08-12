# Editorial Warmth Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Strip AI slop aesthetic (glassmorphism, glows, gradient text) and rebuild visual layer with editorial warmth — Instrument Serif + Satoshi typography, warm oklch palette, single vermillion accent, zero decorative effects.

**Architecture:** Pure CSS rewrite of design tokens and surface styles, deletion of GSAP/AOS animation libraries, replacement with CSS keyframes + Intersection Observer. HTML structure stays intact. No build tools, no frameworks — direct file edits.

**Tech Stack:** HTML, CSS (oklch, custom properties, prefers-color-scheme), vanilla JS (Intersection Observer)

---

### Task 1: Update HTML — Remove Libraries, Update Fonts

**Files:**
- Modify: `index.html:12-16` (font links), `index.html:400-404` (script tags)

- [ ] **Step 1: Replace Google Fonts link**

In `index.html`, replace lines 12-14:

```html
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:wght@400;500;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
```

With:

```html
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Satoshi:wght@400;500;700&display=swap" rel="stylesheet" />
```

- [ ] **Step 2: Remove AOS stylesheet**

Remove this line from `index.html` (line 15):

```html
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.css" />
```

- [ ] **Step 3: Remove AOS, GSAP, and animations.js script tags**

Remove these lines from `index.html` (lines 400-404):

```html
  <script src="https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
  <script src="js/script.js?v=2.0.0" defer></script>
  <script src="js/animations.js?v=2.0.0" defer></script>
```

Replace with:

```html
  <script src="js/script.js?v=3.0.0" defer></script>
```

- [ ] **Step 4: Remove empty lang-switch label**

Remove lines 42-49 from `index.html`:

```html
        <label class="lang-switch" aria-label="Language">
          <!-- <select class="lang-select" name="lang" aria-label="Language">
            <option value="en">English</option>
            <option value="tl">Filipino</option>
            <option value="zh">Chinese</option>
          </select>
        -->
        </label>
```

- [ ] **Step 5: Remove inline styles from contact status div**

Replace `index.html` line 337-338:

```html
            <div id="contactStatus"
              style="margin-bottom: 1rem; display: none; padding: 0.75rem; border-radius: 8px; font-weight: 600;"></div>
```

With:

```html
            <div id="contactStatus" class="contact-status" hidden></div>
```

- [ ] **Step 6: Update theme toggle aria**

Replace in `index.html` line 50:

```html
        <button class="theme-toggle" type="button" aria-label="Toggle theme" aria-pressed="false">
```

With:

```html
        <button class="theme-toggle" type="button" aria-label="Switch to light theme">
```

- [ ] **Step 7: Verify in browser and commit**

Open `index.html` in browser. Page will look broken (missing fonts, wrong colors) — that's expected. The HTML structure should load without console errors about missing scripts.

```bash
git add index.html
git commit -m "chore: remove GSAP, AOS, animations.js; update fonts to Instrument Serif + Satoshi"
```

---

### Task 2: Delete animations.js

**Files:**
- Delete: `js/animations.js`

- [ ] **Step 1: Delete the file**

```bash
rm js/animations.js
```

- [ ] **Step 2: Commit**

```bash
git add js/animations.js
git commit -m "chore: delete animations.js (GSAP animations replaced by CSS)"
```

---

### Task 3: Rewrite CSS — Design Tokens

**Files:**
- Modify: `css/styles.css:1-120`

- [ ] **Step 1: Replace the entire `:root` and `[data-theme="light"]` blocks**

Replace lines 1-120 of `css/styles.css` (everything from the opening comment through the end of `[data-theme="light"]`) with:

```css
/* ============================================
   PORTFOLIO — EDITORIAL WARMTH
   ============================================ */

/* --- ROOT (LIGHT DEFAULT) --- */
:root {
  color-scheme: light dark;

  --bg: oklch(0.97 0.005 80);
  --bg-surface: oklch(0.99 0.002 80);

  --text-primary: oklch(0.20 0.01 60);
  --text-secondary: oklch(0.45 0.01 60);
  --text-tertiary: oklch(0.60 0.01 60);

  --accent: oklch(0.55 0.2 25);
  --accent-hover: oklch(0.48 0.2 25);
  --accent-subtle: oklch(0.95 0.03 25);

  --success: oklch(0.72 0.19 160);
  --danger: oklch(0.63 0.2 25);
  --warning: oklch(0.80 0.15 85);

  --border: oklch(0.90 0.005 80);
  --border-hover: oklch(0.82 0.01 80);
  --shadow-sm: 0 1px 3px oklch(0.20 0.01 60 / 0.06);
  --shadow-md: 0 4px 12px oklch(0.20 0.01 60 / 0.08);
  --shadow-lg: 0 8px 24px oklch(0.20 0.01 60 / 0.1);

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-full: 9999px;

  --font-display: 'Instrument Serif', Georgia, serif;
  --font-body: 'Satoshi', system-ui, -apple-system, sans-serif;

  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  --text-4xl: 2.25rem;
  --text-5xl: 3rem;
  --text-6xl: 3.75rem;

  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;

  --container: 1200px;
}

/* --- DARK MODE --- */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg: oklch(0.15 0.01 60);
    --bg-surface: oklch(0.19 0.01 60);

    --text-primary: oklch(0.93 0.005 80);
    --text-secondary: oklch(0.65 0.01 60);
    --text-tertiary: oklch(0.50 0.01 60);

    --accent: oklch(0.65 0.2 25);
    --accent-hover: oklch(0.72 0.2 25);
    --accent-subtle: oklch(0.22 0.05 25);

    --border: oklch(0.25 0.01 60);
    --border-hover: oklch(0.35 0.01 60);
    --shadow-sm: 0 1px 3px oklch(0.05 0.01 60 / 0.3);
    --shadow-md: 0 4px 12px oklch(0.05 0.01 60 / 0.4);
    --shadow-lg: 0 8px 24px oklch(0.05 0.01 60 / 0.5);
  }
}

[data-theme="dark"] {
  --bg: oklch(0.15 0.01 60);
  --bg-surface: oklch(0.19 0.01 60);

  --text-primary: oklch(0.93 0.005 80);
  --text-secondary: oklch(0.65 0.01 60);
  --text-tertiary: oklch(0.50 0.01 60);

  --accent: oklch(0.65 0.2 25);
  --accent-hover: oklch(0.72 0.2 25);
  --accent-subtle: oklch(0.22 0.05 25);

  --border: oklch(0.25 0.01 60);
  --border-hover: oklch(0.35 0.01 60);
  --shadow-sm: 0 1px 3px oklch(0.05 0.01 60 / 0.3);
  --shadow-md: 0 4px 12px oklch(0.05 0.01 60 / 0.4);
  --shadow-lg: 0 8px 24px oklch(0.05 0.01 60 / 0.5);
}
```

- [ ] **Step 2: Commit**

```bash
git add css/styles.css
git commit -m "feat: replace design tokens with oklch editorial warmth palette"
```

---

### Task 4: Rewrite CSS — Reset, Base, and Body

**Files:**
- Modify: `css/styles.css:122-200` (reset, base, body, and decorative pseudo-elements)

- [ ] **Step 1: Replace reset and body styles**

Replace the `/* --- RESET & BASE --- */` section through the end of the `body::after` and `@keyframes meshShift` blocks (lines 122-200 in the original — everything between the token block and `a { color: inherit; }`) with:

```css
/* --- RESET & BASE --- */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-body);
  color: var(--text-primary);
  background: var(--bg);
  line-height: 1.6;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

This removes:
- `overflow-x: hidden` on html and body (masks layout bugs)
- `body::before` (mesh gradient background)
- `body::after` (noise texture overlay)
- `@keyframes meshShift`
- `position: relative` on body

- [ ] **Step 2: Commit**

```bash
git add css/styles.css
git commit -m "feat: clean body/reset — remove mesh gradient, noise texture, overflow hacks"
```

---

### Task 5: Rewrite CSS — Header and Navigation

**Files:**
- Modify: `css/styles.css` — header section (originally ~lines 248-500)

- [ ] **Step 1: Replace the header/nav section**

Replace the entire `/* HEADER & NAVIGATION */` section (from the section comment through `.site-nav.is-open a`) with:

```css
/* ============================================
   HEADER & NAVIGATION
   ============================================ */

.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--bg);
  border-bottom: 1px solid var(--border);
  transition: border-color 0.2s ease-out, box-shadow 0.2s ease-out;
}

.site-header.scrolled {
  box-shadow: var(--shadow-md);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-6);
  padding: var(--space-4) 0;
}

/* Brand */
.brand {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  font-family: var(--font-display);
  font-size: var(--text-xl);
  letter-spacing: -0.02em;
}

.brand-mark {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  background: var(--accent);
  transition: transform 0.2s ease-out;
}

.brand:hover .brand-mark {
  transform: rotate(6deg) scale(1.05);
}

.brand-text {
  color: var(--text-primary);
}

/* Desktop Navigation */
.site-nav {
  display: none;
  gap: var(--space-1);
  align-items: center;
}

.site-nav a {
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-weight: 500;
  font-size: var(--text-sm);
  transition: color 0.15s ease-out;
}

.site-nav a:hover {
  color: var(--text-primary);
}

/* Header Actions */
.header-actions {
  display: flex;
  gap: var(--space-3);
  align-items: center;
}

/* Theme Toggle */
.theme-toggle {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  display: grid;
  place-items: center;
  transition: border-color 0.15s ease-out;
}

.theme-toggle:hover {
  border-color: var(--border-hover);
}

.theme-toggle-icon {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--text-secondary);
  mask: radial-gradient(circle at 35% 35%, transparent 40%, #000 41%);
  -webkit-mask: radial-gradient(circle at 35% 35%, transparent 40%, #000 41%);
}

/* Mobile Nav Toggle */
.nav-toggle {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  transition: border-color 0.15s ease-out;
}

.nav-toggle:hover {
  border-color: var(--border-hover);
}

.nav-toggle span {
  display: block;
  width: 18px;
  height: 2px;
  background: var(--text-primary);
  border-radius: var(--radius-full);
  transition: all 0.3s ease-out;
  transform-origin: center;
}

/* Mobile Nav Drawer */
.site-nav.is-open {
  display: flex;
  position: fixed;
  inset: 0;
  right: auto;
  width: min(320px, 85vw);
  background: var(--bg-surface);
  flex-direction: column;
  padding: var(--space-20) var(--space-6) var(--space-6);
  gap: var(--space-2);
  z-index: 1000;
  border-right: 1px solid var(--border);
  box-shadow: var(--shadow-lg);
  animation: slideIn 0.25s ease-out;
}

@keyframes slideIn {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

.site-nav.is-open a {
  font-size: var(--text-lg);
  padding: var(--space-4);
}
```

- [ ] **Step 2: Commit**

```bash
git add css/styles.css
git commit -m "feat: rewrite header/nav — solid bg, no blur, no glow, clean toggle"
```

---

### Task 6: Rewrite CSS — Buttons

**Files:**
- Modify: `css/styles.css` — buttons section (originally ~lines 504-618)

- [ ] **Step 1: Replace the buttons section**

Replace the entire `/* BUTTONS */` section with:

```css
/* ============================================
   BUTTONS
   ============================================ */

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-5);
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: var(--text-sm);
  border: 1px solid var(--border);
  background: var(--bg-surface);
  color: var(--text-primary);
  cursor: pointer;
  white-space: nowrap;
  text-decoration: none;
  transition: border-color 0.15s ease-out, transform 0.15s ease-out, box-shadow 0.15s ease-out;
}

.btn:hover {
  border-color: var(--border-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.btn:active {
  transform: translateY(0);
}

.btn:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

/* Primary Button */
.btn-primary {
  background: var(--accent);
  border-color: var(--accent);
  color: white;
  font-weight: 700;
}

.btn-primary:hover {
  background: var(--accent-hover);
  border-color: var(--accent-hover);
  box-shadow: var(--shadow-md);
}

/* Ghost Button */
.btn-ghost {
  background: transparent;
  border-color: var(--border);
  color: var(--text-secondary);
}

.btn-ghost:hover {
  border-color: var(--border-hover);
  color: var(--text-primary);
}

/* Small Button */
.btn-small {
  padding: var(--space-2) var(--space-4);
  font-size: var(--text-xs);
  border-radius: var(--radius-sm);
}

/* Button with icon */
.btn-icon {
  padding: var(--space-3);
  aspect-ratio: 1;
}
```

- [ ] **Step 2: Commit**

```bash
git add css/styles.css
git commit -m "feat: rewrite buttons — solid accent, no shine effect, no gradients"
```

---

### Task 7: Rewrite CSS — Hero Section

**Files:**
- Modify: `css/styles.css` — hero section (originally ~lines 620-900)

- [ ] **Step 1: Replace the hero section**

Replace the entire `/* HERO SECTION */` section (from the comment through `.avatar::after` and `@keyframes rotateBorder`) with:

```css
/* ============================================
   HERO SECTION
   ============================================ */

.hero {
  padding: var(--space-16) 0 var(--space-12);
}

.hero-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-8);
  align-items: start;
}

/* Hero Copy */
.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--accent);
  margin-bottom: var(--space-4);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.eyebrow::before {
  content: '';
  width: 32px;
  height: 2px;
  background: var(--accent);
  border-radius: var(--radius-full);
}

.hero-title {
  font-family: var(--font-display);
  font-size: clamp(2.8rem, 5.5vw, 4.5rem);
  line-height: 1.08;
  letter-spacing: -0.03em;
  margin-bottom: var(--space-5);
}

.hero-title-text {
  color: var(--text-primary);
}

.hero-subtitle {
  color: var(--text-secondary);
  font-size: var(--text-lg);
  line-height: 1.7;
  margin-bottom: var(--space-6);
  max-width: 60ch;
}

.hero-subtitle strong {
  color: var(--text-primary);
  font-weight: 600;
}

/* Hero CTA */
.hero-cta {
  display: flex;
  gap: var(--space-4);
  flex-wrap: wrap;
  margin-bottom: var(--space-8);
}

/* Hero Meta */
.hero-meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--space-4);
}

.hero-meta li {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  padding: var(--space-4);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--bg-surface);
  transition: border-color 0.15s ease-out;
}

.hero-meta li:hover {
  border-color: var(--border-hover);
}

.meta-k {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.meta-v {
  font-weight: 600;
  color: var(--text-primary);
  font-size: var(--text-sm);
}

/* Hero Card */
.hero-card {
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  background: var(--bg-surface);
  padding: var(--space-6);
  box-shadow: var(--shadow-md);
}

/* Profile Section */
.profile {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin-bottom: var(--space-5);
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-lg);
  display: grid;
  place-items: center;
  font-family: var(--font-display);
  font-size: var(--text-xl);
  background: var(--accent);
  color: white;
  flex-shrink: 0;
}

.profile-name {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  margin: 0;
}

.profile-role {
  margin-top: var(--space-1);
  color: var(--text-secondary);
  font-weight: 500;
  font-size: var(--text-sm);
}
```

- [ ] **Step 2: Commit**

```bash
git add css/styles.css
git commit -m "feat: rewrite hero — remove orbs, glow corners, gradient text, rotating ring"
```

---

### Task 8: Rewrite CSS — Cards, Highlights, Links, Sections

**Files:**
- Modify: `css/styles.css` — card divider through sections (originally ~lines 923-1170)

- [ ] **Step 1: Replace card components and sections**

Replace from `/* Card Divider */` through the end of `.section-subtitle` with:

```css
/* Card Divider */
.card-divider {
  height: 1px;
  background: var(--border);
  margin: var(--space-5) 0;
}

/* Highlights */
.highlights {
  margin-bottom: var(--space-5);
}

.card-title {
  font-family: var(--font-display);
  font-size: var(--text-sm);
  margin-bottom: var(--space-3);
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.pill-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.pill-list li {
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-full);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  font-weight: 500;
  font-size: var(--text-xs);
  transition: border-color 0.15s ease-out, color 0.15s ease-out;
}

.pill-list li:hover {
  border-color: var(--accent);
  color: var(--accent);
}

/* Links */
.links {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.link-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  transition: border-color 0.15s ease-out;
}

.link-row:hover {
  border-color: var(--border-hover);
}

.link-k {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.link-v {
  font-weight: 500;
  font-size: var(--text-sm);
  color: var(--text-primary);
}

/* ============================================
   SECTIONS
   ============================================ */

.section {
  padding: var(--space-16) 0;
}

.section-alt {
  background: var(--bg-surface);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.section-head {
  margin-bottom: var(--space-10);
}

.section-title {
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  letter-spacing: -0.03em;
  margin-bottom: var(--space-3);
  line-height: 1.15;
}

.section-title::after {
  content: '';
  display: block;
  width: 48px;
  height: 3px;
  background: var(--accent);
  border-radius: var(--radius-full);
  margin-top: var(--space-3);
}

.section-subtitle {
  color: var(--text-secondary);
  font-size: var(--text-lg);
  line-height: 1.7;
  max-width: 65ch;
}
```

- [ ] **Step 2: Commit**

```bash
git add css/styles.css
git commit -m "feat: rewrite cards/sections — remove glass, glow, gradient borders"
```

---

### Task 9: Rewrite CSS — Cards Grid, Timeline, Forms, Footer, Chatbot

**Files:**
- Modify: `css/styles.css` — cards grid through footer (originally ~lines 1175-1700)

- [ ] **Step 1: Replace cards, timeline, forms, footer, and chatbot**

Replace the entire `/* CARDS - REDESIGNED */` section through the end of the `/* CONTACT SECTION */` section with:

```css
/* ============================================
   CARDS
   ============================================ */

.card {
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--bg-surface);
  padding: var(--space-6);
  transition: border-color 0.2s ease-out, transform 0.2s ease-out;
}

.card:hover {
  border-color: var(--border-hover);
  transform: translateY(-2px);
}

.card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
  margin-bottom: var(--space-4);
}

.card-h {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.card-tag {
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--text-tertiary);
  white-space: nowrap;
}

.card-p {
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: var(--space-4);
}

.bullets {
  margin: 0;
  padding-left: var(--space-5);
  color: var(--text-secondary);
  line-height: 1.8;
}

.bullets li::marker {
  color: var(--accent);
}

.card-actions {
  display: flex;
  gap: var(--space-3);
  margin-top: var(--space-5);
  flex-wrap: wrap;
}

/* Grid layouts */
.grid {
  display: grid;
  gap: var(--space-6);
}

.cards {
  grid-template-columns: 1fr;
}

@media (min-width: 640px) {
  .cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 960px) {
  .cards {
    grid-template-columns: repeat(3, 1fr);
  }
}

.skills-grid {
  grid-template-columns: 1fr;
}

@media (min-width: 640px) {
  .skills-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 960px) {
  .skills-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.contact-grid {
  grid-template-columns: 1fr;
  align-items: start;
}

@media (min-width: 768px) {
  .contact-grid {
    grid-template-columns: 1.2fr 1fr;
  }
}

/* ============================================
   TIMELINE
   ============================================ */

.timeline {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  position: relative;
  padding-left: var(--space-8);
}

.timeline::before {
  content: '';
  position: absolute;
  left: 6px;
  top: 12px;
  bottom: 12px;
  width: 2px;
  background: var(--border);
  border-radius: var(--radius-full);
}

.timeline-item {
  position: relative;
}

.timeline-dot {
  position: absolute;
  left: calc(var(--space-8) * -1 + 2px);
  top: 8px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--bg);
  border: 3px solid var(--accent);
  z-index: 2;
  transition: transform 0.15s ease-out;
}

.timeline-item:hover .timeline-dot {
  transform: scale(1.2);
}

.timeline-body {
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--bg-surface);
  padding: var(--space-6);
  transition: border-color 0.15s ease-out;
}

.timeline-item:hover .timeline-body {
  border-color: var(--border-hover);
}

.timeline-top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: var(--space-4);
  flex-wrap: wrap;
  margin-bottom: var(--space-3);
}

.timeline-title {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  letter-spacing: -0.01em;
}

.timeline-date {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text-tertiary);
}

.timeline-meta {
  color: var(--text-secondary);
  font-weight: 500;
  margin-bottom: var(--space-4);
}

/* ============================================
   FORMS
   ============================================ */

.form {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.field-label {
  font-weight: 600;
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.field-input {
  width: 100%;
  height: 48px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  background: var(--bg);
  color: var(--text-primary);
  padding: 0 var(--space-4);
  font: inherit;
  transition: border-color 0.15s ease-out, box-shadow 0.15s ease-out;
}

textarea.field-input {
  height: auto;
  min-height: 120px;
  padding: var(--space-4);
  resize: vertical;
}

.field-input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-subtle);
}

.field-input::placeholder {
  color: var(--text-tertiary);
}

/* Contact status message */
.contact-status {
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: var(--text-sm);
}

.contact-status.is-success {
  background: oklch(0.95 0.05 160);
  color: oklch(0.40 0.15 160);
}

.contact-status.is-error {
  background: oklch(0.95 0.05 25);
  color: oklch(0.45 0.2 25);
}

[data-theme="dark"] .contact-status.is-success,
:root:not([data-theme="light"]) .contact-status.is-success {
  background: oklch(0.25 0.05 160);
  color: oklch(0.75 0.15 160);
}

[data-theme="dark"] .contact-status.is-error,
:root:not([data-theme="light"]) .contact-status.is-error {
  background: oklch(0.25 0.05 25);
  color: oklch(0.75 0.15 25);
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) .contact-status.is-success {
    background: oklch(0.25 0.05 160);
    color: oklch(0.75 0.15 160);
  }
  :root:not([data-theme="light"]) .contact-status.is-error {
    background: oklch(0.25 0.05 25);
    color: oklch(0.75 0.15 25);
  }
}

.fineprint {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  line-height: 1.6;
  margin-top: var(--space-3);
}

/* ============================================
   FOOTER
   ============================================ */

.site-footer {
  padding: var(--space-8) 0;
  border-top: 1px solid var(--border);
}

.footer-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-6);
  flex-wrap: wrap;
  color: var(--text-tertiary);
  font-size: var(--text-sm);
}

.footer-right {
  display: flex;
  gap: var(--space-4);
  align-items: center;
}

.footer-dot {
  color: var(--text-tertiary);
}

.footer-right a {
  color: var(--text-secondary);
  transition: color 0.15s ease-out;
}

.footer-right a:hover {
  color: var(--accent);
}

/* ============================================
   CHATBOT
   ============================================ */

.chatbot {
  position: fixed;
  right: var(--space-5);
  bottom: var(--space-5);
  z-index: 1000;
}

.chatbot-fab {
  border: none;
  border-radius: var(--radius-full);
  padding: var(--space-3) var(--space-6);
  font-weight: 700;
  font-size: var(--text-sm);
  cursor: pointer;
  background: var(--accent);
  color: white;
  box-shadow: var(--shadow-md);
  transition: background 0.15s ease-out, transform 0.15s ease-out;
}

.chatbot-fab:hover {
  background: var(--accent-hover);
  transform: translateY(-2px);
}

.chatbot-fab:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}

.chatbot-panel {
  display: flex;
  flex-direction: column;
  position: absolute;
  right: 0;
  bottom: calc(100% + var(--space-4));
  width: min(400px, calc(100vw - var(--space-8)));
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  background: var(--bg-surface);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}

.chatbot-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-4);
  padding: var(--space-5);
  border-bottom: 1px solid var(--border);
}

.chatbot-name {
  font-family: var(--font-display);
  font-size: var(--text-base);
  margin: 0;
}

.chatbot-sub {
  margin-top: var(--space-1);
  color: var(--text-tertiary);
  font-size: var(--text-xs);
  line-height: 1.5;
}

.chatbot-close {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  display: grid;
  place-items: center;
  color: var(--text-secondary);
  transition: color 0.15s ease-out;
  flex-shrink: 0;
  cursor: pointer;
  border: 1px solid transparent;
}

.chatbot-close:hover {
  color: var(--text-primary);
  border-color: var(--border);
}

.chatbot-messages {
  max-height: 380px;
  overflow-y: auto;
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.chatbot-row {
  display: flex;
}

.chatbot-row.user {
  justify-content: flex-end;
}

.chatbot-bubble {
  max-width: 85%;
  border-radius: var(--radius-lg);
  padding: var(--space-3) var(--space-4);
  line-height: 1.6;
  word-wrap: break-word;
}

.chatbot-row.assistant .chatbot-bubble {
  background: var(--bg);
  border: 1px solid var(--border);
  color: var(--text-primary);
}

.chatbot-row.user .chatbot-bubble {
  background: var(--accent);
  color: white;
  font-weight: 500;
}

.chatbot-form {
  display: flex;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-5);
  border-top: 1px solid var(--border);
}

.chatbot-input {
  flex: 1;
  height: 44px;
  border-radius: var(--radius-full);
  border: 1px solid var(--border);
  background: var(--bg);
  color: var(--text-primary);
  padding: 0 var(--space-5);
  font: inherit;
  transition: border-color 0.15s ease-out;
}

.chatbot-input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-subtle);
}

.chatbot-note {
  margin: 0;
  padding: var(--space-3) var(--space-5) var(--space-5);
  color: var(--text-tertiary);
  font-size: var(--text-xs);
  line-height: 1.5;
}

/* ============================================
   CONTACT SECTION
   ============================================ */

.contact-actions {
  margin: var(--space-5) 0;
}
```

- [ ] **Step 2: Commit**

```bash
git add css/styles.css
git commit -m "feat: rewrite cards, timeline, forms, footer, chatbot — clean surfaces"
```

---

### Task 10: Rewrite CSS — Responsive, Motion, and Utility Cleanup

**Files:**
- Modify: `css/styles.css` — responsive breakpoints through end of file (originally ~lines 1700-1879)

- [ ] **Step 1: Replace responsive, motion, and animation sections**

Replace everything from `/* RESPONSIVE BREAKPOINTS */` through the end of the file with:

```css
/* ============================================
   RESPONSIVE
   ============================================ */

@media (min-width: 860px) {
  .site-nav {
    display: flex;
  }

  .nav-toggle {
    display: none;
  }

  .hero-grid {
    grid-template-columns: 1.4fr 1fr;
    gap: var(--space-10);
    align-items: center;
  }

  .hero {
    padding: var(--space-20) 0 var(--space-16);
  }

  .hero-meta {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 640px) {
  .hero-cta {
    flex-direction: column;
  }

  .hero-cta .btn {
    width: 100%;
  }

  .hero-meta {
    grid-template-columns: 1fr;
  }
}

/* ============================================
   MOTION
   ============================================ */

/* Page load */
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-copy > * {
  animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}
.hero-copy > :nth-child(1) { animation-delay: 0.1s; }
.hero-copy > :nth-child(2) { animation-delay: 0.2s; }
.hero-copy > :nth-child(3) { animation-delay: 0.3s; }
.hero-copy > :nth-child(4) { animation-delay: 0.4s; }
.hero-copy > :nth-child(5) { animation-delay: 0.5s; }

.hero-card {
  animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
}

/* Scroll reveals */
.card,
.timeline-item,
.section-head {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.card.visible,
.timeline-item.visible,
.section-head.visible {
  opacity: 1;
  transform: translateY(0);
}

/* ============================================
   ACCESSIBILITY
   ============================================ */

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  html {
    scroll-behavior: auto;
  }

  .card,
  .timeline-item,
  .section-head {
    opacity: 1;
    transform: none;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add css/styles.css
git commit -m "feat: rewrite responsive/motion — CSS-only animations, scroll reveals"
```

---

### Task 11: Remove Orphaned CSS (Section Header Actions, Manual, Socials)

**Files:**
- Modify: `css/styles.css` — remove `.section-header-actions`, `.btn-manual-glance`, `.manual-*`, `.creator-*`, `.social-*` blocks if present

- [ ] **Step 1: Check for and remove orphaned selectors**

After completing Tasks 3-10, the final `styles.css` should NOT contain any of these selectors (they were in the original but not referenced in `index.html`):
- `.section-header-actions`
- `.btn-manual-glance`
- `.manual-icon`, `.manual-text`, `.manual-label`, `.manual-title`
- `.creator-socials`, `.creator-label`
- `.social-links-row`, `.social-link`

If they survived the section rewrites, delete them. Also ensure no references to removed tokens remain (`--bg-glass`, `--bg-card`, `--bg-elevated`, `--primary`, `--primary-light`, `--primary-dark`, `--primary-glow`, `--accent-light`, `--accent-glow`, `--tertiary`, `--tertiary-glow`, `--shadow-glow`, `--focus`, `--font-mono`).

- [ ] **Step 2: Commit if changes were made**

```bash
git add css/styles.css
git commit -m "chore: remove orphaned CSS selectors and stale token references"
```

---

### Task 12: Update script.js — Theme Logic, Intersection Observer, Cleanup

**Files:**
- Modify: `js/script.js`

- [ ] **Step 1: Update theme functions**

Replace the `getInitialTheme`, `applyTheme`, and `initThemeToggle` functions (lines 20-41) with:

```js
function getInitialTheme() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return null; // let prefers-color-scheme handle it
}

function applyTheme(theme) {
  if (theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(STORAGE_KEY, theme);
  } else {
    delete document.documentElement.dataset.theme;
    localStorage.removeItem(STORAGE_KEY);
  }
  const btn = document.querySelector(".theme-toggle");
  if (btn) {
    const isDark = theme === "dark" || (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches);
    btn.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
  }
}

function initThemeToggle() {
  const btn = document.querySelector(".theme-toggle");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const current = document.documentElement.dataset.theme;
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = current === "dark" || (!current && systemDark);
    applyTheme(isDark ? "light" : "dark");
  });
}
```

- [ ] **Step 2: Remove AOS init function**

Delete the `initAOS` function (lines 48-54) and remove `initAOS();` from the init calls at the bottom.

- [ ] **Step 3: Add Intersection Observer for scroll reveals**

Add this function before the init calls at the bottom of the file:

```js
function initScrollReveal() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(".card, .timeline-item, .section-head").forEach((el) => {
    observer.observe(el);
  });
}
```

- [ ] **Step 4: Update contact form status to use CSS classes**

In the `initContactForm` function, replace the success/error status handling. Replace:

```js
        status.textContent = result.message || "Message sent successfully!";
        status.style.backgroundColor = "rgba(45, 212, 191, 0.2)";
        status.style.color = "#2dd4bf";
        status.style.display = "block";
```

With:

```js
        status.textContent = result.message || "Message sent successfully!";
        status.className = "contact-status is-success";
        status.hidden = false;
```

And replace:

```js
      status.textContent = err.message || "Something went wrong. Please try again.";
      status.style.backgroundColor = "rgba(255, 77, 109, 0.2)";
      status.style.color = "#ff4d6d";
      status.style.display = "block";
```

With:

```js
      status.textContent = err.message || "Something went wrong. Please try again.";
      status.className = "contact-status is-error";
      status.hidden = false;
```

And replace:

```js
    status.style.display = "none";
```

With:

```js
    status.hidden = true;
```

- [ ] **Step 5: Update init calls at bottom of file**

Replace lines 393-400:

```js
applyTheme(getInitialTheme());
initI18n();
initThemeToggle();
initMobileNav();
initYear();
initAOS();
initChatbot();
initContactForm();
```

With:

```js
applyTheme(getInitialTheme());
initI18n();
initThemeToggle();
initMobileNav();
initYear();
initScrollReveal();
initChatbot();
initContactForm();
```

- [ ] **Step 6: Commit**

```bash
git add js/script.js
git commit -m "feat: update theme to system-preference default, add scroll reveals, remove AOS"
```

---

### Task 13: Update Favicon

**Files:**
- Modify: `assets/favicon.svg`

- [ ] **Step 1: Replace favicon with accent-colored version**

Replace the entire content of `assets/favicon.svg` with:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="18" fill="#c2410c"/>
  <path d="M20 41V23h11.5c4.2 0 7.2 2.5 7.2 6.2 0 2.6-1.4 4.6-3.7 5.5L40 41h-5.7l-4-6.4h-4.9V41H20zm5.4-10.5h5.4c1.7 0 2.8-.9 2.8-2.3 0-1.4-1.1-2.3-2.8-2.3h-5.4v4.6z"
        fill="#fff" opacity="0.95"/>
</svg>
```

This uses a deep vermillion (`#c2410c`, close to the oklch accent) with white letter, replacing the purple-to-cyan gradient.

- [ ] **Step 2: Commit**

```bash
git add assets/favicon.svg
git commit -m "feat: update favicon to vermillion accent color"
```

---

### Task 14: Final Verification

- [ ] **Step 1: Verify no stale references**

Search `css/styles.css` for any of these terms that should no longer exist:
- `backdrop-filter`
- `glow`
- `gradient` (except in favicon or comments)
- `--primary`
- `--bg-glass`
- `--bg-card`
- `--bg-elevated`
- `--font-mono`
- `--tertiary`

If found, remove them.

- [ ] **Step 2: Verify no stale references in script.js**

Search `js/script.js` for:
- `AOS` (should be gone)
- `gsap` or `GSAP` (should be gone)
- `animations.js` (should be gone)

- [ ] **Step 3: Open in browser and check both themes**

1. Open `index.html` in browser
2. Verify light mode renders correctly (should be the default on most systems)
3. Toggle to dark mode using the theme button
4. Verify dark mode renders correctly
5. Check mobile nav works (resize browser to < 860px, click hamburger)
6. Check contact form shows/hides
7. Check chatbot opens/closes
8. Check scroll reveal animations trigger on scroll

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: editorial warmth redesign complete — clean verification pass"
```
