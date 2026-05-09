'use client';

import React from 'react';
import { motion } from 'framer-motion';

const features = [
    {
        icon: '🎮',
        title: '4 Game Modes',
        description: 'Sprint, Endurance, Zen, and Ranked — pick your challenge',
    },
    {
        icon: '📊',
        title: 'Real-Time Stats',
        description: 'Track WPM, accuracy, combo, and more with detailed analytics',
    },
    {
        icon: '🏆',
        title: 'Global Leaderboards',
        description: 'Compete worldwide and see where you rank',
    },
    {
        icon: '⚡',
        title: '5 Difficulty Levels',
        description: 'From chill to chaotic — find your edge',
    },
    {
        icon: '🎯',
        title: '13+ Achievements',
        description: 'Unlock badges for speed, accuracy, and special feats',
    },
    {
        icon: '🔥',
        title: 'Daily Streaks',
        description: 'Build unbreakable streaks for bonus XP rewards',
    },
    {
        icon: '📈',
        title: 'Progressive Levels',
        description: 'Earn XP and climb the ranks with each run',
    },
    {
        icon: '📱',
        title: 'No Login Required',
        description: 'Start typing immediately, save progress anytime',
    },
];

export function FeatureShowcase() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="text-center space-y-2">
                <div
                    className="inline-block px-3 py-1 rounded-full text-xs uppercase tracking-[0.16em] font-bold mb-4"
                    style={{
                        background: 'rgba(139, 92, 246, 0.2)',
                        color: 'var(--text-accent)',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                    }}
                >
                    ✨ Features
                </div>
                <h2 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    Everything You Need to Master Your Keyboard
                </h2>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="p-4 rounded-xl border group hover:border-blue-500/50 transition-all"
                        style={{
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
                            borderColor: 'var(--border-glass)',
                        }}
                    >
                        <div className="flex gap-3">
                            <div className="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
                                {feature.icon}
                            </div>
                            <div>
                                <div className="font-bold text-sm" style={{ color: 'var(--text-accent)' }}>
                                    {feature.title}
                                </div>
                                <div className="text-xs mt-1" style={{ color: 'var(--text-main)', opacity: 0.7 }}>
                                    {feature.description}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* CTA */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center pt-4"
            >
                <p style={{ color: 'var(--text-main)', fontSize: '14px' }} className="opacity-70">
                    🚀 Scroll down to begin your typing journey
                </p>
            </motion.div>
        </motion.div>
    );
}
