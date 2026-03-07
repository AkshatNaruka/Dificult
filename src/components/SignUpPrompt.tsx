'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface SignUpPromptProps {
    wpm: number;
    accuracy: number;
}

export function SignUpPrompt({ wpm, accuracy }: SignUpPromptProps) {
    const [dismissed, setDismissed] = useState(false);

    if (dismissed) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.4, delay: 0.8 }}
                className="w-full max-w-md mx-auto mt-8 rounded-2xl overflow-hidden backdrop-blur-lg"
                style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-glass)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                }}
            >
                <div className="p-6 flex flex-col items-center gap-4 text-center">
                    {/* Trophy icon with glow */}
                    <div
                        className="text-4xl"
                        style={{ filter: 'drop-shadow(0 0 12px rgba(255, 200, 0, 0.4))' }}
                    >
                        🏆
                    </div>

                    <div>
                        <h3
                            className="font-typing text-lg font-bold mb-1"
                            style={{ color: 'var(--text-primary)' }}
                        >
                            Great run! {wpm} WPM
                        </h3>
                        <p
                            className="font-typing text-sm"
                            style={{ color: 'var(--text-main)', opacity: 0.7 }}
                        >
                            Sign up to save your scores, appear on the leaderboard, and track your progress over time.
                        </p>
                    </div>

                    <div className="flex flex-col gap-2.5 w-full mt-1">
                        <Link
                            href="/login"
                            className="w-full py-3 rounded-xl font-typing font-bold text-sm text-center transition-transform hover:scale-[1.02] active:scale-[0.98]"
                            style={{ background: 'var(--text-accent)', color: 'var(--bg-primary)' }}
                        >
                            Sign Up — It&apos;s Free
                        </Link>
                        <button
                            onClick={() => setDismissed(true)}
                            className="w-full py-2.5 rounded-xl font-typing text-sm text-center transition-opacity hover:opacity-80"
                            style={{ color: 'var(--text-main)', background: 'none', border: 'none', cursor: 'pointer', opacity: 0.6 }}
                        >
                            Maybe later
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
