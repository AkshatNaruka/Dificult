# Dificult UI Redesign — Design Spec

## Overview

Redesign Dificult's UI to achieve consistency across all pages, add personality to secondary pages, and establish a theme architecture that supports premium theme monetization.

**Approach:** Design System + Hero Pages. Build a lightweight design system, then redesign the 3 highest-impact pages (Landing, Leaderboard, Store+Gear merge). Other pages get the design system applied. Premium themes (Cyberpunk, Editorial) come last.

## Identity

- **Typing test surface:** Zen, distraction-free, Monkeytype-level focus
- **Surrounding pages:** Competitive gaming arena energy
- **Overall quality bar:** Premium minimalist craft

## Design System

### Color Tokens (Default — "Clean Dark Premium")

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-base` | `#0a0a0b` | Page background |
| `--bg-surface` | `#131316` | Cards, panels |
| `--bg-surface-elevated` | `#1a1a1f` | Hover states, modals |
| `--border-subtle` | `rgba(255,255,255,0.06)` | Card borders |
| `--border-hover` | `rgba(255,255,255,0.12)` | Interactive borders |
| `--text-primary` | `#f0f0f2` | Headings |
| `--text-secondary` | `#8b8b96` | Body, labels |
| `--text-muted` | `#4a4a55` | Hints, disabled |
| `--accent` | `#a78bfa` | Primary accent (violet) |
| `--accent-secondary` | `#34d399` | Success, combos |
| `--accent-warning` | `#fbbf24` | Streaks, fire |
| `--accent-error` | `#f87171` | Errors, mistyped |

### Typography Scale

- **Display:** JetBrains Mono, 48-64px, -0.03em tracking, bold
- **Headline:** JetBrains Mono, 24-32px, -0.02em, semibold
- **Body:** Inter (system sans fallback), 14-16px, normal weight
- **UI Label:** JetBrains Mono, 10-12px, 0.1em tracking, uppercase, medium
- **Code/Stats:** JetBrains Mono, 14-24px, tabular-nums

### Spacing Scale

4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128px

### Shared Components

1. **Glass Card** — `bg-surface`, 1px `border-subtle`, 8px radius, backdrop-blur on hover, subtle scale(1.01) on hover
2. **Stat Chip** — Large monospace number + small uppercase label below
3. **Rank Badge** — Circular, color-coded (gold #fbbf24, silver #94a3b8, bronze #d97706, default surface)
4. **Section Header** — Pattern: uppercase accent label → display heading → muted subtitle
5. **CTA Button** — Solid accent fill, uppercase label, 0.1em tracking, active:scale(0.97)
6. **Nav** — Fixed top, logo left, links center, actions right. Auto-hides during typing test focus.
7. **Footer** — Minimal: links row + copyright. Same auto-hide behavior on test page.

### Theme Architecture

Themes swap CSS custom properties at `:root`. Three tiers:

1. **Default (free):** Clean dark premium (tokens above)
2. **Cyberpunk (premium):** Neon glow borders (`box-shadow: 0 0 20px`), scanline overlay texture via pseudo-element, accent shifts to cyan `#22d3ee` / magenta `#f472b6`, animated gradient borders
3. **Editorial (premium):** Larger typography scale (+20%), warmer base tones (`#0f0d0a`), serif display font (Playfair Display), bold accent color blocks, more whitespace

Premium themes affect ALL pages (nav, cards, buttons, etc.), not just the typing surface.

## Page Designs

### 1. Landing Page (NEW — replaces going straight to typing test)

**Purpose:** Convert visitors. Show what Dificult is, why it's different, drive to test or sign up.

**Structure:**
- Hero: Large display text "Type. Compete. Dominate." + animated typing demo preview + CTA "Start Typing" / "Create Account"
- Social proof row: "X typists this week" + "Top WPM: Y" + "Z tournaments played"
- Features grid (3 cols): Difficulty modes, Multiplayer races, Tournaments
- Testimonial/stat callout: "Average improvement: +23 WPM in 30 days"
- Final CTA: "Join the arena" with sign-up form

**The typing test moves to `/test` or stays at `/` but the landing shows for first-time/logged-out visitors only.** Logged-in users go straight to the test.

### 2. Leaderboard (REDESIGN)

**Current issues:** Generic table, weak visual hierarchy, pro barrier feels like a wall.

**New design:**
- Top 3 podium visual: Large cards for #1, #2, #3 with avatar, WPM in huge display font, rank badge
- Below: Clean table with subtle row hover, alternating opacity, your row highlighted with accent border-left
- Filters: Pill-style toggle group (Global / Friends / Country), time/difficulty dropdowns
- Pro section: Instead of a wall, show blurred rows with a floating "Unlock full rankings" overlay — feels premium, not punishing
- Live activity indicator: "42 typists online now" with subtle pulse dot

### 3. Store + Gear (MERGE into "Shop")

**Current issues:** Two separate pages that feel thin. Store has themes/sounds, Gear has affiliate products.

**New design — single `/shop` page with tabs:**
- **Tab: Themes** — Grid of theme preview cards. Each card shows a mini typing-test mockup in that theme's colors. Locked themes have a subtle lock icon + "Pro" badge.
- **Tab: Sounds** — Audio waveform visualizers per sound pack. Play preview on hover. Same lock pattern.
- **Tab: Gear** — Editorial-style product cards. Large product images, brand + price + "View Deal" CTA. Affiliate disclosure at top.

Unified card component across all tabs. Filter/sort bar at top.

### 4. Tournaments (REFRESH)

Keep current structure but apply design system:
- Section header pattern (label + display heading + subtitle)
- Tournament cards get glass-card treatment with sponsor logo more prominent
- Status badges: "Live Now" (green pulse), "Upcoming" (accent), "Completed" (muted)
- Prize pool displayed as large stat chip
- "Join Waitlist" button uses CTA component

### 5. Login (REFRESH)

Apply design system tokens. Current layout is fine — just needs:
- Consistent spacing (use spacing scale)
- Button styles from CTA component
- Input styles: bottom-border only, accent on focus (keep current approach, just unify tokens)

### 6. Profile / Stats Dashboard (NEW section on existing profile page)

Add a stats dashboard section:
- WPM trend chart (already have chart.js)
- Best scores by mode/difficulty
- Achievement grid
- Daily streak calendar heatmap (GitHub-style)

### 7. Multiplayer (REFRESH)

Apply design system. Add:
- "Find Match" as prominent CTA
- Active races list with player count badges
- Your recent race results

## Navigation Restructure

**Before:** Test | Leaderboard | Store | Tournaments | Gear (5 equal items)

**After:** Test | Leaderboard | Shop | Tournaments | Multiplayer (5 items, consolidated)

- Store + Gear merged into "Shop"
- Multiplayer promoted to nav (was hidden)
- Profile accessible via avatar icon (right side)
- Pricing accessible from Shop (pro badges) and profile, not nav

## Page Structure

| Route | Content | Auth |
|-------|---------|------|
| `/` | Landing (guests) / Typing test (logged in) | mixed |
| `/test` | Direct link to typing test | none |
| `/leaderboard` | Rankings | none |
| `/shop` | Themes, sounds, gear (tabs) | none |
| `/tournaments` | Tournament feed | none |
| `/multiplayer` | Race lobby | optional |
| `/profile` | Stats dashboard + settings | required |
| `/login` | Auth | none |

## Implementation Priority

1. Design system (CSS tokens, typography classes, shared components)
2. Landing page
3. Leaderboard redesign
4. Shop merge (Store + Gear → /shop)
5. Apply design system to remaining pages (Tournaments, Login, Profile, Multiplayer)
6. Premium themes (Cyberpunk, Editorial)

## Technical Notes

- All design tokens go in `globals.css` as CSS custom properties
- Tailwind config extended with token references (e.g., `bg-base`, `text-accent`)
- Shared components in `src/components/ui/` (GlassCard, StatChip, RankBadge, SectionHeader, Button)
- Theme switching via class on `<html>` element + CSS variable overrides
- Landing page uses conditional rendering based on auth state (already have this pattern)
- `/shop` uses client-side tabs (no route change per tab)
