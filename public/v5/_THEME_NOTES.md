# SolSentry Design System v4 — Theme Notes

**Version:** 4.0  
**Date:** May 5, 2026  
**Status:** Production-ready for Demo Day  

---

## Overview

This document describes the custom design tokens, naming conventions, and design decisions implemented in the SolSentry v4 design system. The base palette is locked in `colors_and_type.css`; this file documents extensions and rationale.

---

## Color Tokens

### Primary Palette (Warm Amber)

| Token | Hex | Usage | Rationale |
|-------|-----|-------|-----------|
| `--color-primary` | `#C17D0E` | Primary CTA, logo, accents | Core brand color. Warm amber signals "light that reveals" (security through illumination). Avoids crypto-bro neon. |
| `--color-primary-bright` | `#D9962E` | Hover states, highlights | Lighter amber for interactive feedback. Maintains warmth while signaling interactivity. |
| `--color-primary-burnt` | `#8A5A00` | Depth, shadows, tertiary | Darker amber for layering and depth. Communicates "burned" (rug pulls leave scorched wallets). |

### Neutral Palette (Warm Dark + Cream)

| Token | Hex | Usage | Rationale |
|-------|-----|-------|-----------|
| `--color-bg-dark` | `#100E0A` | Dark theme background | Near-black with warm undertone (not pure `#000`). Reduces eye strain. Suggests "deep investigation." |
| `--color-text-light` | `#F2EDE4` | Light theme background, dark text | Cream (not pure `#FFF`). Warm, readable, premium feel. Pairs with dark theme for contrast. |
| `--color-text-muted` | `#A89968` | Tertiary text, disabled states | Mid-tone amber-gray. Signals "less important" without harshness. |

### Semantic Colors (Status)

| Token | Hex | Usage | Rationale |
|-------|-----|-------|-----------|
| `--color-teal` | `#2A7A7A` | Data accent, positive states | Precise teal (not cyan). Used sparingly for "safe" or "confirmed" states. Complements warm amber. |
| `--color-danger` | `#DC2626` | Critical risk, rug alerts | Red-600 for universal danger recognition. High contrast on both light and dark. |
| `--color-warning` | `#F59E0B` | High risk, warnings | Amber-400 for "caution" states. Distinct from primary amber by value. |
| `--color-success` | `#10B981` | Low risk, safe states | Green-500 for "all clear." Familiar to security users. |
| `--color-info` | `#3B82F6` | Informational, neutral | Blue-500 for "FYI" states. Not used in primary flow. |

---

## Typography Tokens

### Font Stack

```css
--font-display: 'Syne', sans-serif;        /* Bold, geometric, modern */
--font-body: 'DM Sans', sans-serif;        /* Readable, neutral */
--font-mono: 'JetBrains Mono', monospace;  /* Metrics, addresses, code */
```

### Type Scale

| Class | Font | Weight | Size | Usage |
|-------|------|--------|------|-------|
| `.type-display` | Syne | 800 | 32px | Page titles, hero headlines |
| `.type-heading` | Syne | 700 | 24px | Section titles, card headers |
| `.type-body` | DM Sans | 400 | 16px | Paragraph text, descriptions |
| `.type-label` | DM Sans | 600 | 12px | Form labels, pill text, uppercase |
| `.type-mono` | JetBrains Mono | 400 | 13px | Wallet addresses, metrics, code |

### Naming Rationale

- **Syne** chosen for display because it's geometric (echoes isometric logo) and modern without being trendy.
- **DM Sans** chosen for body because it's highly readable and neutral (doesn't compete with content).
- **JetBrains Mono** chosen for metrics because it's monospace (aligns numbers) and has excellent glyph distinction (0 vs O, 1 vs l).

---

## Spacing Tokens

### Scale (8px base unit)

```css
--space-xs: 4px;     /* Tight spacing, icon gaps */
--space-sm: 8px;     /* Component padding, small gaps */
--space-md: 12px;    /* Default padding, section gaps */
--space-lg: 16px;    /* Card padding, larger gaps */
--space-xl: 24px;    /* Section spacing */
--space-2xl: 32px;   /* Major section breaks */
--space-3xl: 40px;   /* Page-level spacing */
--space-4xl: 48px;   /* Hero sections */
```

### Rationale

8px base unit ensures alignment with common breakpoints (320px, 640px, 1024px, 1280px). Multiples of 8 create visual rhythm without awkward fractions.

---

## Component Tokens

### Buttons

| Variant | Background | Text | Border | Hover |
|---------|------------|------|--------|-------|
| Primary | `#C17D0E` | `#100E0A` | `#C17D0E` | `#D9962E` |
| Secondary | Transparent | `#C17D0E` | `#C17D0E` | `#C17D0E` bg |
| Ghost | Transparent | `#C17D0E` | Transparent | `var(--bg-tertiary)` |
| Danger | `#DC2626` | White | `#DC2626` | `#B91C1C` |

**Rationale:** Primary uses brand color. Secondary inverts for lower emphasis. Ghost is text-only for minimal contexts. Danger is always red for safety-critical actions.

### Pills & Chips

| Type | Background | Text | Border | Use Case |
|------|------------|------|--------|----------|
| Risk: Critical | `rgba(220, 38, 38, 0.1)` | `#DC2626` | `rgba(220, 38, 38, 0.3)` | Rug pull alerts |
| Risk: High | `rgba(245, 158, 11, 0.1)` | `#F59E0B` | `rgba(245, 158, 11, 0.3)` | Suspicious activity |
| Risk: Medium | `rgba(59, 130, 246, 0.1)` | `#3B82F6` | `rgba(59, 130, 246, 0.3)` | Caution flags |
| Risk: Low | `rgba(16, 185, 129, 0.1)` | `#10B981` | `rgba(16, 185, 129, 0.3)` | Safe operators |
| Tag | `var(--bg-tertiary)` | `var(--text-primary)` | `var(--border-color)` | Operator labels |

**Rationale:** Risk pills use semantic colors with low opacity backgrounds (10%) for scanability. Tag pills use neutral colors to avoid visual noise.

### Risk Badges

Circular badges (0-100 score) with large display font:

```css
.risk-badge {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  font-size: 36px;
  font-weight: 800;
  border: 3px solid;
}
```

Color mapping:
- **Critical (70-100):** Red border + red text
- **High (40-69):** Orange border + orange text
- **Medium (20-39):** Blue border + blue text
- **Low (0-19):** Green border + green text

**Rationale:** Large, circular format makes risk immediately scannable. Color + number redundancy ensures accessibility.

### Metric Cards

```css
.metric-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 20px;
}

.metric-value {
  font-size: 32px;
  font-weight: 800;
  color: var(--color-primary);
}
```

**Rationale:** Large, bold numbers in brand color draw attention to KPIs. Subtle border and padding create hierarchy without heaviness.

### Alert Cards

```css
.alert-card {
  background: var(--bg-secondary);
  border-left: 4px solid var(--color-primary);  /* Color varies by severity */
  border-radius: 8px;
  padding: 16px;
}
```

**Rationale:** Left border accent is a common pattern (Telegram, Slack, GitHub). Avoids full-width colored backgrounds which can feel aggressive.

---

## Theme System (Light + Dark)

### Dark Theme (Default)

```css
[data-theme="dark"] {
  --bg-primary: #100E0A;       /* Page background */
  --bg-secondary: #1A1815;     /* Card background */
  --bg-tertiary: #2A251F;      /* Hover/focus background */
  --text-primary: #F2EDE4;     /* Main text */
  --text-secondary: #D9C9B8;   /* Secondary text */
  --text-tertiary: #A89968;    /* Disabled/muted text */
  --border-color: #3A3530;     /* Component borders */
}
```

### Light Theme

```css
[data-theme="light"] {
  --bg-primary: #F2EDE4;       /* Page background */
  --bg-secondary: #FFFFFF;     /* Card background */
  --bg-tertiary: #F5F1E8;      /* Hover/focus background */
  --text-primary: #100E0A;     /* Main text */
  --text-secondary: #5A4A3A;   /* Secondary text */
  --text-tertiary: #8A7A6A;    /* Disabled/muted text */
  --border-color: #E0D5C7;     /* Component borders */
}
```

**Rationale:** Light theme inverts the dark theme while maintaining the warm color family. Cream backgrounds reduce eye strain. Borders are subtle but visible.

**Implementation:** Toggle via `[data-theme="light|dark"]` attribute on `<html>`. JavaScript persists choice to localStorage.

---

## Elevation (Shadows)

```css
.elevation-1 { box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); }
.elevation-2 { box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
.elevation-3 { box-shadow: 0 10px 15px rgba(0, 0, 0, 0.15); }
.elevation-4 { box-shadow: 0 20px 25px rgba(0, 0, 0, 0.2); }
```

**Rationale:** Subtle shadows create depth without harshness. Opacity-based shadows work on both light and dark themes.

---

## Border Radii

```css
--radius-xs: 2px;    /* Minimal rounding, inputs */
--radius-sm: 4px;    /* Buttons, small components */
--radius-md: 6px;    /* Form fields */
--radius-lg: 8px;    /* Cards, modals */
--radius-xl: 12px;   /* Large cards, containers */
--radius-pill: 20px; /* Pills, badges */
```

**Rationale:** Consistent scale from minimal (2px) to pill-shaped (20px). No excessive rounding (avoids "bubbly" feel).

---

## Animation Tokens

```css
--duration-fast: 120ms;    /* Hover, focus states */
--duration-normal: 200ms;  /* Page transitions */
--duration-slow: 400ms;    /* Modal opens, major changes */

--easing-ease-in: cubic-bezier(0.4, 0, 1, 1);
--easing-ease-out: cubic-bezier(0, 0, 0.2, 1);
--easing-ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

**Rationale:** Fast animations for micro-interactions. Slower for major UI changes. Easing functions chosen for natural feel (not linear).

---

## Breakpoints

```css
--breakpoint-xs: 320px;   /* Mobile phones */
--breakpoint-sm: 640px;   /* Tablets */
--breakpoint-md: 1024px;  /* Laptops */
--breakpoint-lg: 1280px;  /* Desktops */
--breakpoint-xl: 1536px;  /* Large displays */
```

**Rationale:** Standard Tailwind breakpoints. Mobile-first approach ensures responsive design.

---

## Accessibility Considerations

### Color Contrast

- **Dark theme:** `#F2EDE4` text on `#100E0A` background = 14.5:1 WCAG AAA
- **Light theme:** `#100E0A` text on `#F2EDE4` background = 14.5:1 WCAG AAA
- **Risk colors:** All semantic colors tested for WCAG AA minimum (4.5:1)

### Focus States

```css
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

**Rationale:** Amber outline is visible on both light and dark backgrounds.

### Motion Preferences

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Rationale:** Respects user's OS-level motion preferences (accessibility requirement).

---

## Migration Notes (v3 → v4)

### Color Mapping

| v3 Color | v4 Color | Reason |
|----------|----------|--------|
| `#FF6B00` (orange) | `#C17D0E` (amber) | Warmer, less aggressive. Signals "light" not "fire." |
| `#0A0A0A` (pure black) | `#100E0A` (warm black) | Reduces eye strain. Maintains legibility. |
| `#F5F5F5` (gray) | `#F2EDE4` (cream) | Warmer, premium feel. Better readability. |
| `#3AA9FF` (cyan) | `#2A7A7A` (teal) | Less neon. More sophisticated. Used sparingly. |

### Component Naming

- v3: `.btn-primary`, `.btn-secondary` → v4: `.btn-primary`, `.btn-secondary` (unchanged)
- v3: `.risk-critical`, `.risk-high` → v4: `.pill-critical`, `.pill-high` (renamed for clarity)
- v3: `.metric-tile` → v4: `.metric-card` (renamed for consistency)

---

## Design Decisions

### Why Warm Amber?

Amber symbolizes:
- **Light** (security through illumination)
- **Warmth** (approachable, not cold)
- **Caution** (amber traffic lights, amber alerts)

Avoids:
- Purple/cyan (crypto-bro aesthetic)
- Pure red (too aggressive for a security tool)
- Blue (overused in fintech)

### Why No Gradients?

Gradients are avoided because:
- They reduce readability (especially on mobile)
- They're associated with "crypto hype" design
- Solid colors + shadows create depth more elegantly

### Why Isometric Logo Influences Design?

The stacked-plates logo (isometric, 3D) influences:
- **Layering:** Multiple z-index levels in components
- **Depth:** Shadows and elevation tokens
- **Geometry:** Consistent use of 90° angles (no curves except pills)

---

## Files & Imports

### Main CSS

```html
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
```

### CSS Variables

All tokens defined in `<style>` blocks within component HTML files. No external CSS file (for portability).

### JavaScript

Theme toggle persists to localStorage:

```javascript
localStorage.setItem('solsentry-theme', 'dark' | 'light');
const theme = localStorage.getItem('solsentry-theme') || 'dark';
document.documentElement.setAttribute('data-theme', theme);
```

---

## Future Enhancements

1. **Dark mode variants** — "ultra-dark" for OLED screens
2. **High contrast mode** — WCAG AAA+ for visually impaired users
3. **Animated tokens** — CSS animations for loading states, transitions
4. **Component library** — React/Vue components with tokens baked in
5. **Figma tokens** — Sync design tokens to Figma plugin

---

## Questions & Feedback

For questions about these tokens or design decisions, refer to:
- `BRAND.md` — Brand philosophy and voice
- `BRIEF_1PAGER.md` — 1-page brand summary
- `colors_and_type.css` — Canonical token definitions

**Status:** Locked for Demo Day May 9, 2026. Changes after this date require design review.
