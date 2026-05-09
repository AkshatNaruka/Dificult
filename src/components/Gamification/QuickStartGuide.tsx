'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const quickStartGuides = [
    {
        icon: '⌨️',
        title: 'How to Play',
        steps: [
            '👆 Click on the text area or press any key to start',
            '⌨️ Type the words as they appear on screen',
            '🎯 Maintain accuracy while building speed',
            '🔄 When finished, click anywhere to see your stats',
        ],
    },
    {
        icon: '🎮',
        title: 'Game Modes',
        steps: [
            '⚡ Sprint: 15 seconds, blazing fast',
            '🏃 Endurance: 5 minutes, test your stamina',
            '🧘 Zen: Infinite words, no timer, chill out',
            '🏆 Ranked: Standard 30s, compete on leaderboards',
        ],
    },
    {
        icon: '🎯',
        title: 'Scoring System',
        steps: [
            '+25 XP minimum per run',
            'Multiply by difficulty (2.4x for Nightmare)',
            'Bonuses: WPM (×4) + Accuracy (×2) + Combo (×6)',
            '🔥 Build streaks for 5% XP bonus per day',
        ],
    },
    {
        icon: '🏅',
        title: 'Crush Achievements',
        steps: [
            '🎯 Speed demons: 50, 100+ WPM',
            '💯 Perfect runs: 95%, 100% accuracy',
            '🔥 Combo master: 25, 50, 100+ chain',
            '☠️ Survive nightmare mode difficulty',
        ],
    },
];

export function QuickStartGuide() {
    const [currentGuide, setCurrentGuide] = useState(0);

    const guide = quickStartGuides[currentGuide];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl p-6 border"
            style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))',
                borderColor: 'var(--border-glass)',
            }}
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="text-4xl">{guide.icon}</div>
                    <div>
                        <div className="text-sm uppercase tracking-[0.16em] opacity-60" style={{ color: 'var(--text-main)' }}>
                            Quick Start
                        </div>
                        <div className="text-lg font-bold" style={{ color: 'var(--text-accent)' }}>
                            {guide.title}
                        </div>
                    </div>
                </div>
            </div>

            {/* Steps */}
            <div className="space-y-3 mb-6">
                <AnimatePresence mode="wait">
                    {guide.steps.map((step, idx) => (
                        <motion.div
                            key={`${currentGuide}-${idx}`}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ delay: idx * 0.05 }}
                            className="flex gap-3 text-sm"
                            style={{ color: 'var(--text-main)' }}
                        >
                            <div style={{ color: 'var(--text-accent)' }} className="font-bold flex-shrink-0 w-4">
                                {idx + 1}.
                            </div>
                            <div>{step}</div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Navigation Dots */}
            <div className="flex gap-2 justify-center">
                {quickStartGuides.map((_, idx) => (
                    <motion.button
                        key={idx}
                        onClick={() => setCurrentGuide(idx)}
                        className="h-2 rounded-full transition-all"
                        animate={{
                            width: idx === currentGuide ? '24px' : '8px',
                            opacity: idx === currentGuide ? 1 : 0.4,
                        }}
                        style={{
                            background: idx === currentGuide ? 'var(--text-accent)' : 'var(--bg-secondary)',
                        }}
                        whileHover={{ scale: 1.2 }}
                    />
                ))}
            </div>

            {/* Hint */}
            <div className="text-xs text-center mt-4 opacity-60" style={{ color: 'var(--text-main)' }}>
                Click the dots to explore more tips
            </div>
        </motion.div>
    );
}
