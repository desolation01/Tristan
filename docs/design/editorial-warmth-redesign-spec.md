# Editorial Warmth Redesign

**Date**: 2026-04-08
**Status**: Approved
**Scope**: Visual redesign of portfolio CSS + JS animation removal. HTML structure unchanged.

## Problem

The current portfolio exhibits 6+ AI-generated aesthetic tells (glassmorphism, glow effects, gradient text, dark-mode-with-neon-accents, animated mesh backgrounds, card grids). This undermines credibility with hiring managers — the target audience. Audit score: 12/20, with Anti-Patterns scoring 1/4.

## Solution

Strip all decorative effects and rebuild the visual layer around typography, spacing, and a single accent color. The design reference is Stripe/Linear quality — polished, precise, expressive through restraint.

## Color System

Use `oklch()` for perceptually uniform colors. Two complete palettes, selected via `prefers-color-scheme` with manual toggle override.

### Light Mode

| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `oklch(0.97 0.005 80)` | Page background (warm sand tint) |
| `--bg-surface` | `oklch(0.99 0.002 80)` | Cards, elevated surfaces |
| `--text-primary` | `oklch(0.20 0.01 60)` | Headings, body text |
| `--text-secondary` | `oklch(0.45 0.01 60)` | Descriptions, meta |
| `--text-tertiary` | `oklch(0.60 0.01 60)` | Labels, fineprint |
| `--accent` | `oklch(0.55 0.2 25)` | Links, CTA, active states (deep vermillion) |
| `--accent-hover` | `oklch(0.48 0.2 25)` | Accent hover state |
| `--accent-subtle` | `oklch(0.95 0.03 25)` | Accent backgrounds |
| `--border` | `oklch(0.90 0.005 80)` | Card/section borders |
| `--border-hover` | `oklch(0.82 0.01 80)` | Interactive border hover |

### Dark Mode

| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `oklch(0.15 0.01 60)` | Page background (warm charcoal) |
| `--bg-surface` | `oklch(0.19 0.01 60)` | Cards, elevated surfaces |
| `--text-primary` | `oklch(0.93 0.005 80)` | Headings, body text |
| `--text-secondary` | `oklch(0.65 0.01 60)` | Descriptions, meta |
| `--text-tertiary` | `oklch(0.50 0.01 60)` | Labels, fineprint |
| `--accent` | `oklch(0.65 0.2 25)` | Links, CTA (brighter for contrast) |
| `--accent-hover` | `oklch(0.72 0.2 25)` | Accent hover state |
| `--accent-subtle` | `oklch(0.22 0.05 25)` | Accent backgrounds |
| `--border` | `oklch(0.25 0.01 60)` | Card/section borders |
| `--border-hover` | `oklch(0.35 0.01 60)` | Interactive border hover |

### Removed Tokens

All of these are deleted:
- `--bg-elevated`, `--bg-card`, `--bg-glass` (replaced by `--bg-surface`)
- `--primary`, `--primary-light`, `--primary-dark`, `--primary-glow` (replaced by `--accent`)
- `--accent-light`, `--accent-glow` (old accent system)
- `--tertiary`, `--tertiary-glow`
- `--shadow-glow`
- `--focus` (use `--accent` directly)

### Retained Tokens (updated values)

- `--success`, `--danger`, `--warning` — keep for form status, update to oklch
- `--shadow-sm`, `--shadow-md`, `--shadow-lg` — keep, remove glow, use subtle warm-tinted shadows
- All `--radius-*` tokens — keep as-is
- All `--space-*` tokens — keep as-is
- `--container` — keep as-is

## Typography

### Font Stack

| Role | Font | Source | Weights |
|------|------|--------|---------|
| Display | Instrument Serif | Google Fonts | 400 (regular italic available) |
| Body | Satoshi | Google Fonts (via fontsource or CDN) | 400, 500, 700 |

- Remove Space Grotesk, DM Sans, JetBrains Mono
- Remove the duplicate `@import` in styles.css (keep only the `<link>` in HTML)
- `--font-mono` token: removed. Tags and dates use `--font-body` at smaller size/lighter weight.

### Type Scale

Keep the existing `clamp()` approach. Updated hero title size: `clamp(2.8rem, 5.5vw, 4.5rem)`.

## Surfaces

### Cards

```css
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
```

No `backdrop-filter`. No `::before` gradient border. No glow `box-shadow` on hover. No `scale` on hover.

### Header

```css
.site-header {
  background: var(--bg);
  border-bottom: 1px solid var(--border);
  transition: border-color 0.2s ease-out, box-shadow 0.2s ease-out;
}
.site-header.scrolled {
  box-shadow: var(--shadow-sm);
}
```

No `backdrop-filter`. Solid background.

### Hero

- Remove `body::before` (mesh gradient), `body::after` (noise texture)
- Remove `.hero::before`, `.hero::after` (floating orbs)
- Remove `.hero-card::before`, `.hero-card::after` (glow corners)
- Remove animated gradient on `.hero-title span` — use solid `var(--text-primary)`
- Remove `.avatar::after` (rotating ring)
- `.eyebrow::after` shimmer animation: removed

### Section Alternate

```css
.section-alt {
  background: var(--bg-surface);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}
```

### Gradient Underline on Section Titles

Replace gradient with solid accent:
```css
.section-title::after {
  background: var(--accent);
}
```

## Motion

### Remove

- GSAP library (`gsap.min.js`)
- ScrollTrigger library (`ScrollTrigger.min.js`)
- AOS library (CSS + JS) — already disabled
- `js/animations.js` — entire file deleted
- All `@keyframes` not used by the new system: `meshShift`, `orbFloat`, `gradientShift`, `rotateBorder`, `shimmer`, `pulse`, `blink`, `float`
- All `.animate-*` and `.stagger-*` utility classes

### Add

**Page load sequence** (CSS only):
```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.hero-copy > * {
  animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}
.hero-copy > :nth-child(1) { animation-delay: 0.1s; }
.hero-copy > :nth-child(2) { animation-delay: 0.2s; }
.hero-copy > :nth-child(3) { animation-delay: 0.3s; }
.hero-copy > :nth-child(4) { animation-delay: 0.4s; }
.hero-copy > :nth-child(5) { animation-delay: 0.5s; }
.hero-card { animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both; }
```

**Scroll reveals** (JS Intersection Observer):
```js
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.card, .timeline-item, .section-head').forEach(el => observer.observe(el));
```

```css
.card, .timeline-item, .section-head {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.card.visible, .timeline-item.visible, .section-head.visible {
  opacity: 1;
  transform: translateY(0);
}
```

**Reduced motion**: All animations disabled (existing media query preserved).

## Theme Toggle

Update `getInitialTheme()` in `script.js`:
- Default: respect `prefers-color-scheme`
- Manual toggle: stored in `localStorage`, overrides system preference
- Remove `aria-pressed` pattern (doesn't apply to theme toggle semantics), use `aria-label` that reflects current state

## HTML Changes

Minimal:
- Remove AOS `<link>` and `<script>` tags from `index.html`
- Remove GSAP `<script>` tags (2 files) from `index.html`
- Remove `<script src="js/animations.js">` from `index.html`
- Update Google Fonts `<link>` to load Instrument Serif + Satoshi instead of current fonts
- Remove duplicate `@import` from `styles.css`

## Files Changed

| File | Action |
|------|--------|
| `css/styles.css` | Rewrite: new tokens, remove all decorative pseudo-elements, new surface styles, new motion system |
| `js/script.js` | Update: theme logic, add Intersection Observer, remove AOS init |
| `js/animations.js` | Delete |
| `index.html` | Update: remove GSAP/AOS script tags, update font link |
| `assets/favicon.svg` | Update: use accent color instead of purple-cyan gradient |

## Success Criteria

- Anti-Patterns audit score: 3+ (up from 1)
- Performance audit score: 3+ (up from 2) — ~60KB less JS
- No `backdrop-filter`, no `glow`, no gradient text in CSS
- Both light and dark modes visually polished
- All existing functionality preserved (theme toggle, mobile nav, contact form, chatbot)
- `prefers-reduced-motion` respected in both CSS and JS
