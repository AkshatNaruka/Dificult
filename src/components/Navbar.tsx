'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemePicker } from './ThemePicker';
import { SoundPicker } from './SoundPicker';

const navLinks = [
    { href: '/store',       label: 'Store' },
    { href: '/gear',        label: 'Gear' },
    { href: '/leaderboard', label: 'Leaderboard' },
    { href: '/tournaments', label: 'Tournaments' },
];

interface NavbarProps {
    user?: { email?: string } | null;
    isPro?: boolean;
    extra?: React.ReactNode;
    logoutSlot?: React.ReactNode;
}

export function Navbar({ user, isPro, extra, logoutSlot }: NavbarProps) {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header
            style={{
                borderBottom: '1px solid var(--border-glass)',
                background: 'var(--bg-primary)',
                position: 'relative',
                zIndex: 50,
            }}
        >
            <div className="w-full flex items-center gap-3 px-6 py-3">

                {/* Logo */}
                <Link
                    href="/"
                    className="text-xl font-bold tracking-tight select-none font-typing hover:opacity-80 transition-opacity decoration-transparent shrink-0"
                    style={{ color: 'var(--text-primary)' }}
                >
                    difi<span style={{ color: 'var(--text-accent)' }}>cult</span>
                </Link>

                {/* ── Desktop nav links — always visible, centred ── */}
                <nav className="hidden sm:flex items-center gap-0.5 flex-1 justify-center">
                    {navLinks.map(({ href, label }) => {
                        const active = pathname === href;
                        return (
                            <Link
                                key={href}
                                href={href}
                                className="font-typing text-sm px-3 py-1.5 rounded-lg transition-all decoration-transparent whitespace-nowrap"
                                style={{
                                    color: active ? 'var(--text-accent)' : 'var(--text-main)',
                                    fontWeight: active ? 600 : 400,
                                    background: active
                                        ? 'color-mix(in srgb, var(--text-accent) 10%, transparent)'
                                        : 'transparent',
                                    opacity: active ? 1 : 0.65,
                                }}
                                onMouseEnter={e => {
                                    if (!active) (e.currentTarget as HTMLElement).style.opacity = '1';
                                }}
                                onMouseLeave={e => {
                                    if (!active) (e.currentTarget as HTMLElement).style.opacity = '0.65';
                                }}
                            >
                                {label}
                            </Link>
                        );
                    })}
                </nav>

                {/* ── Right controls ── */}
                <div className="flex items-center gap-2 ml-auto shrink-0">
                    {extra}

                    {!isPro && (
                        <Link
                            href="/pricing"
                            className="hidden sm:inline-flex font-typing text-xs font-bold px-3 py-1.5 rounded-lg transition-all hover:opacity-90 active:scale-[0.97] decoration-transparent items-center"
                            style={{ background: 'var(--text-accent)', color: 'var(--bg-primary)' }}
                        >
                            Upgrade
                        </Link>
                    )}

                    <ThemePicker />
                    <SoundPicker />

                    {user ? (
                        <>
                            <Link
                                href="/profile"
                                className="font-typing text-sm flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-all decoration-transparent hover:opacity-100"
                                style={{ color: 'var(--text-main)', opacity: 0.7 }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                                <span className="hidden lg:inline">{user.email?.split('@')[0]}</span>
                            </Link>
                            {logoutSlot}
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className="hidden sm:inline-flex font-typing text-sm font-bold px-4 py-1.5 rounded-lg transition-all hover:opacity-90 active:scale-[0.97] decoration-transparent items-center"
                            style={{ background: 'var(--text-accent)', color: 'var(--bg-primary)' }}
                        >
                            Sign In
                        </Link>
                    )}

                    {/* Hamburger — mobile only */}
                    <button
                        className="sm:hidden flex items-center justify-center w-8 h-8 rounded-lg"
                        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)' }}
                        onClick={() => setMobileOpen(o => !o)}
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <line x1="3" y1="12" x2="21" y2="12" />
                                <line x1="3" y1="18" x2="21" y2="18" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile dropdown */}
            {mobileOpen && (
                <div
                    className="sm:hidden flex flex-col px-4 pb-4 gap-1 border-t"
                    style={{ borderColor: 'var(--border-glass)', background: 'var(--bg-primary)' }}
                >
                    {navLinks.map(({ href, label }) => {
                        const active = pathname === href;
                        return (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setMobileOpen(false)}
                                className="font-typing text-sm px-3 py-2.5 rounded-lg transition-all decoration-transparent"
                                style={{
                                    color: active ? 'var(--text-accent)' : 'var(--text-main)',
                                    fontWeight: active ? 600 : 400,
                                    background: active
                                        ? 'color-mix(in srgb, var(--text-accent) 10%, transparent)'
                                        : 'transparent',
                                }}
                            >
                                {label}
                            </Link>
                        );
                    })}
                    {!isPro && (
                        <Link
                            href="/pricing"
                            onClick={() => setMobileOpen(false)}
                            className="font-typing text-sm font-bold px-3 py-2.5 rounded-lg mt-1 text-center decoration-transparent"
                            style={{ background: 'var(--text-accent)', color: 'var(--bg-primary)' }}
                        >
                            Upgrade
                        </Link>
                    )}
                    {!user && (
                        <Link
                            href="/login"
                            onClick={() => setMobileOpen(false)}
                            className="font-typing text-sm font-bold px-3 py-2.5 rounded-lg text-center decoration-transparent"
                            style={{ border: '1px solid var(--border-glass)', color: 'var(--text-main)' }}
                        >
                            Sign In
                        </Link>
                    )}
                </div>
            )}
        </header>
    );
}
