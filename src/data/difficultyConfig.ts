import type { DifficultyLevel } from '@/hooks/useTypingEngine';

export interface DifficultyConfig {
    allowBackspace: boolean;
    includePunctuation: boolean;
    includeNumbers: boolean;
    suddenDeath: boolean;
    hideTyped: boolean;
    wordComplexity: 'simple' | 'normal' | 'complex';
    xpMultiplier: number;
}

export const DIFFICULTY_CONFIG: Record<DifficultyLevel, DifficultyConfig> = {
    easy: {
        allowBackspace:     true,
        includePunctuation: false,
        includeNumbers:     false,
        suddenDeath:        false,
        hideTyped:          false,
        wordComplexity:     'simple',
        xpMultiplier:       0.8,
    },
    normal: {
        allowBackspace:     true,
        includePunctuation: false,
        includeNumbers:     false,
        suddenDeath:        false,
        hideTyped:          false,
        wordComplexity:     'normal',
        xpMultiplier:       1.0,
    },
    hard: {
        allowBackspace:     false,
        includePunctuation: false,
        includeNumbers:     false,
        suddenDeath:        false,
        hideTyped:          false,
        wordComplexity:     'normal',
        xpMultiplier:       1.4,
    },
    expert: {
        allowBackspace:     false,
        includePunctuation: true,
        includeNumbers:     true,
        suddenDeath:        false,
        hideTyped:          false,
        wordComplexity:     'complex',
        xpMultiplier:       1.8,
    },
    suddenDeath: {
        allowBackspace:     false,
        includePunctuation: false,
        includeNumbers:     false,
        suddenDeath:        true,
        hideTyped:          false,
        wordComplexity:     'normal',
        xpMultiplier:       2.2,
    },
};
