'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useThemeStore } from '../store/themeStore';
import { soundProfiles, SoundProfile, useTypingSounds } from '@/hooks/useTypingSounds';
import { useEntitlements } from '@/hooks/useEntitlements';

export function SoundPicker() {
    const themeStore = useThemeStore();
    const { entitlements } = useEntitlements();
    const { playClick } = useTypingSounds();
    const [isOpen, setIsOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const listRef = useRef<HTMLDivElement>(null);
    const currentSound = themeStore.currentSound ?? 'default';

    const currentIndex = soundProfiles.findIndex(s => s.id === currentSound);

    const isUnlocked = useCallback((id: SoundProfile) => {
        const profile = soundProfiles.find(s => s.id === id);
        if (!profile || profile.access === 'free') return true;
        return entitlements.isPro || entitlements.ownedBundles.length > 0;
    }, [entitlements]);

    const open = () => {
        setIsOpen(true);
        setFocusedIndex(currentIndex >= 0 ? currentIndex : 0);
    };

    const close = useCallback(() => {
        setIsOpen(false);
        setFocusedIndex(-1);
    }, []);

    const select = useCallback((id: SoundProfile) => {
        themeStore.setSound(id);
        // Preview the sound
        setTimeout(() => playClick(), 50);
        close();
    }, [themeStore, close, playClick]);

    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setFocusedIndex(i => Math.min(i + 1, soundProfiles.length - 1));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setFocusedIndex(i => Math.max(i - 1, 0));
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (focusedIndex >= 0) select(soundProfiles[focusedIndex].id);
            } else if (e.key === 'Escape') {
                close();
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [isOpen, focusedIndex, select, close]);

    useEffect(() => {
        if (!isOpen || focusedIndex < 0) return;
        const el = listRef.current?.children[focusedIndex] as HTMLElement | null;
        el?.scrollIntoView({ block: 'nearest' });
    }, [focusedIndex, isOpen]);

    const current = soundProfiles.find(s => s.id === currentSound) ?? soundProfiles[0];

    return (
        <div className="relative">
            <button
                onClick={open}
                className="flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 font-[inherit] text-[13px] transition-all"
                style={{
                    color: 'var(--text-main)',
                    cursor: 'pointer',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: 6,
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-main)')}
                title="Sound profile"
            >
                {/* Speaker icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}>
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
                <span>{current.name}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
                    <path d="m6 15 6-6 6 6" />
                </svg>
            </button>

            {isOpen && (
                <>
                    <div style={{ position: 'fixed', inset: 0, zIndex: 9998 }} onClick={close} />
                    <div
                        className="app-surface-strong"
                        style={{
                            position: 'absolute',
                            bottom: 'calc(100% + 8px)',
                            right: 0,
                            zIndex: 9999,
                            borderRadius: '16px',
                            padding: '12px',
                            width: '280px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '2px',
                            background: 'var(--bg-base)',
                            border: '1px solid var(--border-glass)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                        }}
                    >
                        {/* Header */}
                        <div style={{
                            padding: '4px 12px 10px',
                            fontSize: '13px',
                            fontWeight: 600,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            color: 'var(--text-main)',
                            borderBottom: '1px solid var(--border-glass)',
                            marginBottom: '6px',
                        }}>
                            Sound Profile
                        </div>

                        <div ref={listRef}>
                            {soundProfiles.map((profile, idx) => {
                                const isActive = profile.id === currentSound;
                                const isFocused = idx === focusedIndex;
                                const unlocked = isUnlocked(profile.id);

                                return (
                                    <div
                                        key={profile.id}
                                        onClick={() => unlocked ? select(profile.id) : undefined}
                                        onMouseEnter={() => setFocusedIndex(idx)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            gap: '10px',
                                            padding: '9px 12px',
                                            borderRadius: '10px',
                                            cursor: unlocked ? 'pointer' : 'default',
                                            transition: 'background 0.12s',
                                            background: isFocused
                                                ? 'var(--border-glass)'
                                                : isActive
                                                    ? 'var(--text-accent-muted)'
                                                    : 'transparent',
                                            opacity: unlocked ? 1 : 0.5,
                                        }}
                                    >
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{
                                                fontSize: '13px',
                                                fontWeight: 500,
                                                color: isActive ? 'var(--text-accent)' : 'var(--text-primary)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                            }}>
                                                {profile.name}
                                                {profile.access === 'premium' && !unlocked && (
                                                    <span style={{
                                                        fontSize: '9px',
                                                        padding: '1px 5px',
                                                        borderRadius: '999px',
                                                        background: 'rgba(139,92,246,0.15)',
                                                        color: 'var(--text-accent)',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.18em',
                                                    }}>
                                                        Pro
                                                    </span>
                                                )}
                                            </div>
                                            <div style={{ fontSize: '11px', color: 'var(--text-main)', opacity: 0.6, marginTop: '1px' }}>
                                                {profile.description}
                                            </div>
                                        </div>

                                        {isActive && (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        )}
                                        {!unlocked && (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-main)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
                                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                            </svg>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div style={{
                            borderTop: '1px solid var(--border-glass)',
                            marginTop: '6px',
                            paddingTop: '8px',
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '12px',
                            fontSize: '11px',
                            color: 'var(--text-main)',
                            opacity: 0.45,
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
