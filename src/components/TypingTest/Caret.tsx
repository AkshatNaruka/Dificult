'use client';

import { motion } from 'framer-motion';

interface CaretProps {
    top: number;
    left: number;
}

export function Caret({ top, left }: CaretProps) {
    return (
        <motion.div
            initial={false}
            animate={{ top, left }}
            transition={{ type: "spring", stiffness: 1000, damping: 50, mass: 0.1 }}
            className="absolute w-[2px] h-[1.2em] bg-[var(--text-accent)] rounded-sm z-20"
        >
            <motion.div
                animate={{ opacity: [1, 0, 1] }}
                transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
                className="w-full h-full bg-[var(--text-accent)] rounded-sm"
            />
        </motion.div>
    );
}
