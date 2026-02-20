'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Caret } from './Caret';

interface WordDisplayProps {
    words: string;
    typed: string;
}

export function WordDisplay({ words, typed }: WordDisplayProps) {
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

    return (
        <div className="relative w-full max-w-5xl mx-auto h-[160px] overflow-hidden text-[38px] font-typing leading-relaxed tracking-wide" style={{ color: 'var(--text-main)' }}>

            <div
                ref={containerRef}
                className="absolute w-full flex flex-wrap gap-x-[0.55em] gap-y-[0.4em] transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
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
                                let extraStyles = {};

                                if (typedChar !== undefined) {
                                    if (typedChar === char) {
                                        stateClass = 'text-[var(--text-primary)] font-semibold';
                                    } else {
                                        stateClass = 'text-[var(--text-error)] bg-[var(--bg-error)] rounded-[4px] font-semibold';
                                        extraStyles = { borderBottom: '2px solid var(--text-error)' };
                                    }
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
                                                className="char text-[var(--text-error)] opacity-80 border-b-[3px] border-[var(--text-error)] font-bold bg-[var(--bg-error)] rounded-sm"
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
