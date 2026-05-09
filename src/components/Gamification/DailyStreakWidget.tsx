'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface DailyStreakWidgetProps {
    currentStreak: number;
    longestStreak: number;
    lastPlayedDate: string;
}

export function DailyStreakWidget({ currentStreak, longestStreak, lastPlayedDate }: DailyStreakWidgetProps) {
    const today = new Date().toISOString().split('T')[0];
    const playedToday = lastPlayedDate === today;
    const streakBonus = Math.min(currentStreak * 5, 100); // 5% per day, capped at 100%

    return (
        <motion.div
            className="w-full rounded-xl p-4 border"
            style={{
                background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.08), rgba(249, 202, 36, 0.08))',
                borderColor: 'var(--border-glass)',
            }}
        >
            <div className="flex items-center justify-between mb-3">
                <div>
                    <div className="text-xs uppercase tracking-[0.24em] opacity-60" style={{ color: 'var(--text-main)' }}>
                        Current Streak
                    </div>
                    <div className="text-3xl font-bold mt-1">
                        <span style={{ color: 'var(--text-accent)' }}>🔥 {currentStreak}</span>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xs uppercase tracking-[0.24em] opacity-60" style={{ color: 'var(--text-main)' }}>
                        Longest
                    </div>
                    <div className="text-2xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
                        {longestStreak}
                    </div>
                </div>
            </div>

            <div className="bg-black/20 rounded-lg p-2 mb-2">
                <div className="flex items-center justify-between text-xs mb-1">
                    <span style={{ color: 'var(--text-main)', opacity: 0.7 }}>Streak Bonus XP</span>
                    <span style={{ color: 'var(--text-accent)' }}>+{streakBonus}%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(currentStreak * 10, 100)}%` }}
                        transition={{ duration: 0.6 }}
                        className="h-full rounded-full"
                        style={{ background: 'linear-gradient(90deg, #ff6b6b, #f9ca24)' }}
                    />
                </div>
            </div>

            <div className="text-xs" style={{ color: 'var(--text-main)', opacity: 0.6 }}>
                {playedToday
                    ? '✓ Played today. Keep the chain alive!'
                    : 'Play today to maintain your streak.'}
            </div>
        </motion.div>
    );
}
