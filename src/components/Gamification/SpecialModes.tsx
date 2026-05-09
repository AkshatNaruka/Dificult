'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const gameModesDefinitions = {
    sprint: {
        emoji: '⚡',
        name: 'Sprint',
        description: 'Fast & furious. 15 seconds to prove your speed.',
        color: '#ff6b6b',
        multiplier: 1.3,
    },
    endurance: {
        emoji: '🏃',
        name: 'Endurance',
        description: 'How long can you keep the combo? 5 minutes of keys.',
        color: '#4ecdc4',
        multiplier: 1.5,
    },
    zen: {
        emoji: '🧘',
        name: 'Zen Mode',
        description: 'No timer. No pressure. Just you and the keyboard.',
        color: '#95e1d3',
        multiplier: 1.0,
    },
    ranked: {
        emoji: '🏆',
        name: 'Ranked',
        description: 'Compete on the leaderboard. Your best matters here.',
        color: '#f9ca24',
        multiplier: 2.0,
    },
};

interface SpecialModeSelectorProps {
    onSelectMode: (mode: keyof typeof gameModesDefinitions) => void;
    selectedMode?: keyof typeof gameModesDefinitions;
}

export function SpecialModeSelector({ onSelectMode, selectedMode }: SpecialModeSelectorProps) {
    const modes = Object.entries(gameModesDefinitions);

    return (
        <div className="w-full">
            <div className="text-xs uppercase tracking-[0.24em] opacity-60 mb-3" style={{ color: 'var(--text-main)' }}>
                Game Modes
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {modes.map(([modeId, modeInfo]) => (
                    <motion.button
                        key={modeId}
                        onClick={() => onSelectMode(modeId as keyof typeof gameModesDefinitions)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-3 rounded-lg border transition-all duration-200"
                        style={{
                            background: selectedMode === modeId ? `${modeInfo.color}20` : 'var(--bg-secondary)',
                            borderColor:
                                selectedMode === modeId ? modeInfo.color : 'var(--border-glass)',
                            color: 'var(--text-primary)',
                        }}
                    >
                        <div className="text-2xl mb-1">{modeInfo.emoji}</div>
                        <div className="text-xs font-bold uppercase tracking-[0.12em]">{modeInfo.name}</div>
                        <div className="text-[10px] opacity-60 mt-1">{modeInfo.description}</div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
