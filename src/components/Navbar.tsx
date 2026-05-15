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

                {/* ── Nav links — always visible and allowed to wrap ── */}
                <nav className="flex flex-wrap items-center gap-1 flex-1 justify-center">
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
                            className="inline-flex font-typing text-xs font-bold px-3 py-1.5 rounded-lg transition-all hover:opacity-90 active:scale-[0.97] decoration-transparent items-center"
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
                            className="inline-flex font-typing text-sm font-bold px-4 py-1.5 rounded-lg transition-all hover:opacity-90 active:scale-[0.97] decoration-transparent items-center"
                            style={{ background: 'var(--text-accent)', color: 'var(--bg-primary)' }}
                        >
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
