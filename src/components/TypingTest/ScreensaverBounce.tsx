'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { DifficultyLevel } from '@/hooks/useTypingEngine';

interface ScreensaverBounceProps {
    children: React.ReactNode;
    difficulty: DifficultyLevel;
    className?: string;
}

export function ScreensaverBounce({ children, difficulty, className = '' }: ScreensaverBounceProps) {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const directionRef = useRef({ vx: 2, vy: 2 });
    const wrapperRef = useRef<HTMLDivElement>(null);

    const shouldBounce = difficulty === 'chaos' || difficulty === 'nightmare';
    const shouldScreensaver = difficulty === 'screensaver';
    const shouldMove = shouldBounce || shouldScreensaver;

    const getRandomScreensaverPosition = () => {
        const rect = wrapperRef.current?.getBoundingClientRect();
        const width = rect?.width ?? 720;
        const height = rect?.height ?? 180;
        const maxX = Math.max(0, window.innerWidth / 2 - width / 2 - 24);
        const maxY = Math.max(0, window.innerHeight / 2 - height / 2 - 24);

        return {
            x: (Math.random() * 2 - 1) * maxX,
            y: (Math.random() * 2 - 1) * maxY,
        };
    };

    useEffect(() => {
        if (!shouldMove) {
            setPosition({ x: 0, y: 0 });
            directionRef.current = { vx: 2, vy: 2 };
            return;
        }

        if (shouldScreensaver) {
            setPosition(getRandomScreensaverPosition());
        }

        const interval = setInterval(() => {
            if (shouldScreensaver) {
                setPosition(getRandomScreensaverPosition());
                return;
            }

            setPosition(prev => {
                const nextVelocity = { ...directionRef.current };
                let newX = prev.x + nextVelocity.vx;
                let newY = prev.y + nextVelocity.vy;

                const maxX = Math.max(24, Math.min(window.innerWidth * 0.18, 72));
                const maxY = Math.max(18, Math.min(window.innerHeight * 0.14, 56));

                if (newX > maxX || newX < -maxX) {
                    nextVelocity.vx = -nextVelocity.vx;
                    newX = Math.max(-maxX, Math.min(maxX, newX));
                }

                if (newY > maxY || newY < -maxY) {
                    nextVelocity.vy = -nextVelocity.vy;
                    newY = Math.max(-maxY, Math.min(maxY, newY));
                }

                directionRef.current = nextVelocity;
                return { x: newX, y: newY };
            });
        }, shouldScreensaver ? 900 : 50);

        return () => clearInterval(interval);
    }, [shouldBounce, shouldMove, shouldScreensaver]);

    return (
        <motion.div
            ref={wrapperRef}
            animate={{
                x: shouldMove ? position.x : 0,
                y: shouldMove ? position.y : 0,
            }}
            transition={{
                type: 'tween',
                duration: shouldScreensaver ? 0.85 : 0,
                ease: shouldScreensaver ? 'easeInOut' : 'linear',
            }}
            className={className}
            style={{ willChange: 'transform' }}
        >
            {children}
        </motion.div>
    );
}
