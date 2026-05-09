'use client';

import React, { useEffect } from 'react';
import type { DifficultyLevel } from '@/hooks/useTypingEngine';

interface DifficultyEffectsProps {
    difficulty: DifficultyLevel;
    typed: string;
}

export function DifficultyEffects({ difficulty, typed }: DifficultyEffectsProps) {
    useEffect(() => {
        if (difficulty === 'normal') {
            // Remove effects when switching to normal
            const existingStyle = document.getElementById('difficulty-effects-style');
            if (existingStyle) {
                existingStyle.textContent = '';
            }
            return;
        }

        const styleId = 'difficulty-effects-style';
        let existingStyle = document.getElementById(styleId) as HTMLStyleElement;
        
        if (!existingStyle) {
            existingStyle = document.createElement('style');
            existingStyle.id = styleId;
            document.head.appendChild(existingStyle);
        }

        let css = '';

        // Hard: Subtle invert with animation
        if (difficulty === 'hard') {
            css = `
                @keyframes hardInvert {
                    0% { filter: invert(0%); }
                    50% { filter: invert(20%); }
                    100% { filter: invert(0%); }
                }
                body {
                    animation: hardInvert 4s ease-in-out infinite !important;
                }
            `;
        }

        // Insane: Rapid color flashes + screen shake
        if (difficulty === 'insane') {
            css = `
                @keyframes colorFlash {
                    0% { filter: hue-rotate(0deg); }
                    25% { filter: hue-rotate(90deg); }
                    50% { filter: hue-rotate(180deg); }
                    75% { filter: hue-rotate(270deg); }
                    100% { filter: hue-rotate(360deg); }
                }
                body {
                    animation: colorFlash 0.8s linear infinite !important;
                }
            `;
        }

        // Chaos: Screen distortion + extreme effects
        if (difficulty === 'chaos') {
            css = `
                @keyframes chaosShake {
                    0% { transform: translate(0, 0) rotate(0deg) skewX(0deg); }
                    20% { transform: translate(-3px, 2px) rotate(1deg) skewX(2deg); }
                    40% { transform: translate(3px, -3px) rotate(-1deg) skewX(-2deg); }
                    60% { transform: translate(-2px, 3px) rotate(0.5deg) skewX(1deg); }
                    80% { transform: translate(2px, -2px) rotate(-0.5deg) skewX(-1deg); }
                    100% { transform: translate(0, 0) rotate(0deg) skewX(0deg); }
                }
                @keyframes chaosColor {
                    0% { filter: hue-rotate(0deg) saturate(150%) brightness(110%); }
                    33% { filter: hue-rotate(120deg) saturate(150%) brightness(110%); }
                    66% { filter: hue-rotate(240deg) saturate(150%) brightness(110%); }
                    100% { filter: hue-rotate(360deg) saturate(150%) brightness(110%); }
                }
                body {
                    animation: chaosColor 0.4s linear infinite, chaosShake 0.2s ease-in-out infinite !important;
                }
            `;
        }

        // Nightmare: Extreme distortion + chromatic aberration + glitch
        if (difficulty === 'nightmare') {
            css = `
                @keyframes nightmareShake {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    10% { transform: translate(-5px, 3px) rotate(-1deg); }
                    20% { transform: translate(5px, -4px) rotate(1deg); }
                    30% { transform: translate(-4px, 5px) rotate(-1deg); }
                    40% { transform: translate(4px, -5px) rotate(1deg); }
                    50% { transform: translate(-3px, 3px) rotate(-0.5deg); }
                    60% { transform: translate(3px, -3px) rotate(0.5deg); }
                    70% { transform: translate(-5px, 5px) rotate(-1deg); }
                    80% { transform: translate(5px, -5px) rotate(1deg); }
                    90% { transform: translate(-2px, 2px) rotate(0deg); }
                }
                @keyframes nightmareColor {
                    0% { filter: hue-rotate(0deg) saturate(220%) brightness(130%) contrast(160%); }
                    25% { filter: hue-rotate(90deg) saturate(220%) brightness(130%) contrast(160%); }
                    50% { filter: hue-rotate(180deg) saturate(220%) brightness(130%) contrast(160%); }
                    75% { filter: hue-rotate(270deg) saturate(220%) brightness(130%) contrast(160%); }
                    100% { filter: hue-rotate(360deg) saturate(220%) brightness(130%) contrast(160%); }
                }
                body {
                    animation: nightmareColor 0.25s linear infinite, 
                               nightmareShake 0.12s ease-in-out infinite !important;
                }
            `;
        }

        existingStyle.textContent = css;
    }, [difficulty]);

    return null;
}
