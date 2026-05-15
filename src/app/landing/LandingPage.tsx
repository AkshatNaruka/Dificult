'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatChip } from '@/components/ui/StatChip';

export default function LandingPage() {
    return (
        <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
            <Navbar />

            {/* Hero */}
            <section className="flex-1 flex flex-col items-center justify-center px-6 pt-32 pb-24 text-center relative overflow-hidden">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-20 blur-[120px] pointer-events-none" style={{ background: 'var(--accent)' }} />

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative z-10 max-w-3xl">
                    <span className="section-label block mb-4">The typing arena</span>
                    <h1 className="heading-display text-5xl md:text-7xl mb-6">
                        Type. Compete.<br />Dominate.
                    </h1>
                    <p className="text-body text-lg max-w-xl mx-auto mb-10" style={{ color: 'var(--text-secondary)' }}>
                        Master your keyboard with difficulty modes, real-time races, and tournaments. Track every keystroke. Climb the global leaderboard.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/" className="btn-primary !px-8 !py-3.5 !text-xs" style={{ textDecoration: 'none' }}>
                            Start Typing
                        </Link>
                        <Link href="/login" className="btn-secondary !px-8 !py-3.5 !text-xs" style={{ textDecoration: 'none' }}>
                            Create Account
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* Social proof stats */}
            <section className="py-16 px-6" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <div className="max-w-[900px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
                    <StatChip value="12K+" label="Active typists" size="lg" />
                    <StatChip value="180" label="Top WPM" unit="wpm" size="lg" />
                    <StatChip value="500K+" label="Tests completed" size="lg" />
                    <StatChip value="6" label="Difficulty modes" size="lg" />
                </div>
            </section>

            {/* Features */}
            <section className="py-24 px-6" style={{ background: 'var(--bg-surface)' }}>
                <div className="max-w-[1100px] mx-auto">
                    <SectionHeader label="Why Dificult" heading="Built for speed demons" subtitle="Not just another typing test. A competitive arena with real progression." />

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: 24,
                    }}>
                        {[
                            { icon: 'speed', title: 'Difficulty Modes', desc: 'From Easy to Sudden Death. No backspace, hidden text, instant fail — real gameplay restrictions with XP multipliers.' },
                            { icon: 'groups', title: 'Multiplayer Races', desc: 'Race friends or strangers in real-time. Watch their cursor advance as you type.' },
                            { icon: 'emoji_events', title: 'Tournaments', desc: 'Monthly sponsor-backed competitions with prize pools and leaderboard branding.' },
                            { icon: 'trending_up', title: 'Progress Tracking', desc: 'WPM history, accuracy trends, combo streaks, and achievement unlocks over time.' },
                            { icon: 'palette', title: 'Theme System', desc: '11 free themes. Premium themes transform the entire experience with unique aesthetics.' },
                            { icon: 'military_tech', title: 'Rank System', desc: 'Earn XP, level up, unlock achievements. Your rank is your reputation.' },
                        ].map(feature => (
                            <GlassCard key={feature.title} className="p-6">
                                <span className="material-symbols-outlined text-2xl mb-4 block" style={{ color: 'var(--accent)' }}>{feature.icon}</span>
                                <h3 className="heading-section text-base mb-2">{feature.title}</h3>
                                <p className="text-body">{feature.desc}</p>
                            </GlassCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-6 text-center">
                <h2 className="heading-display text-3xl md:text-5xl mb-4">Join the arena</h2>
                <p className="text-body mb-8">Free to play. No login required to start.</p>
                <Link href="/" className="btn-primary !px-10 !py-4 !text-xs" style={{ textDecoration: 'none' }}>
                    Start Your First Test
                </Link>
            </section>

            <Footer />
        </div>
    );
}
