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
