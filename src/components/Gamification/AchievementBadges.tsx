'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const achievementDefinitions = {
    first_run: { emoji: '🎯', name: 'First Run', description: 'Complete your first test' },
    speed_50: { emoji: '⚡', name: 'Speedster', description: 'Reach 50 WPM' },
    speed_100: { emoji: '🚀', name: 'Sonic Speed', description: 'Reach 100 WPM' },
    accuracy_95: { emoji: '🎪', name: 'Precision Master', description: '95%+ accuracy' },
    accuracy_100: { emoji: '💎', name: 'Perfect Run', description: '100% accuracy' },
    combo_25: { emoji: '🔥', name: 'Hot Hand', description: '25 char combo' },
    combo_50: { emoji: '🌪️', name: 'Tornado Mode', description: '50 char combo' },
    combo_100: { emoji: '⭐', name: 'Legend Status', description: '100 char combo' },
    sudden_death_complete: { emoji: '💀', name: 'Cheated Death', description: 'Complete sudden death mode' },
    level_5: { emoji: '📈', name: 'Climber', description: 'Reach level 5' },
    level_10: { emoji: '👑', name: 'Champion', description: 'Reach level 10' },
    streak_7: { emoji: '🔗', name: '7 Day Chain', description: '7 day streak' },
    streak_30: { emoji: '🏆', name: 'Unstoppable', description: '30 day streak' },
};

interface AchievementBadgesProps {
    achievements: string[];
    showAll?: boolean;
}

export function AchievementBadges({ achievements, showAll = false }: AchievementBadgesProps) {
    const visibleAchievements = showAll ? Object.keys(achievementDefinitions) : achievements;

    return (
        <div className="w-full">
            <div className="text-xs uppercase tracking-[0.24em] opacity-60 mb-3" style={{ color: 'var(--text-main)' }}>
                Achievements ({achievements.length})
            </div>
            <div className="grid grid-cols-6 gap-2 sm:grid-cols-8">
                {visibleAchievements.map((achId) => {
                    const ach = achievementDefinitions[achId as keyof typeof achievementDefinitions];
                    if (!ach) return null;
                    const isUnlocked = achievements.includes(achId);

                    return (
                        <motion.div
                            key={achId}
                            whileHover={{ scale: 1.1 }}
                            className="aspect-square rounded-lg flex items-center justify-center text-2xl relative group cursor-pointer transition-all"
                            style={{
                                background: isUnlocked
                                    ? 'linear-gradient(135deg, var(--text-accent), #f97316)'
                                    : 'var(--bg-secondary)',
                                opacity: isUnlocked ? 1 : 0.3,
                            }}
                            title={`${ach.name}: ${ach.description}`}
                        >
                            {ach.emoji}
                            {isUnlocked && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 text-xs"
                                >
                                    ✓
                                </motion.div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}

interface AchievementUnlockProps {
    id: string;
}

export function AchievementUnlockNotification({ id }: AchievementUnlockProps) {
    const ach = achievementDefinitions[id as keyof typeof achievementDefinitions];
    if (!ach) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.8 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-2xl border backdrop-blur-md"
            style={{
                background: 'rgba(10,10,10,0.94)',
                borderColor: 'var(--border-glass)',
                color: 'var(--text-primary)',
                boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 20px 50px rgba(0,0,0,0.5)',
            }}
        >
            <div className="flex items-center gap-3">
                <div className="text-4xl">{ach.emoji}</div>
                <div>
                    <div className="text-xs uppercase tracking-[0.22em]" style={{ color: 'var(--text-accent)' }}>
                        Achievement Unlocked
                    </div>
                    <div className="font-bold text-sm mt-0.5">{ach.name}</div>
                    <div className="text-xs opacity-60 mt-1">{ach.description}</div>
                </div>
            </div>
        </motion.div>
    );
}
