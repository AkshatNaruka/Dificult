'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CelebrationParticle {
    id: string;
    x: number;
    y: number;
    emoji: string;
}

interface CelebrationEffectsProps {
    trigger: boolean;
    type: 'combo' | 'levelup' | 'achievement' | 'perfect' | 'milestone';
}

export function CelebrationEffects({ trigger, type }: CelebrationEffectsProps) {
    const [particles, setParticles] = useState<CelebrationParticle[]>([]);

    useEffect(() => {
        if (!trigger) return;

        const emojiMap = {
            combo: ['🔥', '⚡', '✨', '🎯'],
            levelup: ['📈', '⭐', '🎉', '🚀'],
            achievement: ['🏆', '🎊', '👑', '💎'],
            perfect: ['💯', '✨', '🌟', '🎆'],
            milestone: ['🎊', '🎉', '🎈', '✨'],
        };

        const emojis = emojiMap[type];
        const newParticles = Array.from({ length: 12 }).map((_, i) => ({
            id: `${Date.now()}-${i}`,
            x: Math.random() * 100 - 50,
            y: Math.random() * 100 - 50,
            emoji: emojis[Math.floor(Math.random() * emojis.length)],
        }));

        setParticles(newParticles);

        const timer = setTimeout(() => setParticles([]), 2000);
        return () => clearTimeout(timer);
    }, [trigger, type]);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
            <AnimatePresence>
                {particles.map(particle => (
                    <motion.div
                        key={particle.id}
                        initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                        animate={{
                            x: particle.x * 80,
                            y: particle.y * 120,
                            opacity: 0,
                            scale: 0.2,
                        }}
                        transition={{ duration: 1.8, ease: 'easeOut' }}
                        className="absolute left-1/2 top-1/2 text-4xl"
                    >
                        {particle.emoji}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}

// Confetti component
export function Confetti() {
    const [confetti, setConfetti] = useState<Array<{ id: string; left: number; delay: number }>>([]);

    useEffect(() => {
        const pieces = Array.from({ length: 30 }).map((_, i) => ({
            id: `conf-${i}`,
            left: Math.random() * 100,
            delay: Math.random() * 0.2,
        }));
        setConfetti(pieces);

        const timer = setTimeout(() => setConfetti([]), 2500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none">
            {confetti.map(piece => (
                <motion.div
                    key={piece.id}
                    initial={{ y: -10, opacity: 1, rotate: 0 }}
                    animate={{ y: window.innerHeight + 20, opacity: 0, rotate: 360 }}
                    transition={{ duration: 2.5, delay: piece.delay, ease: 'easeIn' }}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                        left: `${piece.left}%`,
                        background: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7'][
                            Math.floor(Math.random() * 5)
                        ],
                    }}
                />
            ))}
        </div>
    );
}
