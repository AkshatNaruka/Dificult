'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Caret } from './Caret';
import type { DifficultyLevel } from '@/hooks/useTypingEngine';

interface WordDisplayProps {
    words: string;
    typed: string;
    difficulty?: DifficultyLevel;
}

export function WordDisplay({ words, typed, difficulty = 'normal' }: WordDisplayProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const activeCharRef = useRef<HTMLSpanElement>(null);
    const [caretPos, setCaretPos] = useState({ top: 0, left: 0 });

    useEffect(() => {
        if (activeCharRef.current && containerRef.current) {
            const charRect = activeCharRef.current.getBoundingClientRect();
            const containerRect = containerRef.current.getBoundingClientRect();

            const left = charRect.left - containerRect.left;
            const top = charRect.top - containerRect.top;

            setCaretPos({ top, left });

            if (top > 120) {
                containerRef.current.style.transform = `translateY(-${top - 45}px)`;
            } else {
                containerRef.current.style.transform = `translateY(0px)`;
            }
        }
    }, [typed]);

    const wordArr = useMemo(() => words.split(' '), [words]);
    let globalCharIndex = 0;

    // Get difficulty-based character styles
    const getCharacterStyles = (charIndex: number, isForUntyped: boolean = false) => {
        const hashCode = Math.abs(charIndex * 12345) % 360;
        
        if (difficulty === 'hard') {
            return {
                filter: 'blur(0.3px) saturate(0.7)',
                opacity: 0.85,
            };
        }
        if (difficulty === 'insane') {
            return {
                filter: `hue-rotate(${hashCode}deg) blur(0.5px)`,
                transform: `skewX(${Math.sin(charIndex) * 3}deg)`,
            };
        }
        if (difficulty === 'chaos') {
            return {
                filter: `hue-rotate(${hashCode}deg) blur(0.7px) brightness(${0.8 + Math.sin(charIndex) * 0.2})`,
                transform: `scaleY(${0.95 + Math.cos(charIndex) * 0.05}) skewX(${Math.sin(charIndex) * 5}deg)`,
            };
        }
        if (difficulty === 'nightmare') {
            return {
                filter: `hue-rotate(${hashCode}deg) blur(1px) brightness(${1.1 + Math.sin(charIndex * 0.5) * 0.2})`,
                transform: `scaleY(${0.9 + Math.cos(charIndex * 0.3) * 0.1}) skewX(${Math.sin(charIndex * 0.7) * 8}deg) scaleX(${0.95 + Math.sin(charIndex) * 0.05})`,
                textShadow: `2px 2px 4px rgba(255, 0, 0, 0.2), -2px -2px 4px rgba(0, 255, 255, 0.2)`,
            };
        }
        return {};
    };

    return (
        <div className="typing-mask relative w-[60vw] min-w-[320px] max-w-[800px] mx-auto h-[160px] overflow-hidden text-[32px] md:text-[38px] font-typing-buffer leading-relaxed tracking-tight px-4" style={{ color: 'var(--on-surface-variant)' }}>

            <div
                ref={containerRef}
                className="absolute w-full flex flex-wrap justify-start gap-x-[0.55em] gap-y-[0.4em] transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] left-0 right-0 px-4"
            >
                <Caret top={caretPos.top} left={caretPos.left} />

                {wordArr.map((word, wordIndex) => {
                    const wordStartIndex = globalCharIndex;
                    globalCharIndex += word.length + 1;

                    return (
                        <div key={wordIndex} className={`word flex relative`}>
                            {word.split('').map((char, charIndex) => {
                                const charGlobalIndex = wordStartIndex + charIndex;
                                const typedChar = typed[charGlobalIndex];

                                let stateClass = 'opacity-30';
                                let extraStyles: any = {};

                                if (typedChar !== undefined) {
                                    if (typedChar === char) {
                                        stateClass = 'text-[var(--on-surface)] font-semibold';
                                    } else {
                                        stateClass = 'text-[var(--error)] bg-[var(--error-container)] rounded-[4px] font-semibold';
                                        extraStyles = { borderBottom: '2px solid var(--error)' };
                                    }
                                } else {
                                    // Apply difficulty effects to untyped characters
                                    extraStyles = getCharacterStyles(charGlobalIndex, true);
                                }

                                const isActive = typed.length === charGlobalIndex;

                                return (
                                    <span
                                        key={charIndex}
                                        ref={isActive ? activeCharRef : null}
                                        className={`char ${stateClass} transition-all duration-150`}
                                        style={extraStyles}
                                    >
                                        {char}
                                    </span>
                                );
                            })}

                            {(() => {
                                const nextSpaceIdx = typed.indexOf(' ', wordStartIndex);
                                const maxTypedIdxForWord = nextSpaceIdx === -1 ? typed.length : nextSpaceIdx;
                                const expectedWordLength = word.length;
                                const typedLengthForWord = maxTypedIdxForWord - wordStartIndex;
                                const extraCharsCount = Math.max(0, typedLengthForWord - expectedWordLength);

                                if (extraCharsCount > 0) {
                                    const extraChars = typed.slice(wordStartIndex + expectedWordLength, maxTypedIdxForWord);
                                    return extraChars.split('').map((extraChar, idx) => {
                                        const extraGlobalIndex = wordStartIndex + expectedWordLength + idx;
                                        const isActive = typed.length === extraGlobalIndex;
                                        return (
                                            <span
                                                key={`extra-${idx}`}
                                                ref={isActive ? activeCharRef : null}
                                                className="char text-[var(--error)] opacity-80 border-b-[3px] border-[var(--error)] font-bold bg-[var(--error-container)] rounded-sm"
                                            >
                                                {extraChar}
                                            </span>
                                        )
                                    });
                                }
                                return null;
                            })()}

                            <span
                                ref={typed.length === globalCharIndex - 1 ? activeCharRef : null}
                                className="char invisible w-[0.1em]"
                            >
                                &nbsp;
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
