'use client';

import React from 'react';
import type { DifficultyLevel } from '@/hooks/useTypingEngine';

interface DifficultyWordEffectsProps {
    difficulty: DifficultyLevel;
}

const DIFFICULTY_HINTS: Partial<Record<DifficultyLevel, string>> = {
    hard:        'no backspace',
    expert:      'no backspace · punctuation · numbers',
    suddenDeath: 'one mistake ends the test',
};

export function DifficultyWordEffects({ difficulty }: DifficultyWordEffectsProps) {
    const hint = DIFFICULTY_HINTS[difficulty];
    if (!hint) return null;

    return (
        <div
            className="fixed bottom-6 left-1/2 -translate-x-1/2 pointer-events-none"
            style={{ zIndex: 50 }}
        >
            <span
                className="px-3 py-1 rounded-full text-xs tracking-widest uppercase font-mono"
                style={{
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-glass)',
                    opacity: 0.6,
                }}
            >
                {hint}
            </span>
        </div>
    );
}
