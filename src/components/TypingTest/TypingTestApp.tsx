'use client';

import React, { useEffect, useRef } from 'react';
import { useTypingEngine } from '../../hooks/useTypingEngine';
import { useThemeStore } from '../../store/themeStore';
import { WordDisplay } from './WordDisplay';
import { StatsScreen } from './StatsScreen';
import { ThemePicker } from '../ThemePicker';
import { motion, AnimatePresence } from 'framer-motion';

export default function TypingTestApp() {
    const engine = useTypingEngine();
    const themeStore = useThemeStore();
    const hiddenInputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const focusInput = () => {
        hiddenInputRef.current?.focus();
    };

    // Apply theme on mount and whenever the active theme changes
    useEffect(() => {
        themeStore.applyTheme();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [themeStore.currentTheme]);
    useEffect(() => {
        focusInput();
        const handleGlobalClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'BUTTON' || target.closest('button') || target.tagName === 'SELECT') return;
            focusInput();
        };
        window.addEventListener('click', handleGlobalClick);
        return () => window.removeEventListener('click', handleGlobalClick);
    }, []);

    useEffect(() => {
        const handleGlobalKeydown = (e: KeyboardEvent) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                engine.restart();
                focusInput();
            }
        };
        window.addEventListener('keydown', handleGlobalKeydown);
        return () => window.removeEventListener('keydown', handleGlobalKeydown);
    }, [engine]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === ' ') e.preventDefault();
        if (e.key === 'Backspace') {
            e.preventDefault();
            engine.deleteChar(e.ctrlKey || e.metaKey);
        } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            engine.insertChar(e.key);
        }
    };

    const isFocused = engine.state === 'running';

    const finalWpm = engine.history.length > 0 ? engine.history[engine.history.length - 1].wpm : 0;
    const finalRaw = engine.history.length > 0 ? engine.history[engine.history.length - 1].rawWpm : 0;
    let correctChars = 0;
    for (let i = 0; i < engine.typed.length; i++) {
        if (engine.typed[i] === engine.words[i]) correctChars++;
    }
    const accuracy = engine.typed.length > 0 ? Math.round((correctChars / engine.typed.length) * 100) : 100;
    const timeTaken = engine.history.length > 0 ? engine.history[engine.history.length - 1].time : 0;

    return (
        <div
            className="min-h-screen flex flex-col transition-colors duration-300"
            style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
        >
            <input
                ref={hiddenInputRef}
                type="text"
                className="absolute w-0 h-0 opacity-0 pointer-events-none"
                onKeyDown={handleKeyDown}
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck="false"
                readOnly
            />

            {/* ── Top Navbar ── */}
            <motion.nav
                animate={{ opacity: isFocused ? 0 : 1, y: isFocused ? -10 : 0 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="w-full flex items-center justify-between px-10 py-5"
                style={{ borderBottom: '1px solid var(--border-glass)' }}
            >
                {/* Logo */}
                <span
                    className="text-2xl font-bold tracking-tight select-none font-typing"
                    style={{ color: 'var(--text-primary)' }}
                >
                    type<span style={{ color: 'var(--text-accent)' }}>warrior</span>
                </span>

                {/* Right controls */}
                <div className="flex items-center gap-5">
                    {/* Theme Picker */}
                    <ThemePicker />

                    {/* Settings icon */}
                    <button
                        style={{ color: 'var(--text-main)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        title="Settings"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                    </button>

                    {/* User icon */}
                    <button
                        style={{ color: 'var(--text-main)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        title="Account"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    </button>
                </div>
            </motion.nav>

            {/* ── Main centered content ── */}
            <main className="flex flex-col items-center justify-center flex-1 w-full px-6 pb-12">
                <AnimatePresence mode="wait">
                    {engine.state === 'finished' ? (
                        <motion.div
                            key="stats"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="w-full max-w-5xl"
                        >
                            <StatsScreen
                                wpm={finalWpm}
                                rawWpm={finalRaw}
                                accuracy={accuracy}
                                history={engine.history}
                                onRestart={() => {
                                    engine.restart();
                                    focusInput();
                                }}
                                timeTaken={timeTaken}
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="typing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full max-w-5xl flex flex-col items-center gap-10"
                        >
                            {/* Mode selector – Monkeytype style */}
                            <motion.div
                                animate={{ opacity: isFocused ? 0 : 1 }}
                                transition={{ duration: 0.3 }}
                                className="flex items-center gap-1 rounded-lg px-2 py-1.5"
                                style={{ background: 'var(--bg-secondary)' }}
                            >
                                {/* Mode tabs */}
                                <div className="flex items-center gap-1 text-sm font-typing">
                                    {(['time', 'words'] as const).map(mode => (
                                        <button
                                            key={mode}
                                            onClick={() => engine.setTestMode(mode)}
                                            className="px-3 py-1 rounded-md transition-all duration-200"
                                            style={{
                                                color: engine.testMode === mode ? 'var(--text-accent)' : 'var(--text-main)',
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                fontSize: '14px',
                                                fontFamily: 'inherit',
                                            }}
                                        >
                                            {mode}
                                        </button>
                                    ))}
                                </div>

                                {/* Divider */}
                                <div style={{ width: '1px', height: '16px', background: 'var(--text-main)', opacity: 0.25, margin: '0 4px' }} />

                                {/* Number options */}
                                <div className="flex items-center gap-1 text-sm font-typing">
                                    {(engine.testMode === 'time' ? [15, 30, 60] : [10, 25, 50]).map(val => (
                                        <button
                                            key={val}
                                            onClick={() => engine.testMode === 'time' ? engine.setTimeConfig(val) : engine.setWordConfig(val)}
                                            className="px-3 py-1 rounded-md transition-all duration-200"
                                            style={{
                                                color: (engine.testMode === 'time' ? engine.timeConfig : engine.wordConfig) === val
                                                    ? 'var(--text-accent)'
                                                    : 'var(--text-main)',
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                fontSize: '14px',
                                                fontFamily: 'inherit',
                                            }}
                                        >
                                            {val}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Live timer / word counter */}
                            <motion.div
                                animate={{ opacity: isFocused ? 1 : 0 }}
                                transition={{ duration: 0.2 }}
                                className="w-full text-left font-typing text-3xl font-bold"
                                style={{ color: 'var(--text-accent)', minHeight: '2.5rem' }}
                            >
                                {engine.testMode === 'time'
                                    ? engine.timeLeft
                                    : `${engine.typed.split(' ').length}/${engine.wordConfig}`}
                            </motion.div>

                            {/* Words area */}
                            <div
                                className="w-full"
                                ref={containerRef}
                                onClick={focusInput}
                            >
                                <WordDisplay words={engine.words} typed={engine.typed} />
                            </div>

                            {/* Restart hint */}
                            <motion.div
                                animate={{ opacity: isFocused ? 0 : 0.5 }}
                                transition={{ duration: 0.3 }}
                                className="flex items-center gap-2 text-sm font-typing"
                                style={{ color: 'var(--text-main)' }}
                            >
                                <span
                                    className="px-2 py-1 rounded text-xs"
                                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)' }}
                                >
                                    tab
                                </span>
                                <span>+</span>
                                <span
                                    className="px-2 py-1 rounded text-xs"
                                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)' }}
                                >
                                    enter
                                </span>
                                <span style={{ opacity: 0.7 }}>— restart test</span>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
