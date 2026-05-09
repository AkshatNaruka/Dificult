'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TipsCarousel } from './Gamification/TipsCarousel';
import { QuickStartGuide } from './Gamification/QuickStartGuide';
import { FeatureShowcase } from './Gamification/FeatureShowcase';
import { AdPlaceholder } from './Gamification/AdPlaceHolder';

export function LandingHero() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
        >
            {/* Main Hero Section */}
            <div className="text-center space-y-4">
                <h1 className="text-5xl md:text-6xl font-bold">
                    <span style={{ background: 'linear-gradient(135deg, #8B5CF6, #F97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Type at Lightning Speed
                    </span>
                </h1>
                <p className="text-xl" style={{ color: 'var(--text-main)', opacity: 0.8 }}>
                    Master your keyboard. Build streaks. Climb the leaderboard. <br />
                    <span style={{ color: 'var(--text-accent)' }}>No login required to start.</span>
                </p>
            </div>

            {/* Stats Grid */}
            <motion.div className="grid grid-cols-3 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                {[
                    { icon: '🎯', label: 'Accuracy', value: '99%' },
                    { icon: '⚡', label: 'Speed', value: '150+ WPM' },
                    { icon: '🔥', label: 'Combo', value: '1000+' },
                ].map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="text-center p-4 rounded-lg"
                        style={{ background: 'var(--bg-secondary)' }}
                    >
                        <div className="text-3xl mb-2">{stat.icon}</div>
                        <div className="text-sm" style={{ color: 'var(--text-main)', opacity: 0.7 }}>
                            {stat.label}
                        </div>
                        <div className="text-xl font-bold mt-1" style={{ color: 'var(--text-accent)' }}>
                            {stat.value}
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Tips Carousel */}
            <div className="max-w-2xl mx-auto">
                <TipsCarousel />
            </div>

            {/* Quick Start Guide */}
            <div className="max-w-2xl mx-auto">
                <QuickStartGuide />
            </div>

            {/* Feature Showcase */}
            <div className="max-w-4xl mx-auto">
                <FeatureShowcase />
            </div>

            {/* Call to Action */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center"
            >
                <p style={{ color: 'var(--text-main)', opacity: 0.6 }} className="text-sm">
                    ↓ Scroll down to start typing ↓
                </p>
            </motion.div>
        </motion.div>
    );
}
