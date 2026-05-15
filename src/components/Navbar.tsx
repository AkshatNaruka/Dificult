'use client';

import React from 'react';
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

    return (
        <header
            className="fixed top-0 left-0 right-0 z-50 border-b transition-colors duration-300"
            style={{
                borderBottomColor: 'var(--border-glass)',
                background: 'rgba(19, 19, 19, 0.7)',
                backdropFilter: 'blur(12px)',
            }}
        >
            <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">

                {/* Logo */}
                <Link
                    href="/"
                    className="shrink-0 select-none text-xl font-bold tracking-tight font-typing transition-opacity decoration-transparent hover:opacity-80"
                    style={{ color: 'var(--text-primary)' }}
                >
                    difi<span style={{ color: 'var(--text-accent)' }}>cult</span>
                </Link>

                {/* ── Nav links ── */}
                <nav className="app-pill flex flex-1 flex-wrap items-center justify-center gap-1 px-2 py-1">
                    {navLinks.map(({ href, label }) => {
                        const active = pathname === href;
                        return (
                            <Link
                                key={href}
                                href={href}
                                className="font-typing whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm transition-all decoration-transparent"
                                style={{
                                    color: active ? 'var(--text-accent)' : 'var(--text-main)',
                                    fontWeight: active ? 600 : 400,
                                    background: active ? 'color-mix(in srgb, var(--text-accent) 12%, transparent)' : 'transparent',
                                    opacity: active ? 1 : 0.72,
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
                <div className="ml-auto flex shrink-0 items-center gap-2">
                    {extra}

                    {!isPro && (
                        <Link
                            href="/pricing"
                            className="inline-flex items-center rounded-full px-3.5 py-1.5 font-typing text-xs font-bold transition-all decoration-transparent hover:opacity-90 active:scale-[0.97]"
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
                                className="app-pill flex items-center gap-1.5 px-3 py-1.5 font-typing text-sm transition-all decoration-transparent hover:opacity-100"
                                style={{ color: 'var(--text-main)', opacity: 0.8 }}
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
                            className="inline-flex items-center rounded px-4 py-1.5 font-typing text-sm font-bold transition-all decoration-transparent hover:opacity-90 active:scale-[0.97]"
                            style={{
                                background: 'transparent',
                                border: '1px solid var(--text-accent)',
                                color: 'var(--text-accent)',
                            }}
                        >
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
