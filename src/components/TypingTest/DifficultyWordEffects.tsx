'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { DifficultyLevel } from '@/hooks/useTypingEngine';

interface DifficultyWordEffectsProps {
    difficulty: DifficultyLevel;
    words: string;
    typed: string;
}

interface FallingWord {
    id: string;
    word: string;
    startX: number;
    delay: number;
}

export function DifficultyWordEffects({ difficulty, words, typed }: DifficultyWordEffectsProps) {
    const [fallingWords, setFallingWords] = useState<FallingWord[]>([]);

    // Generate falling words for higher difficulties
    useEffect(() => {
        if (difficulty === 'hard' || difficulty === 'insane') {
            const wordList = words.split(' ').slice(Math.max(0, typed.split(' ').length - 2), typed.split(' ').length + 3);
            const newFallingWords = wordList.map((word, idx) => ({
                id: `${Date.now()}-${idx}`,
                word,
                startX: Math.random() * 80 - 40,
                delay: idx * 0.1,
            }));
            setFallingWords(newFallingWords);
        }
    }, [words, typed, difficulty]);

    if (difficulty === 'normal') {
        return null;
    }

    // Hard: Subtle falling words in background
    if (difficulty === 'hard') {
        return (
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {fallingWords.map((item, idx) => (
                    <motion.div
                        key={item.id}
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: '100vh', opacity: [0, 0.1, 0.1, 0] }}
                        transition={{
                            duration: 4 + idx * 0.5,
                            delay: item.delay,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                        className="absolute font-typing font-bold text-lg"
                        style={{
                            left: `${50 + item.startX}%`,
                            color: 'var(--text-accent)',
                            opacity: 0.08,
                        }}
                    >
                        {item.word}
                    </motion.div>
                ))}
            </div>
        );
    }

    // Insane: More aggressive falling words + bouncing
    if (difficulty === 'insane') {
        return (
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {fallingWords.map((item, idx) => (
                    <motion.div
                        key={item.id}
                        initial={{ y: -150, opacity: 0, rotate: 0 }}
                        animate={{
                            y: '100vh',
                            opacity: [0, 0.15, 0.15, 0],
                            rotate: 360 * Math.sin(idx),
                            x: [0, 20 * Math.cos(idx), -20 * Math.cos(idx), 0],
                        }}
                        transition={{
                            duration: 3 + idx * 0.3,
                            delay: item.delay,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                        className="absolute font-typing font-bold text-xl"
                        style={{
                            left: `${50 + item.startX}%`,
                            color: `hsl(${(idx * 60 + Date.now() / 10) % 360}, 100%, 50%)`,
                            opacity: 0.2,
                            textShadow: '0 0 10px currentColor',
                        }}
                    >
                        {item.word}
                    </motion.div>
                ))}
            </div>
        );
    }

    // Chaos: Chaotic falling words with extreme movements
    if (difficulty === 'chaos') {
        return (
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {fallingWords.map((item, idx) => {
                    const randomX = Math.random() * 200 - 100;
                    const randomRotation = Math.random() * 720 - 360;
                    return (
                        <motion.div
                            key={item.id}
                            initial={{ y: -200, opacity: 0 }}
                            animate={{
                                y: '120vh',
                                opacity: [0, 0.2, 0.2, 0],
                                x: randomX,
                                rotate: randomRotation,
                            }}
                            transition={{
                                duration: 2.5 + Math.random() * 1.5,
                                delay: item.delay + Math.random() * 0.5,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                            className="absolute font-typing font-bold text-2xl"
                            style={{
                                left: `${50 + item.startX}%`,
                                color: `hsl(${(idx * 90 + Date.now() / 5) % 360}, 150%, 50%)`,
                                opacity: 0.3,
                                textShadow: '0 0 15px currentColor',
                                fontStyle: 'italic',
                            }}
                        >
                            {item.word}
                        </motion.div>
                    );
                })}
            </div>
        );
    }

    // Nightmare: Extreme chaos with multiple layers
    if (difficulty === 'nightmare') {
        const multipliedWords = [...fallingWords, ...fallingWords, ...fallingWords];
        return (
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {multipliedWords.map((item, idx) => {
                    const randomX = Math.random() * 300 - 150;
                    const randomRotation = Math.random() * 1080 - 540;
                    const randomScale = 0.5 + Math.random() * 2;
                    return (
                        <motion.div
                            key={`${item.id}-${idx}`}
                            initial={{ y: -300, opacity: 0, scale: 0.5 }}
                            animate={{
                                y: '150vh',
                                opacity: [0, 0.25, 0.25, 0],
                                x: randomX,
                                rotate: randomRotation,
                                scale: randomScale,
                            }}
                            transition={{
                                duration: 2 + Math.random() * 2,
                                delay: (item.delay + Math.random() * 0.8) % 3,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                            className="absolute font-typing font-bold text-3xl font-black"
                            style={{
                                left: `${50 + item.startX}%`,
                                color: `hsl(${(idx * 45 + Date.now() / 2) % 360}, 200%, 50%)`,
                                textShadow: `0 0 20px hsl(${(idx * 45 + Date.now() / 2) % 360}, 200%, 50%),
                                             0 0 40px hsl(${(idx * 45 + Date.now() / 2 + 180) % 360}, 200%, 40%)`,
                                filter: `blur(${Math.random() * 0.5}px)`,
                            }}
                        >
                            {item.word}
                        </motion.div>
                    );
                })}
            </div>
        );
    }

    return null;
}
