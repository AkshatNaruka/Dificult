'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const tips = [
    { emoji: '⚡', title: 'Speed Matters', desc: 'Higher WPM = more XP. Push your limits!' },
    { emoji: '🎯', title: 'Accuracy Counts', desc: 'Every error costs points. Focus gets you further.' },
    { emoji: '🔥', title: 'Combo Kings', desc: 'Build massive combos for bonus XP multipliers!' },
    { emoji: '💀', title: 'Sudden Death', desc: 'Survive sudden death for 2.2x XP rewards.' },
    { emoji: '📈', title: 'Level Up', desc: 'Reach new levels, unlock new challenges and modes.' },
    { emoji: '🏆', title: 'Daily Streaks', desc: 'Play every day to build unbreakable streaks!' },
    { emoji: '🎊', title: 'Achievement Hunting', desc: 'Collect badges for unique challenges and milestones.' },
    { emoji: '👥', title: 'Leaderboards', desc: 'Compete globally. Show the world your skills.' },
];

export function TipsCarousel() {
    const [currentTip, setCurrentTip] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTip(prev => (prev + 1) % tips.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const tip = tips[currentTip];

    return (
        <motion.div
            key={currentTip}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-xl p-4 border"
            style={{
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(249, 115, 22, 0.1))',
                borderColor: 'var(--border-glass)',
            }}
        >
            <div className="flex items-start gap-3">
                <div className="text-3xl flex-shrink-0">{tip.emoji}</div>
                <div>
                    <div className="font-bold text-sm" style={{ color: 'var(--text-accent)' }}>
                        💡 {tip.title}
                    </div>
                    <div className="text-sm mt-1" style={{ color: 'var(--text-main)', opacity: 0.8 }}>
                        {tip.desc}
                    </div>
                </div>
            </div>
            <div className="flex gap-1 mt-3 justify-center">
                {tips.map((_, idx) => (
                    <div
                        key={idx}
                        className="h-1 rounded-full transition-all"
                        style={{
                            width: idx === currentTip ? '24px' : '8px',
                            background: idx === currentTip ? 'var(--text-accent)' : 'var(--bg-secondary)',
                        }}
                    />
                ))}
            </div>
        </motion.div>
    );
}
