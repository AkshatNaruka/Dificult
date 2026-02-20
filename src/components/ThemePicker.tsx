'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useThemeStore } from '../store/themeStore';

export function ThemePicker() {
    const themeStore = useThemeStore();
    const [isOpen, setIsOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const listRef = useRef<HTMLDivElement>(null);
    const themes = themeStore.availableThemes;

    const currentIndex = themes.findIndex(t => t.id === themeStore.currentTheme);

    const open = () => {
        setIsOpen(true);
        setFocusedIndex(currentIndex >= 0 ? currentIndex : 0);
    };

    const close = () => {
        setIsOpen(false);
        setFocusedIndex(-1);
    };

    const select = useCallback((id: string) => {
        themeStore.setTheme(id);
        close();
    }, [themeStore]);

    // Keyboard navigation
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setFocusedIndex(i => Math.min(i + 1, themes.length - 1));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setFocusedIndex(i => Math.max(i - 1, 0));
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (focusedIndex >= 0 && focusedIndex < themes.length) {
                    select(themes[focusedIndex].id);
                }
            } else if (e.key === 'Escape') {
                close();
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [isOpen, focusedIndex, themes, select]);

    // Scroll focused item into view
    useEffect(() => {
        if (!isOpen || focusedIndex < 0) return;
        const el = listRef.current?.children[focusedIndex] as HTMLElement | null;
        el?.scrollIntoView({ block: 'nearest' });
    }, [focusedIndex, isOpen]);

    const currentTheme = themes.find(t => t.id === themeStore.currentTheme);

    return (
        <>
            {/* Trigger button */}
            <button
                onClick={open}
                style={{
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-main)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '8px',
                    padding: '5px 12px',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'border-color 0.2s',
                    whiteSpace: 'nowrap',
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
                <div
                    /* Full-screen backdrop with blur */
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                        backgroundColor: 'rgba(0,0,0,0.4)',
                    }}
                    onClick={close}
                >
                    {/* Centered panel — stop propagation so click inside doesn't close */}
                    <div
                        onClick={e => e.stopPropagation()}
                        style={{
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border-glass)',
                            borderRadius: '16px',
                            padding: '12px',
                            width: '320px',
                            maxHeight: '70vh',
                            display: 'flex',
                            flexDirection: 'column',
                            boxShadow: '0 24px 48px rgba(0,0,0,0.4)',
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

                                return (
                                    <div
                                        key={theme.id}
                                        onClick={() => select(theme.id)}
                                        onMouseEnter={() => setFocusedIndex(idx)}
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
                </div>
            )}
        </>
    );
}
