'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTypingEngine } from '../../hooks/useTypingEngine';
import { useThemeStore } from '../../store/themeStore';
import { WordDisplay } from './WordDisplay';
import { StatsScreen } from './StatsScreen';
import { motion, AnimatePresence } from 'framer-motion';

export default function TypingTestApp() {
    const engine = useTypingEngine();
    const themeStore = useThemeStore();
    const hiddenInputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const focusInput = () => {
        hiddenInputRef.current?.focus();
    };

    useEffect(() => {
        focusInput();
        const handleGlobalClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'BUTTON' || target.closest('button')) return;
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
        <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-start p-6 transition-colors duration-500 relative">

            <input
                ref={hiddenInputRef}
                type="text"
                className="absolute w-0 h-0 opacity-0"
                onKeyDown={handleKeyDown}
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck="false"
            />

            {/* Minimal Header */}
            <motion.header
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: isFocused ? 0 : 1, y: isFocused ? -20 : 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="relative w-full max-w-5xl px-4 py-6 flex justify-between items-center z-10 mb-8"
            >
                <div className="flex items-center gap-3">
                    <div className="font-bold text-3xl tracking-tighter text-[var(--text-primary)]">
                        type<span className="text-[var(--text-accent)]">warrior</span>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="relative group">
                        <select
                            value={themeStore.currentTheme}
                            onChange={(e) => themeStore.setTheme(e.target.value)}
                            className="appearance-none bg-transparent text-[var(--text-main)] hover:text-[var(--text-primary)] px-2 py-1 pr-6 font-medium text-sm outline-none cursor-pointer transition-colors"
                        >
                            {themeStore.availableThemes.map(t => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-main)] group-hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                        </div>
                    </div>

                    <button className="text-[var(--text-main)] hover:text-[var(--text-primary)] transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                    </button>
                    <button className="text-[var(--text-main)] hover:text-[var(--text-primary)] transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    </button>
                </div>
            </motion.header>

            {/* Main Content Area */}
            < main className="w-full max-w-5xl relative z-0 flex flex-col items-center justify-center flex-1" >
                <AnimatePresence mode="wait">
                    {engine.state === 'finished' ? (
                        <motion.div
                            key="stats"
                            initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                            transition={{ duration: 0.5, type: 'spring', damping: 20 }}
                            className="w-full"
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
                            className="w-full flex flex-col items-center gap-12"
                        >
                            {/* Minimal Command Palette / Mode Selector */}
                            <motion.div
                                animate={{ opacity: isFocused ? 0 : 1, y: isFocused ? -20 : 0 }}
                                transition={{ duration: 0.4 }}
                                className="flex gap-6 text-sm font-medium text-[var(--text-main)] bg-[var(--bg-secondary)] px-6 py-2 rounded-xl"
                            >
                                <div className="flex gap-4">
                                    <button onClick={() => engine.setTestMode('time')} className={`transition-colors duration-200 hover:text-[var(--text-primary)] ${engine.testMode === 'time' ? 'text-[var(--text-accent)]' : ''}`}>time</button>
                                    <button onClick={() => engine.setTestMode('words')} className={`transition-colors duration-200 hover:text-[var(--text-primary)] ${engine.testMode === 'words' ? 'text-[var(--text-accent)]' : ''}`}>words</button>
                                </div>

                                <div className="w-[2px] h-4 bg-[var(--text-main)] opacity-30 self-center rounded-full" />

                                {engine.testMode === 'time' ? (
                                    <div className="flex gap-4">
                                        {[15, 30, 60].map(val => (
                                            <button key={val} onClick={() => engine.setTimeConfig(val)} className={`transition-colors duration-200 hover:text-[var(--text-primary)] ${engine.timeConfig === val ? 'text-[var(--text-accent)]' : ''}`}>{val}</button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex gap-4">
                                        {[10, 25, 50].map(val => (
                                            <button key={val} onClick={() => engine.setWordConfig(val)} className={`transition-colors duration-200 hover:text-[var(--text-primary)] ${engine.wordConfig === val ? 'text-[var(--text-accent)]' : ''}`}>{val}</button>
                                        ))}
                                    </div>
                                )}
                            </motion.div>

                            {/* Timer/Progress - Visible when typing */}
                            <div className="w-full justify-start -mb-8">
                                <motion.div
                                    animate={{ opacity: isFocused ? 1 : 0 }}
                                    className="text-[var(--text-accent)] text-2xl font-bold font-typing tracking-widest"
                                >
                                    {engine.testMode === 'time' ? engine.timeLeft : `${engine.typed.split(' ').length}/${engine.wordConfig}`}
                                </motion.div>
                            </div>

                            {/* Typing Sandbox */}
                            <div
                                className="w-full relative px-2"
                                ref={containerRef}
                                onClick={focusInput}
                            >
                                <WordDisplay words={engine.words} typed={engine.typed} />
                            </div>

                            {/* Restart Hint */}
                            <motion.div
                                animate={{ opacity: isFocused ? 0 : 0.6 }}
                                transition={{ duration: 0.3 }}
                                className="mt-8 text-[var(--text-main)] text-sm flex items-center gap-2 font-medium"
                            >
                                <span className="bg-[var(--bg-secondary)] px-2 py-1 rounded">tab</span>
                                <span>+</span>
                                <span className="bg-[var(--bg-secondary)] px-2 py-1 rounded">enter</span>
                                <span className="ml-1 opacity-70">- restart test</span>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main >
        </div >
    );
}
