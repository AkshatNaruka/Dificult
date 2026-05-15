# Dificult UI Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unify Dificult's UI with a consistent design system, redesign high-impact pages, merge Store+Gear into Shop, and add a landing page.

**Architecture:** CSS custom properties define all design tokens in globals.css. Tailwind extends these via CSS variable references (Tailwind v4 style using `@theme`). Shared UI components live in `src/components/ui/`. The existing theme system (themeStore + data/themes.ts) remains for the typing test; the new design system tokens handle the "shell" (nav, pages, cards).

**Tech Stack:** Next.js 16, React 19, Tailwind CSS v4, Framer Motion, JetBrains Mono + Inter fonts

---

## File Structure

### New files:
- `src/app/globals.css` — rewritten with new design tokens (replaces current)
- `src/components/ui/GlassCard.tsx` — shared card component
- `src/components/ui/StatChip.tsx` — large number + label stat display
- `src/components/ui/RankBadge.tsx` — circular rank indicator
- `src/components/ui/SectionHeader.tsx` — label + heading + subtitle pattern
- `src/components/ui/Button.tsx` — CTA button variants
- `src/app/landing/LandingPage.tsx` — client component for landing
- `src/app/shop/page.tsx` — merged Store + Gear page
- `src/app/shop/ShopClient.tsx` — client component with tabs

### Modified files:
- `src/app/page.tsx` — conditional: landing (guests) vs typing test (logged in)
- `src/app/layout.tsx` — add Inter font import
- `src/components/Navbar.tsx` — update to use new tokens + restructured nav
- `src/components/Footer.tsx` — update to new tokens
- `src/app/leaderboard/page.tsx` — full redesign
- `src/app/tournaments/page.tsx` — apply design system
- `src/app/login/page.tsx` — apply design system
- `src/app/profile/page.tsx` — apply design system

### Removed routes (redirected):
- `src/app/store/` → redirect to `/shop`
- `src/app/gear/` → redirect to `/shop`

---

## Task 1: Design System — CSS Tokens & Typography

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Rewrite globals.css with new design tokens**

Replace the current `@layer base :root` block and utility classes with the new design system:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* ── Design System Tokens ── */
    --bg-base: #0a0a0b;
    --bg-surface: #131316;
    --bg-surface-elevated: #1a1a1f;
    --border-subtle: rgba(255,255,255,0.06);
    --border-hover: rgba(255,255,255,0.12);
    --text-primary: #f0f0f2;
    --text-secondary: #8b8b96;
    --text-muted: #4a4a55;
    --accent: #a78bfa;
    --accent-secondary: #34d399;
    --accent-warning: #fbbf24;
    --accent-error: #f87171;

    /* ── Legacy tokens (typing test themes still use these) ── */
    --background: #131313;
    --on-background: #e4e2e1;
    --surface: #131313;
    --on-surface: #e4e2e1;
    --surface-variant: #353535;
    --on-surface-variant: #c1c6d7;
    --surface-container-lowest: #0e0e0e;
    --surface-container-low: #1b1c1c;
    --surface-container: #1f2020;
    --surface-container-high: #2a2a2a;
    --surface-container-highest: #353535;
    --primary: #adc6ff;
    --on-primary: #002e69;
    --primary-container: #4b8eff;
    --on-primary-container: #00285c;
    --secondary: #c6c6c7;
    --on-secondary: #2f3131;
    --secondary-container: #454747;
    --on-secondary-container: #b4b5b5;
    --tertiary: #ffb595;
    --on-tertiary: #571e00;
    --tertiary-container: #ef6719;
    --on-tertiary-container: #4c1a00;
    --error: #ffb4ab;
    --on-error: #690005;
    --error-container: #93000a;
    --on-error-container: #ffdad6;
    --outline: #8b90a0;
    --outline-variant: #414755;
  }

  body {
    background-color: var(--bg-base);
    color: var(--text-primary);
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    overflow-x: hidden;
    margin: 0;
    padding: 0;
    min-height: 100%;
    isolation: isolate;
  }

  html, body {
    height: 100%;
  }

  ::selection {
    background: color-mix(in srgb, var(--accent) 30%, transparent);
    color: var(--accent);
  }

  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--bg-surface-elevated); border-radius: 10px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }
}

@layer components {
  .glass-card {
    background: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    border-radius: 8px;
    transition: all 0.2s ease;
  }
  .glass-card:hover {
    border-color: var(--border-hover);
    transform: translateY(-1px);
  }

  .section-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--accent);
  }

  .heading-display {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 700;
    letter-spacing: -0.03em;
    color: var(--text-primary);
  }

  .heading-section {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 600;
    letter-spacing: -0.02em;
    color: var(--text-primary);
  }

  .text-body {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 14px;
    line-height: 1.6;
    color: var(--text-secondary);
  }

  .text-ui {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    font-weight: 500;
  }

  .text-stat {
    font-family: 'JetBrains Mono', monospace;
    font-variant-numeric: tabular-nums;
  }

  .btn-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 12px 24px;
    background: var(--accent);
    color: #0a0a0b;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    border-radius: 6px;
    transition: all 0.15s ease;
    cursor: pointer;
    border: none;
  }
  .btn-primary:hover { opacity: 0.9; }
  .btn-primary:active { transform: scale(0.97); }

  .btn-secondary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 12px 24px;
    background: transparent;
    color: var(--text-primary);
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    border-radius: 6px;
    border: 1px solid var(--border-hover);
    transition: all 0.15s ease;
    cursor: pointer;
  }
  .btn-secondary:hover { border-color: var(--accent); color: var(--accent); }
  .btn-secondary:active { transform: scale(0.97); }
}

@layer utilities {
  .material-symbols-outlined {
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  }

  .font-mono { font-family: 'JetBrains Mono', monospace; }
  .font-sans { font-family: 'Inter', system-ui, sans-serif; }

  .caret-pulse {
    width: 2px;
    height: 2.5rem;
    background-color: var(--accent);
    display: inline-block;
    vertical-align: middle;
    box-shadow: 0 0 10px var(--accent);
    animation: pulse 1s infinite cubic-bezier(0.4, 0, 0.6, 1);
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }

  .typing-mask {
    mask-image: linear-gradient(to bottom, transparent, black 20%, black 80%, transparent);
    -webkit-mask-image: linear-gradient(to bottom, transparent, black 20%, black 80%, transparent);
  }
}
```

- [ ] **Step 2: Update layout.tsx to add Inter font**

In `src/app/layout.tsx`, replace the Google Fonts link for JetBrains Mono with one that also includes Inter (already handled in the new globals.css import). Remove the old JetBrains Mono link from `<head>` since globals.css now imports it.

- [ ] **Step 3: Verify app still renders**

Run: `npm run dev` — confirm pages load without CSS errors, typing test still works.

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx
git commit -m "feat: add design system tokens and typography classes"
```

---

## Task 2: Shared UI Components

**Files:**
- Create: `src/components/ui/GlassCard.tsx`
- Create: `src/components/ui/StatChip.tsx`
- Create: `src/components/ui/RankBadge.tsx`
- Create: `src/components/ui/SectionHeader.tsx`
- Create: `src/components/ui/Button.tsx`

- [ ] **Step 1: Create GlassCard component**

```tsx
// src/components/ui/GlassCard.tsx
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className = '', hover = true }: GlassCardProps) {
  return (
    <div className={`glass-card ${hover ? '' : '!transform-none'} ${className}`}>
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Create StatChip component**

```tsx
// src/components/ui/StatChip.tsx
interface StatChipProps {
  value: string | number;
  label: string;
  unit?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function StatChip({ value, label, unit, size = 'md' }: StatChipProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <span className={`text-stat font-bold ${sizeClasses[size]}`} style={{ color: 'var(--text-primary)' }}>
        {value}
        {unit && <span className="text-sm font-normal ml-1" style={{ color: 'var(--text-muted)' }}>{unit}</span>}
      </span>
      <span className="text-ui" style={{ color: 'var(--text-secondary)' }}>{label}</span>
    </div>
  );
}
```

- [ ] **Step 3: Create RankBadge component**

```tsx
// src/components/ui/RankBadge.tsx
interface RankBadgeProps {
  rank: number;
  size?: 'sm' | 'md' | 'lg';
}

export function RankBadge({ rank, size = 'md' }: RankBadgeProps) {
  const colors = rank === 1
    ? 'bg-[#fbbf24] text-black'
    : rank === 2
    ? 'bg-[#94a3b8] text-black'
    : rank === 3
    ? 'bg-[#d97706] text-black'
    : 'bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)]';

  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  };

  return (
    <span className={`inline-flex items-center justify-center rounded-full font-mono font-bold ${colors} ${sizeClasses[size]}`}>
      {rank}
    </span>
  );
}
```

- [ ] **Step 4: Create SectionHeader component**

```tsx
// src/components/ui/SectionHeader.tsx
interface SectionHeaderProps {
  label: string;
  heading: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

export function SectionHeader({ label, heading, subtitle, align = 'center' }: SectionHeaderProps) {
  const alignClass = align === 'center' ? 'text-center' : 'text-left';

  return (
    <div className={`${alignClass} mb-12`}>
      <span className="section-label block mb-3">{label}</span>
      <h2 className="heading-display text-3xl md:text-5xl mb-3">{heading}</h2>
      {subtitle && <p className="text-body max-w-2xl mx-auto">{subtitle}</p>}
    </div>
  );
}
```

- [ ] **Step 5: Create Button component**

```tsx
// src/components/ui/Button.tsx
import { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: ReactNode;
  fullWidth?: boolean;
}

export function Button({ variant = 'primary', children, fullWidth, className = '', ...props }: ButtonProps) {
  const base = variant === 'primary' ? 'btn-primary' : 'btn-secondary';
  const width = fullWidth ? 'w-full' : '';

  return (
    <button className={`${base} ${width} ${className}`} {...props}>
      {children}
    </button>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/
git commit -m "feat: add shared UI components (GlassCard, StatChip, RankBadge, SectionHeader, Button)"
```

---

## Task 3: Navbar & Footer Redesign

**Files:**
- Modify: `src/components/Navbar.tsx`
- Modify: `src/components/Footer.tsx`

- [ ] **Step 1: Rewrite Navbar with new design system**

```tsx
// src/components/Navbar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemePicker } from './ThemePicker';
import { SoundPicker } from './SoundPicker';

const navLinks = [
    { href: '/',            label: 'Test' },
    { href: '/leaderboard', label: 'Leaderboard' },
    { href: '/shop',        label: 'Shop' },
    { href: '/tournaments', label: 'Tournaments' },
    { href: '/multiplayer', label: 'Multiplayer' },
];

interface NavbarProps {
    user?: { email?: string } | null;
    isPro?: boolean;
    extra?: React.ReactNode;
    logoutSlot?: React.ReactNode;
}

export function Navbar({ user, isPro, extra, logoutSlot }: NavbarProps) {
    const pathname = usePathname();

    return (
        <header className="fixed top-0 left-0 right-0 z-50" style={{ background: 'rgba(10,10,11,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border-subtle)' }}>
            <nav className="flex justify-between items-center w-full px-8 h-14 max-w-[1200px] mx-auto">
                <div className="flex items-center gap-8">
                    <Link href="/" className="font-mono text-lg font-bold tracking-tighter hover:opacity-80 transition-opacity" style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>
                        dificult
                    </Link>
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map(({ href, label }) => {
                            const active = pathname === href || (href !== '/' && pathname.startsWith(href));
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className="text-ui px-3 py-1.5 rounded transition-colors"
                                    style={{
                                        color: active ? 'var(--accent)' : 'var(--text-secondary)',
                                        background: active ? 'rgba(167,139,250,0.1)' : 'transparent',
                                        textDecoration: 'none',
                                        fontWeight: active ? 700 : 500,
                                    }}
                                >
                                    {label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {extra}
                    <ThemePicker />
                    <SoundPicker />
                    {user ? (
                        <div className="flex items-center gap-2">
                            <Link
                                href="/profile"
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors"
                                style={{ color: 'var(--text-primary)', textDecoration: 'none' }}
                            >
                                <span className="material-symbols-outlined text-[18px]">person</span>
                                <span className="hidden lg:inline text-ui">{user.email?.split('@')[0]}</span>
                            </Link>
                            {logoutSlot}
                        </div>
                    ) : (
                        <Link href="/login" className="btn-primary !py-1.5 !px-4 !text-[10px]" style={{ textDecoration: 'none' }}>
                            Sign In
                        </Link>
                    )}
                </div>
            </nav>
        </header>
    );
}
```

- [ ] **Step 2: Rewrite Footer with new design system**

```tsx
// src/components/Footer.tsx
import Link from 'next/link';

export function Footer() {
    return (
        <footer style={{ borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
            <div className="flex flex-col md:flex-row justify-between items-center w-full py-6 px-8 max-w-[1200px] mx-auto gap-4">
                <span className="font-mono text-sm font-bold" style={{ color: 'var(--text-muted)' }}>dificult</span>
                <div className="flex items-center gap-6">
                    {['GitHub', 'Discord', 'Privacy', 'Terms'].map(link => (
                        <a key={link} href="#" className="text-ui transition-colors hover:text-[var(--accent)]" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                            {link}
                        </a>
                    ))}
                </div>
                <p className="text-ui" style={{ color: 'var(--text-muted)' }}>
                    © 2025 dificult
                </p>
            </div>
        </footer>
    );
}
```

- [ ] **Step 3: Verify nav and footer render correctly**

Run: `npm run dev` — check all pages show updated nav/footer.

- [ ] **Step 4: Commit**

```bash
git add src/components/Navbar.tsx src/components/Footer.tsx
git commit -m "feat: redesign Navbar and Footer with new design system"
```

---

## Task 4: Landing Page

**Files:**
- Create: `src/app/landing/LandingPage.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create LandingPage component**

```tsx
// src/app/landing/LandingPage.tsx
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatChip } from '@/components/ui/StatChip';

export default function LandingPage() {
    return (
        <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
            <Navbar />

            {/* Hero */}
            <section className="flex-1 flex flex-col items-center justify-center px-6 pt-32 pb-24 text-center relative overflow-hidden">
                {/* Background glow */}
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-20 blur-[120px] pointer-events-none" style={{ background: 'var(--accent)' }} />

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative z-10 max-w-3xl">
                    <span className="section-label block mb-4">The typing arena</span>
                    <h1 className="heading-display text-5xl md:text-7xl mb-6">
                        Type. Compete.<br />Dominate.
                    </h1>
                    <p className="text-body text-lg max-w-xl mx-auto mb-10" style={{ color: 'var(--text-secondary)' }}>
                        Master your keyboard with difficulty modes, real-time races, and tournaments. Track every keystroke. Climb the global leaderboard.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/test" className="btn-primary !px-8 !py-3.5 !text-xs" style={{ textDecoration: 'none' }}>
                            Start Typing
                        </Link>
                        <Link href="/login" className="btn-secondary !px-8 !py-3.5 !text-xs" style={{ textDecoration: 'none' }}>
                            Create Account
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* Social proof stats */}
            <section className="py-16 px-6" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <div className="max-w-[900px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
                    <StatChip value="12K+" label="Active typists" size="lg" />
                    <StatChip value="180" label="Top WPM" unit="wpm" size="lg" />
                    <StatChip value="500K+" label="Tests completed" size="lg" />
                    <StatChip value="6" label="Difficulty modes" size="lg" />
                </div>
            </section>

            {/* Features */}
            <section className="py-24 px-6" style={{ background: 'var(--bg-surface)' }}>
                <div className="max-w-[1100px] mx-auto">
                    <SectionHeader label="Why Dificult" heading="Built for speed demons" subtitle="Not just another typing test. A competitive arena with real progression." />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { icon: 'speed', title: 'Difficulty Modes', desc: 'From Normal to Nightmare. Each mode adds visual chaos, faster words, and multiplied XP rewards.' },
                            { icon: 'groups', title: 'Multiplayer Races', desc: 'Race friends or strangers in real-time. Watch their cursor advance as you type.' },
                            { icon: 'emoji_events', title: 'Tournaments', desc: 'Monthly sponsor-backed competitions with prize pools and leaderboard branding.' },
                            { icon: 'trending_up', title: 'Progress Tracking', desc: 'WPM history, accuracy trends, combo streaks, and achievement unlocks over time.' },
                            { icon: 'palette', title: 'Theme System', desc: '11 free themes. Premium themes transform the entire experience with unique aesthetics.' },
                            { icon: 'military_tech', title: 'Rank System', desc: 'Earn XP, level up, unlock achievements. Your rank is your reputation.' },
                        ].map(feature => (
                            <GlassCard key={feature.title} className="p-6">
                                <span className="material-symbols-outlined text-2xl mb-4 block" style={{ color: 'var(--accent)' }}>{feature.icon}</span>
                                <h3 className="heading-section text-base mb-2">{feature.title}</h3>
                                <p className="text-body">{feature.desc}</p>
                            </GlassCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-6 text-center">
                <h2 className="heading-display text-3xl md:text-5xl mb-4">Join the arena</h2>
                <p className="text-body mb-8">Free to play. No login required to start.</p>
                <Link href="/test" className="btn-primary !px-10 !py-4 !text-xs" style={{ textDecoration: 'none' }}>
                    Start Your First Test
                </Link>
            </section>

            <Footer />
        </div>
    );
}
```

- [ ] **Step 2: Update page.tsx for conditional routing**

```tsx
// src/app/page.tsx
import { createClient } from '@/utils/supabase/server';
import TypingTestApp from '@/components/TypingTest/TypingTestApp';
import LandingPage from '@/app/landing/LandingPage';

export default async function Home() {
  const supabase = await createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  if (!user) {
    return <LandingPage />;
  }

  return <TypingTestApp user={{ email: user.email, id: user.id }} />;
}
```

- [ ] **Step 3: Verify landing shows for guests, test shows for logged-in**

Run: `npm run dev` — open in incognito (should see landing), logged-in (should see test).

- [ ] **Step 4: Commit**

```bash
git add src/app/landing/LandingPage.tsx src/app/page.tsx
git commit -m "feat: add landing page for guest visitors"
```

---

## Task 5: Leaderboard Redesign

**Files:**
- Modify: `src/app/leaderboard/page.tsx`

- [ ] **Step 1: Rewrite leaderboard page**

```tsx
// src/app/leaderboard/page.tsx
import { createClient } from '@/utils/supabase/server';
import { getDefaultEntitlements, getEntitlementsForUser } from '@/utils/entitlements';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { RankBadge } from '@/components/ui/RankBadge';
import { GlassCard } from '@/components/ui/GlassCard';
import { AdBanner } from '@/components/AdBanner';
import Link from 'next/link';

interface ProfileJoin {
    id: string;
    email?: string;
    level?: number;
}

function timeAgo(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
}

export default async function LeaderboardPage() {
    const supabase = await createClient();
    const user = supabase ? (await supabase.auth.getUser()).data.user : null;
    const entitlements = user && supabase
        ? await getEntitlementsForUser(supabase, user.id)
        : getDefaultEntitlements();
    const leaderboardLimit = entitlements.leaderboardLimit;

    let topWpmUsers: { id: string; email: string; wpm: number; accuracy: number; level: number; date: string }[] = [];

    if (supabase) {
        const { data: topStats } = await supabase
            .from('stats')
            .select('wpm, accuracy, created_at, profiles!inner(id, email, level)')
            .order('wpm', { ascending: false })
            .limit(Math.max(leaderboardLimit * 3, 30));

        const uniqueWpmMap = new Map();
        if (topStats) {
            for (const stat of topStats) {
                const profile = (Array.isArray(stat.profiles) ? stat.profiles[0] : stat.profiles) as ProfileJoin | undefined;
                const userId = profile?.id;
                if (!userId) continue;
                if (!uniqueWpmMap.has(userId)) {
                    uniqueWpmMap.set(userId, {
                        id: userId,
                        email: profile?.email || 'Unknown',
                        level: profile?.level || 1,
                        wpm: stat.wpm,
                        accuracy: stat.accuracy,
                        date: stat.created_at || new Date().toISOString()
                    });
                }
                if (uniqueWpmMap.size >= leaderboardLimit) break;
            }
        }
        topWpmUsers = Array.from(uniqueWpmMap.values());
    }

    const top3 = topWpmUsers.slice(0, 3);
    const rest = topWpmUsers.slice(3);

    return (
        <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
            <Navbar user={user} isPro={entitlements.isPro} />

            <main className="flex-1 pt-28 pb-24 px-6 max-w-[1100px] mx-auto w-full">
                <SectionHeader label="Global Rankings" heading="Leaderboard" subtitle="Rank up. Dominate the boards. Optimize your flow." />

                {/* Top 3 Podium */}
                {top3.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                        {top3.map((p, idx) => (
                            <GlassCard key={p.id} className={`p-6 text-center ${idx === 0 ? 'md:order-2 ring-1 ring-[#fbbf24]/30' : idx === 1 ? 'md:order-1' : 'md:order-3'}`}>
                                <RankBadge rank={idx + 1} size="lg" />
                                <div className="mt-4 mb-2">
                                    <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center text-lg font-bold font-mono" style={{ background: 'var(--bg-surface-elevated)', color: 'var(--text-primary)' }}>
                                        {p.email[0].toUpperCase()}
                                    </div>
                                </div>
                                <p className="font-mono text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>{p.email.split('@')[0]}</p>
                                <p className="text-stat text-3xl font-bold mt-2" style={{ color: 'var(--accent)' }}>{p.wpm}</p>
                                <p className="text-ui mt-1" style={{ color: 'var(--text-muted)' }}>WPM</p>
                            </GlassCard>
                        ))}
                    </div>
                )}

                {/* Filter Bar */}
                <div className="glass-card p-3 mb-6 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-1">
                        {['Global', 'Friends'].map(tab => (
                            <button key={tab} className="text-ui px-4 py-1.5 rounded transition-colors" style={{ background: tab === 'Global' ? 'rgba(167,139,250,0.1)' : 'transparent', color: tab === 'Global' ? 'var(--accent)' : 'var(--text-secondary)' }}>
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-4">
                        <select className="bg-transparent text-ui py-1 px-2 rounded" style={{ color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
                            <option value="30">30s</option>
                            <option value="60">60s</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="glass-card overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                <th className="text-ui px-6 py-4" style={{ color: 'var(--text-muted)' }}>Rank</th>
                                <th className="text-ui px-6 py-4" style={{ color: 'var(--text-muted)' }}>Typist</th>
                                <th className="text-ui px-6 py-4 text-right" style={{ color: 'var(--text-muted)' }}>WPM</th>
                                <th className="text-ui px-6 py-4 text-right hidden md:table-cell" style={{ color: 'var(--text-muted)' }}>Accuracy</th>
                                <th className="text-ui px-6 py-4 text-right hidden md:table-cell" style={{ color: 'var(--text-muted)' }}>When</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rest.length === 0 && top3.length === 0 && (
                                <tr><td colSpan={5} className="px-6 py-12 text-center text-body">No stats recorded yet.</td></tr>
                            )}
                            {rest.map((p, idx) => {
                                const rank = idx + 4;
                                const isMe = user?.id === p.id;
                                return (
                                    <tr key={p.id} className="transition-colors" style={{ borderBottom: '1px solid var(--border-subtle)', background: isMe ? 'rgba(167,139,250,0.05)' : undefined }}>
                                        <td className="px-6 py-4"><RankBadge rank={rank} size="sm" /></td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono" style={{ background: 'var(--bg-surface-elevated)', color: 'var(--text-secondary)' }}>
                                                    {p.email[0].toUpperCase()}
                                                </div>
                                                <span className="font-mono text-sm" style={{ color: isMe ? 'var(--accent)' : 'var(--text-primary)' }}>
                                                    {p.email.split('@')[0]}
                                                    {isMe && <span className="ml-2 text-ui px-1.5 py-0.5 rounded" style={{ background: 'rgba(167,139,250,0.15)', color: 'var(--accent)', fontSize: '9px' }}>YOU</span>}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right text-stat text-lg font-bold" style={{ color: 'var(--accent)' }}>{p.wpm}</td>
                                        <td className="px-6 py-4 text-right text-stat text-sm hidden md:table-cell" style={{ color: 'var(--text-secondary)' }}>{p.accuracy}%</td>
                                        <td className="px-6 py-4 text-right text-ui hidden md:table-cell" style={{ color: 'var(--text-muted)' }}>{timeAgo(p.date)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pro Barrier */}
                {!entitlements.isPro && topWpmUsers.length > 0 && (
                    <div className="glass-card p-12 text-center mt-6">
                        <span className="text-ui block mb-4" style={{ color: 'var(--accent-warning)' }}>PRO FEATURE</span>
                        <h3 className="heading-section text-xl mb-2">Unlock Full Rankings</h3>
                        <p className="text-body mb-6">See top 50 rankings, advanced stats, and personal progress tracking.</p>
                        <Link href="/pricing" className="btn-primary !px-8" style={{ textDecoration: 'none' }}>Upgrade to Pro</Link>
                    </div>
                )}

                {entitlements.adsEnabled && (
                    <div className="flex justify-center mt-12">
                        <AdBanner slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM || ''} format="horizontal" className="w-full max-w-[728px]" style={{ minHeight: '90px' }} />
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
```

- [ ] **Step 2: Verify leaderboard renders**

Run: `npm run dev` — navigate to `/leaderboard`.

- [ ] **Step 3: Commit**

```bash
git add src/app/leaderboard/page.tsx
git commit -m "feat: redesign leaderboard with podium and new design system"
```

---

## Task 6: Shop Page (Store + Gear Merge)

**Files:**
- Create: `src/app/shop/page.tsx`
- Create: `src/app/shop/ShopClient.tsx`
- Modify: `src/app/store/page.tsx` (redirect)
- Modify: `src/app/gear/page.tsx` (redirect)

- [ ] **Step 1: Create ShopClient with tabs**

```tsx
// src/app/shop/ShopClient.tsx
'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { themes } from '@/data/themes';
import { gearItems } from '@/data/gear';
import { pricingPlans } from '@/data/commerce';
import { useCheckout } from '@/hooks/useCheckout';
import { useEntitlements } from '@/hooks/useEntitlements';

type Tab = 'themes' | 'sounds' | 'gear';

export function ShopClient() {
    const [activeTab, setActiveTab] = useState<Tab>('themes');
    const { entitlements } = useEntitlements();
    const { startCheckout, isLoading } = useCheckout();

    const premiumPlan = pricingPlans.find(p => p.id === 'pro_monthly');
    const ownsPremium = premiumPlan && entitlements.ownedBundles.includes(premiumPlan.id);

    return (
        <>
            <SectionHeader label="Shop" heading="Customize your setup" subtitle="Themes, sounds, and gear for the competitive typist." />

            {/* Tab bar */}
            <div className="flex items-center gap-1 mb-8 glass-card p-1.5 w-fit mx-auto">
                {(['themes', 'sounds', 'gear'] as Tab[]).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className="text-ui px-5 py-2 rounded transition-colors capitalize"
                        style={{
                            background: activeTab === tab ? 'rgba(167,139,250,0.1)' : 'transparent',
                            color: activeTab === tab ? 'var(--accent)' : 'var(--text-secondary)',
                            fontWeight: activeTab === tab ? 700 : 500,
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Themes Tab */}
            {activeTab === 'themes' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {themes.map(theme => (
                        <GlassCard key={theme.id} className="p-4 overflow-hidden">
                            {/* Mini preview */}
                            <div className="rounded mb-3 p-3 h-20 flex items-center justify-center" style={{ background: theme.colors.background, border: `1px solid ${theme.colors.border}` }}>
                                <span className="font-mono text-xs" style={{ color: theme.colors.text }}>
                                    the quick brown fox
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-mono text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{theme.name}</p>
                                    <p className="text-ui" style={{ color: 'var(--text-muted)', fontSize: '10px' }}>{theme.description}</p>
                                </div>
                                {theme.access.type === 'free' ? (
                                    <span className="text-ui" style={{ color: 'var(--accent-secondary)', fontSize: '9px' }}>FREE</span>
                                ) : (
                                    <span className="material-symbols-outlined text-sm" style={{ color: 'var(--accent-warning)' }}>lock</span>
                                )}
                            </div>
                        </GlassCard>
                    ))}
                </div>
            )}

            {/* Sounds Tab */}
            {activeTab === 'sounds' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {['Mechanical', 'Soft Touch', 'Typewriter', 'Bubble Pop'].map(sound => (
                        <GlassCard key={sound} className="p-5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined" style={{ color: 'var(--accent)' }}>graphic_eq</span>
                                <span className="font-mono text-sm" style={{ color: 'var(--text-primary)' }}>{sound}</span>
                            </div>
                            <button className="text-ui px-3 py-1 rounded" style={{ border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                                Preview
                            </button>
                        </GlassCard>
                    ))}
                </div>
            )}

            {/* Gear Tab */}
            {activeTab === 'gear' && (
                <div className="space-y-4">
                    <p className="text-ui mb-6" style={{ color: 'var(--text-muted)' }}>
                        Affiliate links — we may earn a commission.
                    </p>
                    {gearItems.map(item => (
                        <GlassCard key={item.id} className="p-6 flex flex-col md:flex-row gap-6 items-center">
                            <div className="w-full md:w-48 h-36 rounded overflow-hidden flex-shrink-0" style={{ background: 'var(--bg-surface-elevated)' }}>
                                {item.image ? (
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="material-symbols-outlined text-3xl" style={{ color: 'var(--text-muted)' }}>keyboard</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="heading-section text-base">{item.name}</h3>
                                        <p className="text-ui" style={{ color: 'var(--accent)' }}>{item.brand} · {item.category}</p>
                                    </div>
                                    <span className="text-stat text-sm" style={{ color: 'var(--text-secondary)' }}>{item.priceRange}</span>
                                </div>
                                <p className="text-body mb-3">{item.description}</p>
                                <a href={item.url} target="_blank" rel="noreferrer" className="text-ui inline-flex items-center gap-1 transition-colors" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
                                    View deal <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </a>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            )}

            {/* Pricing CTA */}
            {!ownsPremium && (
                <div className="glass-card p-8 mt-12 text-center">
                    <h3 className="heading-section text-xl mb-2">Unlock everything</h3>
                    <p className="text-body mb-6">Premium themes, sounds, and XP boosts in one purchase.</p>
                    <button
                        disabled={isLoading}
                        onClick={() => premiumPlan?.priceId && startCheckout({ productId: premiumPlan.priceId, metadata: { entitlement_type: 'bundle', entitlement_key: premiumPlan.id } })}
                        className="btn-primary"
                    >
                        {isLoading ? 'Loading...' : 'Buy Premium — $7'}
                    </button>
                </div>
            )}
        </>
    );
}
```

- [ ] **Step 2: Create shop page.tsx**

```tsx
// src/app/shop/page.tsx
import { createClient } from '@/utils/supabase/server';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ShopClient } from './ShopClient';
import { AdBanner } from '@/components/AdBanner';
import { getDefaultEntitlements, getEntitlementsForUser } from '@/utils/entitlements';

export default async function ShopPage() {
    const supabase = await createClient();
    const user = supabase ? (await supabase.auth.getUser()).data.user : null;
    const entitlements = user && supabase
        ? await getEntitlementsForUser(supabase, user.id)
        : getDefaultEntitlements();

    return (
        <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
            <Navbar user={user} isPro={entitlements.isPro} />

            <main className="flex-1 pt-28 pb-24 px-6 max-w-[1100px] mx-auto w-full">
                {entitlements.adsEnabled && (
                    <div className="flex justify-center mb-12">
                        <AdBanner slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM || ''} format="horizontal" className="w-full" style={{ minHeight: '90px' }} />
                    </div>
                )}
                <ShopClient />
            </main>

            <Footer />
        </div>
    );
}
```

- [ ] **Step 3: Add redirects from old routes**

```tsx
// src/app/store/page.tsx
import { redirect } from 'next/navigation';
export default function StorePage() { redirect('/shop'); }
```

```tsx
// src/app/gear/page.tsx
import { redirect } from 'next/navigation';
export default function GearPage() { redirect('/shop'); }
```

- [ ] **Step 4: Verify shop page works**

Run: `npm run dev` — navigate to `/shop`, `/store` (should redirect), `/gear` (should redirect).

- [ ] **Step 5: Commit**

```bash
git add src/app/shop/ src/app/store/page.tsx src/app/gear/page.tsx
git commit -m "feat: merge Store + Gear into unified Shop page with tabs"
```

---

## Task 7: Apply Design System to Remaining Pages

**Files:**
- Modify: `src/app/tournaments/page.tsx`
- Modify: `src/app/login/page.tsx`
- Modify: `src/app/profile/page.tsx`

- [ ] **Step 1: Update tournaments page**

Apply the design system wrapper pattern: `min-h-screen flex flex-col` with `background: var(--bg-base)`, use `<SectionHeader>`, use `<GlassCard>` for tournament cards, use new typography classes. Keep the existing data/logic, just swap the styling classes.

Key changes:
- Outer div: `style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}`
- Replace section header with `<SectionHeader label="Tournaments" heading="Branded speed events" subtitle="..." />`
- Tournament cards: wrap in `<GlassCard className="p-8">`
- Button: use `btn-primary w-full` class
- Text classes: use `heading-section`, `text-body`, `text-ui`, `section-label`

- [ ] **Step 2: Update login page**

Key changes:
- Outer div: `style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}`
- Heading: `heading-display text-4xl`
- Inputs: keep bottom-border style but use `border-color: var(--border-subtle)` and `focus: var(--accent)`
- Buttons: Google button uses `btn-secondary w-full`, Login button uses `btn-primary w-full`

- [ ] **Step 3: Update profile page**

Key changes:
- Replace inline `var(--bg-primary)` etc with new tokens
- Stats cards: use `<GlassCard>` + `<StatChip>`
- Header card: use `glass-card` class
- Text: replace `var(--text-main)` → `var(--text-secondary)`, `var(--text-accent)` → `var(--accent)`

- [ ] **Step 4: Verify all pages**

Run: `npm run dev` — check `/tournaments`, `/login`, `/profile`.

- [ ] **Step 5: Commit**

```bash
git add src/app/tournaments/page.tsx src/app/login/page.tsx src/app/profile/page.tsx
git commit -m "feat: apply design system to tournaments, login, and profile pages"
```

---

## Task 8: Delete StoreClient (now unused)

**Files:**
- Delete: `src/app/store/StoreClient.tsx`

- [ ] **Step 1: Remove the old StoreClient**

```bash
rm src/app/store/StoreClient.tsx
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "chore: remove unused StoreClient after Shop merge"
```

---

## Task 9: Final Verification

- [ ] **Step 1: Run type check**

```bash
npx next build
```

Expected: Build succeeds with no type errors.

- [ ] **Step 2: Manual QA checklist**

Run `npm run dev` and verify:
- Landing page shows for guests at `/`
- Typing test shows for logged-in users at `/`
- Nav links work: Test, Leaderboard, Shop, Tournaments, Multiplayer
- `/store` and `/gear` redirect to `/shop`
- Shop tabs switch between Themes, Sounds, Gear
- Leaderboard shows podium + table
- All pages use consistent dark background and typography
- Typing test still functions (type, stats, combo)

- [ ] **Step 3: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix: address QA issues from design system rollout"
```
