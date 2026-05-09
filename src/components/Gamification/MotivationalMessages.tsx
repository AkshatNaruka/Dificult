'use client';

import React, { useEffect, useState } from 'react';

const motivationalMessages = [
    "Your fingers are on fire! 🔥",
    "The keyboard can't stop you now!",
    "Speed demon incoming!",
    "Break records, not wrists!",
    "You\'re typing faster than light!",
    "Competitors beware!",
    "This is what peak performance looks like.",
    "Your typing teacher would be proud.",
    "Console.log(\'You\'re awesome\');",
    "sudo make_me_type_faster",
    "One does not simply type slowly.",
    "You\'re a typing wizard! 🧙",
    "Plot twist: You\'re actually fast.",
    "Is it possible to learn this power?",
    "Your fingers are legendary.",
];

const funnyFailureMessages = [
    "Oops. We all have those moments.",
    "It happens to the best of us.",
    "Even champions stumble.",
    "Small typo, big lesson.",
    "Room for improvement! 💪",
    "That keyboard fight was intense.",
    "Next time you got this!",
];

export function useMotivationalMessage(wpm?: number, accuracy?: number): string {
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (wpm !== undefined && accuracy !== undefined) {
            let msgs = motivationalMessages;
            if (accuracy < 90) {
                msgs = funnyFailureMessages;
            }
            setMessage(msgs[Math.floor(Math.random() * msgs.length)]);
        }
    }, [wpm, accuracy]);

    return message;
}

export function MotivationalBubble({ message }: { message: string }) {
    if (!message) return null;

    return (
        <div className="text-center py-3 px-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30 text-sm italic" style={{ color: 'var(--text-main)' }}>
            "{message}"
        </div>
    );
}
