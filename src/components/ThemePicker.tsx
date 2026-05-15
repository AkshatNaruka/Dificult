'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useThemeStore } from '../store/themeStore';
import { useEntitlements } from '@/hooks/useEntitlements';
import { useRouter } from 'next/navigation';

export function ThemePicker() {
    const themeStore = useThemeStore();
    const { entitlements } = useEntitlements();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const listRef = useRef<HTMLDivElement>(null);
    const themes = themeStore.availableThemes;

    const currentIndex = themes.findIndex(t => t.id === themeStore.currentTheme);
    const originalThemeRef = useRef(themeStore.currentTheme);

    const isThemeUnlocked = useCallback((themeId: string) => {
        const theme = themes.find(t => t.id === themeId);
        if (!theme?.access || theme.access.type === 'free') return true;
        if (entitlements.isPro) return true;
        if (theme.access.type === 'purchase') {
            return theme.access.entitlementKey
                ? entitlements.unlockedThemes.includes(theme.access.entitlementKey)
                : false;
        }
        return false;
    }, [themes, entitlements]);

    const open = () => {
        originalThemeRef.current = themeStore.currentTheme;
        setIsOpen(true);
        setFocusedIndex(currentIndex >= 0 ? currentIndex : 0);
    };

    const close = useCallback((revert: boolean = true) => {
        if (revert && originalThemeRef.current) {
            themeStore.setTheme(originalThemeRef.current);
        }
        setIsOpen(false);
        setFocusedIndex(-1);
    }, [themeStore]);

    const previewTheme = useCallback((index: number) => {
        setFocusedIndex(index);
        if (index >= 0 && index < themes.length) {
            const target = themes[index];
            if (isThemeUnlocked(target.id)) {
                themeStore.setTheme(target.id);
            }
        }
    }, [themes, themeStore, isThemeUnlocked]);

    const select = useCallback((id: string) => {
        if (!isThemeUnlocked(id)) {
            router.push('/store');
            return;
        }
        themeStore.setTheme(id);
        originalThemeRef.current = id;
        close(false);
    }, [themeStore, close, isThemeUnlocked, router]);

    // Keyboard navigation
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                previewTheme(Math.min(focusedIndex + 1, themes.length - 1));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                previewTheme(Math.max(focusedIndex - 1, 0));
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (focusedIndex >= 0 && focusedIndex < themes.length) {
                    select(themes[focusedIndex].id);
                }
            } else if (e.key === 'Escape') {
                close(true);
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [isOpen, focusedIndex, themes, select, previewTheme, close]);

    // Scroll focused item into view
    useEffect(() => {
        if (!isOpen || focusedIndex < 0) return;
        const el = listRef.current?.children[focusedIndex] as HTMLElement | null;
        el?.scrollIntoView({ block: 'nearest' });
    }, [focusedIndex, isOpen]);

    const currentTheme = themes.find(t => t.id === themeStore.currentTheme);

    useEffect(() => {
        if (currentTheme && !isThemeUnlocked(currentTheme.id)) {
            const fallback = themes.find(t => t.access?.type === 'free') ?? themes[0];
            if (fallback) {
                themeStore.setTheme(fallback.id);
            }
        }
    }, [currentTheme, isThemeUnlocked, themes, themeStore]);

    return (
        <div className="relative">
            {/* Trigger button */}
            <button
                onClick={open}
                className="app-pill flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 font-[inherit] text-[13px] transition-all"
                style={{
                    color: 'var(--text-main)',
                    cursor: 'pointer',
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--text-accent)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-glass)')}
            >
                {/* Color swatch */}
                <span
                    style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: currentTheme?.colors.accent ?? 'var(--text-accent)',
                        display: 'inline-block',
                        flexShrink: 0,
                    }}
                />
                <span>{currentTheme?.name ?? 'Theme'}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </button>

            {/* Modal */}
            {isOpen && (
                <>
                    {/* Invisible fixed backdrop just to catch clicks outside */}
                    <div
                        style={{ position: 'fixed', inset: 0, zIndex: 9998 }}
                        onClick={() => close(true)}
                    />

                    <div
                        className="app-surface-strong"
                        style={{
                            position: 'absolute',
                            top: 'calc(100% + 8px)',
                            right: 0,
                            zIndex: 9999,
                            borderRadius: '16px',
                            padding: '12px',
                            width: '320px',
                            maxHeight: '70vh',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        {/* Header */}
                        <div style={{
                            padding: '8px 12px 12px',
                            fontSize: '13px',
                            fontWeight: 600,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            color: 'var(--text-main)',
                            borderBottom: '1px solid var(--border-glass)',
                            marginBottom: '8px',
                        }}>
                            Choose Theme
                        </div>

                        {/* Scrollable list */}
                        <div
                            ref={listRef}
                            style={{ overflowY: 'auto', flex: 1 }}
                        >
                            {themes.map((theme, idx) => {
                                const isActive = theme.id === themeStore.currentTheme;
                                const isFocused = idx === focusedIndex;
                                const unlocked = isThemeUnlocked(theme.id);

                                return (
                                    <div
                                        key={theme.id}
                                        onClick={() => select(theme.id)}
                                        onMouseEnter={() => previewTheme(idx)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            gap: '12px',
                                            padding: '10px 12px',
                                            borderRadius: '10px',
                                            cursor: 'pointer',
                                            transition: 'background 0.15s',
                                            background: isFocused
                                                ? 'var(--border-glass)'
                                                : isActive
                                                    ? 'var(--text-accent-muted)'
                                                    : 'transparent',
                                            opacity: unlocked ? 1 : 0.6,
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                                            {/* Color palette preview */}
                                            <div style={{ display: 'flex', gap: '3px', flexShrink: 0 }}>
                                                {[theme.colors.background, theme.colors.accent, theme.colors.text].map((c, i) => (
                                                    <span key={i} style={{
                                                        width: '12px',
                                                        height: '12px',
                                                        borderRadius: '50%',
                                                        background: c,
                                                        border: '1px solid rgba(255,255,255,0.15)',
                                                        display: 'inline-block',
                                                    }} />
                                                ))}
                                            </div>

                                            <div>
                                                <div style={{
                                                    fontSize: '14px',
                                                    fontWeight: 500,
                                                    color: isActive ? 'var(--text-accent)' : 'var(--text-primary)',
                                                    lineHeight: '1.2',
                                                }}>
                                                    {theme.name}
                                                    {!unlocked && (
                                                        <span style={{
                                                            marginLeft: '8px',
                                                            fontSize: '10px',
                                                            padding: '2px 6px',
                                                            borderRadius: '999px',
                                                            background: 'rgba(139,92,246,0.15)',
                                                            color: 'var(--text-accent)',
                                                            textTransform: 'uppercase',
                                                            letterSpacing: '0.18em',
                                                        }}>
                                                            {theme.access?.type === 'purchase' ? 'Store' : 'Pro'}
                                                        </span>
                                                    )}
                                                </div>
                                                <div style={{
                                                    fontSize: '11px',
                                                    color: 'var(--text-main)',
                                                    opacity: 0.7,
                                                    marginTop: '2px',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                }}>
                                                    {theme.description}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Active checkmark */}
                                        {isActive && (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        )}
                                        {!unlocked && (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-main)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
                                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                            </svg>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Footer hint */}
                        <div style={{
                            borderTop: '1px solid var(--border-glass)',
                            marginTop: '8px',
                            paddingTop: '10px',
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '12px',
                            fontSize: '11px',
                            color: 'var(--text-main)',
                            opacity: 0.5,
                        }}>
                            <span>↑↓ navigate</span>
                            <span>↵ select</span>
                            <span>esc close</span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
