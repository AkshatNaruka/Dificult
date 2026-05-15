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
            className="absolute z-20"
        >
            <div className="caret-pulse" />
        </motion.div>
    );
}
