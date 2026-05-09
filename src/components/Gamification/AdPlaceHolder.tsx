'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AdPlaceholderProps {
    variant: 'sidebar' | 'banner' | 'box';
}

export function AdPlaceholder({ variant }: AdPlaceholderProps) {
    const placeholderConfigs = {
        sidebar: {
            width: 'w-64',
            height: 'h-screen',
            innerWidth: '300px',
            innerHeight: '600px',
        },
        banner: {
            width: 'w-full',
            height: 'h-24',
            innerWidth: '100%',
            innerHeight: '100px',
        },
        box: {
            width: 'w-80',
            height: 'h-80',
            innerWidth: '320px',
            innerHeight: '320px',
        },
    };

    const config = placeholderConfigs[variant];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`${config.width} ${config.height} rounded-lg border-2 border-dashed flex items-center justify-center bg-gradient-to-br from-gray-900 to-black`}
            style={{
                borderColor: 'rgba(255,255,255,0.1)',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))',
            }}
        >
            <div className="text-center px-4">
                <div className="text-sm opacity-40" style={{ color: 'var(--text-main)' }}>
                    📍 Ad Space
                </div>
                <div className="text-xs opacity-30 mt-2" style={{ color: 'var(--text-main)' }}>
                    {variant === 'sidebar' && '300x600'}
                    {variant === 'banner' && '728x90 or responsive'}
                    {variant === 'box' && '320x320'}
                </div>
                <div className="text-xs opacity-20 mt-3 max-w-sm" style={{ color: 'var(--text-main)' }}>
                    High-quality placements coming soon as we scale traffic
                </div>
            </div>
        </motion.div>
    );
}
