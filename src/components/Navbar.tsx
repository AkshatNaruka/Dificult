'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
    { href: '/',            label: 'test',         icon: 'keyboard' },
    { href: '/leaderboard', label: 'leaderboard',  icon: 'leaderboard' },
    { href: '/shop',        label: 'shop',         icon: 'storefront' },
    { href: '/tournaments', label: 'tournaments',  icon: 'emoji_events' },
    { href: '/multiplayer', label: 'multiplayer',  icon: 'group' },
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
    const [isMobile, setIsMobile] = useState(false);
    const mobileMenuRef = useRef<HTMLDivElement>(null);

    // JS-based responsive detection (avoids Tailwind vs inline style conflicts)
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => { setMobileOpen(false); }, [pathname]);

    useEffect(() => {
        if (!mobileOpen) return;
        const handler = (e: MouseEvent) => {
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
                setMobileOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [mobileOpen]);

    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    const username = user?.email?.split('@')[0];

    return (
        <>
            <header
                style={{
                    position: 'relative',
                    zIndex: 50,
                    padding: '12px clamp(20px, 4vw, 48px)',
                }}
            >
                <nav
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                        maxWidth: 1100,
                        margin: '0 auto',
                    }}
                >
                    {/* ── Left: Logo ── */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Link
                            href="/"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                textDecoration: 'none',
                            }}
                        >
                            <div style={{
                                width: 24,
                                height: 24,
                                borderRadius: 6,
                                background: 'var(--accent)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                            }}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--bg-base)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="4" width="20" height="16" rx="2" />
                                    <line x1="6" y1="8" x2="6" y2="8" />
                                    <line x1="10" y1="8" x2="10" y2="8" />
                                    <line x1="14" y1="8" x2="14" y2="8" />
                                    <line x1="18" y1="8" x2="18" y2="8" />
                                    <line x1="8" y1="16" x2="16" y2="16" />
                                </svg>
                            </div>
                            <span style={{
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: 16,
                                fontWeight: 700,
                                letterSpacing: '-0.02em',
                                color: 'var(--text-primary)',
                            }}>
                                dificult
                            </span>
                            {isPro && (
                                <span style={{
                                    padding: '1px 5px',
                                    fontFamily: "'JetBrains Mono', monospace",
                                    fontSize: 8,
                                    fontWeight: 700,
                                    letterSpacing: '0.12em',
                                    textTransform: 'uppercase',
                                    borderRadius: 3,
                                    background: 'rgba(251,191,36,0.12)',
                                    color: 'var(--accent-warning)',
                                    border: '1px solid rgba(251,191,36,0.15)',
                                }}>
                                    Pro
                                </span>
                            )}
                        </Link>
                    </div>

                    {/* ── Center: Nav Links (desktop only) ── */}
                    {!isMobile && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                        }}>
                            {navLinks.map(({ href, label, icon }) => {
                                const active = pathname === href || (href !== '/' && pathname.startsWith(href));
                                return (
                                    <NavLink key={href} href={href} label={label} icon={icon} active={active} />
                                );
                            })}
                        </div>
                    )}

                    {/* ── Right: User + Hamburger ── */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {extra}

                        {/* User area — desktop only */}
                        {!isMobile && user && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Link
                                    href="/profile"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8,
                                        padding: '4px 8px',
                                        borderRadius: 8,
                                        textDecoration: 'none',
                                    }}
                                    title="Profile"
                                >
                                    <div style={{
                                        width: 28,
                                        height: 28,
                                        borderRadius: 7,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontFamily: "'JetBrains Mono', monospace",
                                        fontSize: 11,
                                        fontWeight: 700,
                                        textTransform: 'uppercase',
                                        background: 'var(--accent)',
                                        color: 'var(--bg-base)',
                                        flexShrink: 0,
                                    }}>
                                        {username?.[0] ?? '?'}
                                    </div>
                                    <span style={{
                                        fontFamily: "'JetBrains Mono', monospace",
                                        fontSize: 11,
                                        fontWeight: 500,
                                        color: 'var(--text-secondary)',
                                    }}>
                                        {username}
                                    </span>
                                </Link>
                                {logoutSlot}
                            </div>
                        )}

                        {/* Sign in — desktop only, no user */}
                        {!isMobile && !user && (
                            <Link href="/login" style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 6,
                                padding: '7px 16px',
                                background: 'var(--accent)',
                                color: 'var(--bg-base)',
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: 10,
                                fontWeight: 700,
                                letterSpacing: '0.08em',
                                textTransform: 'uppercase',
                                textDecoration: 'none',
                                borderRadius: 7,
                                whiteSpace: 'nowrap',
                            }}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                                    <polyline points="10 17 15 12 10 7" />
                                    <line x1="15" y1="12" x2="3" y2="12" />
                                </svg>
                                Sign In
                            </Link>
                        )}

                        {/* Hamburger — mobile only */}
                        {isMobile && (
                            <button
                                onClick={() => setMobileOpen(!mobileOpen)}
                                aria-label="Toggle menu"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 4,
                                    width: 34,
                                    height: 34,
                                    borderRadius: 8,
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    background: 'transparent',
                                    cursor: 'pointer',
                                    padding: 0,
                                }}
                            >
                                <span style={{
                                    display: 'block', width: 16, height: 1.5, borderRadius: 2,
                                    background: 'var(--text-secondary)',
                                    transition: 'all 0.3s ease',
                                    transform: mobileOpen ? 'rotate(45deg) translate(3.5px, 3.5px)' : 'none',
                                }} />
                                <span style={{
                                    display: 'block', width: 16, height: 1.5, borderRadius: 2,
                                    background: 'var(--text-secondary)',
                                    transition: 'all 0.3s ease',
                                    opacity: mobileOpen ? 0 : 1,
                                }} />
                                <span style={{
                                    display: 'block', width: 16, height: 1.5, borderRadius: 2,
                                    background: 'var(--text-secondary)',
                                    transition: 'all 0.3s ease',
                                    transform: mobileOpen ? 'rotate(-45deg) translate(3.5px, -3.5px)' : 'none',
                                }} />
                            </button>
                        )}
                    </div>
                </nav>
            </header>

            {/* ─── Mobile Menu Overlay ─── */}
            <div
                onClick={() => setMobileOpen(false)}
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 55,
                    background: 'rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(4px)',
                    WebkitBackdropFilter: 'blur(4px)',
                    opacity: mobileOpen ? 1 : 0,
                    pointerEvents: mobileOpen ? 'auto' : 'none',
                    transition: 'opacity 0.3s ease',
                }}
            />

            {/* ─── Mobile Menu Panel ─── */}
            <div
                ref={mobileMenuRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 60,
                    width: 280,
                    maxWidth: '85vw',
                    background: 'rgba(13,13,15,0.98)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    borderLeft: '1px solid rgba(255,255,255,0.06)',
                    transform: mobileOpen ? 'translateX(0)' : 'translateX(100%)',
                    transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {/* Mobile header */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 24px',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                }}>
                    <span style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 14,
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                    }}>
                        Menu
                    </span>
                    <button
                        onClick={() => setMobileOpen(false)}
                        aria-label="Close menu"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 34,
                            height: 34,
                            borderRadius: 8,
                            border: '1px solid rgba(255,255,255,0.06)',
                            background: 'transparent',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                        }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Mobile nav links */}
                <div style={{ display: 'flex', flexDirection: 'column', padding: '8px 0' }}>
                    {navLinks.map(({ href, label, icon }) => {
                        const active = pathname === href || (href !== '/' && pathname.startsWith(href));
                        return (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setMobileOpen(false)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                    padding: '14px 24px',
                                    fontFamily: "'JetBrains Mono', monospace",
                                    fontSize: 13,
                                    fontWeight: 500,
                                    letterSpacing: '0.04em',
                                    textDecoration: 'none',
                                    color: active ? 'var(--accent)' : 'var(--text-secondary)',
                                    background: active ? 'rgba(167,139,250,0.06)' : 'transparent',
                                    borderBottom: '1px solid rgba(255,255,255,0.03)',
                                    borderLeft: active ? '2px solid var(--accent)' : '2px solid transparent',
                                    transition: 'all 0.15s ease',
                                }}
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: 20, opacity: 0.7 }}>{icon}</span>
                                {label}
                            </Link>
                        );
                    })}
                </div>

                {/* Mobile user area */}
                <div style={{
                    marginTop: 'auto',
                    padding: '20px 24px',
                    borderTop: '1px solid rgba(255,255,255,0.04)',
                }}>
                    {user ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <Link
                                href="/profile"
                                style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}
                                onClick={() => setMobileOpen(false)}
                            >
                                <div style={{
                                    width: 32, height: 32, borderRadius: 8,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700,
                                    textTransform: 'uppercase',
                                    background: 'var(--accent)',
                                    color: 'var(--bg-base)',
                                }}>
                                    {username?.[0] ?? '?'}
                                </div>
                                <div>
                                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{username}</div>
                                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--text-muted)' }}>View Profile</div>
                                </div>
                            </Link>
                            {logoutSlot}
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            onClick={() => setMobileOpen(false)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 6,
                                padding: '12px 20px',
                                background: 'var(--accent)',
                                color: 'var(--bg-base)',
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: 11,
                                fontWeight: 700,
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                textDecoration: 'none',
                                borderRadius: 8,
                                width: '100%',
                            }}
                        >
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
        </>
    );
}

/* ── Desktop Nav Link with icon + hover underline (Monkeytype-inspired) ── */
function NavLink({ href, label, active }: { href: string; label: string; icon: string; active: boolean }) {
    const [hovered, setHovered] = useState(false);

    return (
        <Link
            href={href}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                padding: '6px 12px',
                borderRadius: 6,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                fontWeight: active ? 600 : 400,
                letterSpacing: '0.03em',
                textDecoration: 'none',
                color: active ? 'var(--accent)' : hovered ? 'var(--text-primary)' : 'var(--text-muted)',
                transition: 'color 0.2s ease',
                whiteSpace: 'nowrap',
            }}
        >
            {label}
            {/* Active indicator dot */}
            {active && (
                <span style={{
                    position: 'absolute',
                    bottom: -2,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 3,
                    height: 3,
                    borderRadius: '50%',
                    background: 'var(--accent)',
                    boxShadow: '0 0 6px var(--accent)',
                }} />
            )}
        </Link>
    );
}
