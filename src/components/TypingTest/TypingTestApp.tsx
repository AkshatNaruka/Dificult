'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTypingEngine } from '../../hooks/useTypingEngine';
import { useThemeStore } from '../../store/themeStore';
import { usePlayerStore } from '@/store/playerStore';
import { WordDisplay } from './WordDisplay';
import { StatsScreen } from './StatsScreen';
import { ThemePicker } from '../ThemePicker';
import { SignUpPrompt } from '../SignUpPrompt';
import { DifficultyEffects } from './DifficultyEffects';
import { DifficultyWordEffects } from './DifficultyWordEffects';
import { ScreensaverBounce } from './ScreensaverBounce';
import { motion, AnimatePresence } from 'framer-motion';
import { AchievementBadges, achievementDefinitions, AchievementUnlockNotification } from '@/components/Gamification/AchievementBadges';
import { CelebrationEffects, Confetti } from '@/components/Gamification/CelebrationEffects';
import { SpecialModeSelector, gameModesDefinitions } from '@/components/Gamification/SpecialModes';
import { DailyStreakWidget } from '@/components/Gamification/DailyStreakWidget';
import { saveTestStats } from '@/app/actions/stats';
import { logout } from '@/app/login/actions';

import Link from 'next/link';

const difficultyMultipliers: Record<'normal' | 'hard' | 'insane' | 'chaos' | 'nightmare' | 'screensaver', number> = {
    normal: 1,
    hard: 1.2,
    insane: 1.5,
    chaos: 1.9,
    nightmare: 2.4,
    screensaver: 2.2,
};

const comboMilestones = [10, 25, 50, 75];

function buildShareText(params: {
    wpm: number;
    rawWpm: number;
    accuracy: number;
    timeTaken: number;
    combo: number;
    level: number;
    difficulty: string;
    mode: string;
}) {
    return [
        '⌨️ dificult run',
        `${params.wpm} WPM · ${params.accuracy}% accuracy · ${params.rawWpm} raw`,
        `combo ${params.combo} · level ${params.level} · ${params.difficulty} · ${params.mode}`,
        `${params.timeTaken}s on the clock`,
        'Try to beat me at dificult.com',
    ].join('\n');
}

type SpecialMode = keyof typeof gameModesDefinitions;

function checkAchievements(
    wpm: number,
    accuracy: number,
    combo: number,
    difficulty: string,
    level: number,
    streak: number,
    currentAchievements: string[]
): string[] {
    const newAchievements: string[] = [];

    if (wpm >= 50 && !currentAchievements.includes('speed_50')) newAchievements.push('speed_50');
    if (wpm >= 100 && !currentAchievements.includes('speed_100')) newAchievements.push('speed_100');
    if (accuracy >= 95 && !currentAchievements.includes('accuracy_95')) newAchievements.push('accuracy_95');
    if (accuracy === 100 && !currentAchievements.includes('accuracy_100')) newAchievements.push('accuracy_100');
    if (combo >= 25 && !currentAchievements.includes('combo_25')) newAchievements.push('combo_25');
    if (combo >= 50 && !currentAchievements.includes('combo_50')) newAchievements.push('combo_50');
    if (combo >= 100 && !currentAchievements.includes('combo_100')) newAchievements.push('combo_100');
    if (difficulty === 'nightmare' && !currentAchievements.includes('nightmare_complete')) newAchievements.push('nightmare_complete');
    if (level >= 5 && !currentAchievements.includes('level_5')) newAchievements.push('level_5');
    if (level >= 10 && !currentAchievements.includes('level_10')) newAchievements.push('level_10');
    if (streak >= 7 && !currentAchievements.includes('streak_7')) newAchievements.push('streak_7');
    if (streak >= 30 && !currentAchievements.includes('streak_30')) newAchievements.push('streak_30');

    return newAchievements;
}

export default function TypingTestApp({ user }: { user: { email?: string, id: string } | null }) {
    const engine = useTypingEngine();
    const themeStore = useThemeStore();
    const player = usePlayerStore(state => state.player);
    const initializePlayer = usePlayerStore(state => state.initializePlayer);
    const addTestResult = usePlayerStore(state => state.addTestResult);
    const completeDailyChallenge = usePlayerStore(state => state.completeDailyChallenge);
    const unlockAchievement = usePlayerStore(state => state.unlockAchievement);
    const hiddenInputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const seenComboMilestones = useRef(new Set<number>());
    const scoredRunKey = useRef<string | null>(null);
    const [rewardToast, setRewardToast] = useState<{ title: string; message: string; accent: string } | null>(null);
    const [specialMode, setSpecialMode] = useState<SpecialMode>('ranked');
    const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
    const [showAchievementNotification, setShowAchievementNotification] = useState<string | null>(null);
    const [triggerCelebration, setTriggerCelebration] = useState(false);

    useEffect(() => {
        if (engine.state !== 'idle') return;

        if (specialMode === 'sprint') {
            engine.setTestMode('time');
            engine.setTimeConfig(15);
        } else if (specialMode === 'endurance') {
            engine.setTestMode('time');
            engine.setTimeConfig(300);
        } else if (specialMode === 'zen') {
            engine.setTestMode('time');
            engine.setTimeConfig(9999);
        } else {
            engine.setTestMode('time');
            engine.setTimeConfig(30);
        }
    }, [engine, specialMode, engine.state]);

    useEffect(() => {
        initializePlayer();
    }, [initializePlayer]);

    const todayChallenge = useMemo(() => {
        if (!player) return null;
        const today = new Date().toISOString().split('T')[0];
        return player.dailyChallenges.find(challenge => challenge.date === today) || null;
    }, [player]);

    const focusInput = () => {
        hiddenInputRef.current?.focus();
    };

    // Apply theme on mount and whenever the active theme changes
    useEffect(() => {
        themeStore.applyTheme();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [themeStore.currentTheme]);

    // Save stats when game finishes
    useEffect(() => {
        if (engine.state === 'finished' && engine.history.length > 0) {
            const finalWpm = engine.history[engine.history.length - 1].wpm;

            let correctChars = 0;
            for (let i = 0; i < engine.typed.length; i++) {
                if (engine.typed[i] === engine.words[i]) correctChars++;
            }
            const accuracy = engine.typed.length > 0 ? Math.round((correctChars / engine.typed.length) * 100) : 100;
            const timeTaken = engine.history[engine.history.length - 1].time;

            if (user && user.id) {
                // Background save, no need to await in effect
                saveTestStats(finalWpm, accuracy, engine.testMode, timeTaken)
                    .catch(e => console.error("Failed to save stats:", e));
            }
        }
    }, [engine.state, engine.history, engine.typed, engine.words, engine.testMode, user]);
    useEffect(() => {
        focusInput();
        const handleGlobalClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'BUTTON' || target.closest('button') || target.tagName === 'SELECT') return;
            focusInput();
        };
        window.addEventListener('click', handleGlobalClick);
        return () => window.removeEventListener('click', handleGlobalClick);
    }, []);

    useEffect(() => {
        const handleGlobalKeydown = (e: KeyboardEvent) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                engine.restart();
                focusInput();
            }
        };
        window.addEventListener('keydown', handleGlobalKeydown);
        return () => window.removeEventListener('keydown', handleGlobalKeydown);
    }, [engine]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === ' ') e.preventDefault();
        if (e.key === 'Backspace') {
            e.preventDefault();
            engine.deleteChar(e.ctrlKey || e.metaKey);
        } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            engine.insertChar(e.key);
        }
    };

    const isFocused = engine.state === 'running';

    const finalWpm = engine.history.length > 0 ? engine.history[engine.history.length - 1].wpm : 0;
    const finalRaw = engine.history.length > 0 ? engine.history[engine.history.length - 1].rawWpm : 0;
    let correctChars = 0;
    for (let i = 0; i < engine.typed.length; i++) {
        if (engine.typed[i] === engine.words[i]) correctChars++;
    }
    const accuracy = engine.typed.length > 0 ? Math.round((correctChars / engine.typed.length) * 100) : 100;
    const timeTaken = engine.history.length > 0 ? engine.history[engine.history.length - 1].time : 0;
    const profileLevel = player?.stats.level ?? 1;
    const profileXp = player?.stats.xp ?? 0;
    const xpToNextLevel = profileLevel * 1000;
    const xpProgress = Math.min(100, Math.round((profileXp / xpToNextLevel) * 100));
    const currentCombo = engine.combo;
    const difficultyMultiplier = difficultyMultipliers[engine.difficulty];
    const modeMultiplier = gameModesDefinitions[specialMode].multiplier;
    const xpReward = engine.state === 'finished'
        ? Math.max(25, Math.round((finalWpm * 4 + accuracy * 2 + engine.maxCombo * 6 + timeTaken * 2) * difficultyMultiplier * modeMultiplier / 4))
        : 0;

    useEffect(() => {
        if (engine.state === 'idle') {
            seenComboMilestones.current = new Set();
            scoredRunKey.current = null;
        }
    }, [engine.state]);

    useEffect(() => {
        if (engine.state !== 'running') return;

        comboMilestones.forEach(milestone => {
            if (engine.combo >= milestone && !seenComboMilestones.current.has(milestone)) {
                seenComboMilestones.current.add(milestone);
                setRewardToast({
                    title: `${milestone} combo!`,
                    message: milestone >= 50 ? 'Absolute keyboard menace.' : 'The keyboard is now afraid of you.',
                    accent: milestone >= 50 ? 'var(--text-accent)' : 'orange',
                });
                window.setTimeout(() => setRewardToast(null), 1800);
            }
        });
    }, [engine.combo, engine.state]);

    useEffect(() => {
        if (engine.state !== 'finished' || engine.history.length === 0) return;

        const runKey = `${engine.testMode}:${engine.testType}:${engine.difficulty}:${engine.typed.length}:${timeTaken}:${finalWpm}:${accuracy}`;
        if (scoredRunKey.current === runKey) return;
        scoredRunKey.current = runKey;

        if (user?.id && player) {
            const today = new Date().toISOString().split('T')[0];
            const challenge = player.dailyChallenges.find(item => item.date === today);
            const challengeQualified = challenge
                ? (challenge.mode === 'speed' && finalWpm >= challenge.target) ||
                  (challenge.mode === 'accuracy' && accuracy >= challenge.target) ||
                  (challenge.mode === 'vowels' && finalWpm >= challenge.target) ||
                  (challenge.mode === 'numbers' && finalWpm >= challenge.target)
                : false;

            addTestResult({
                wpm: finalWpm,
                accuracy,
                mode: `${engine.testMode}:${engine.testType}:${engine.difficulty}`,
                duration: timeTaken,
                charactersTyped: engine.typed.length,
                xpGained: xpReward,
            });

            if (challengeQualified && challenge && !challenge.completed) {
                completeDailyChallenge(challenge.mode === 'accuracy' ? accuracy : finalWpm);
                setRewardToast({
                    title: 'Daily challenge complete!',
                    message: `${challenge.reward} XP added to your run.`,
                    accent: 'var(--text-accent)',
                });
                window.setTimeout(() => setRewardToast(null), 2200);
            }
        }

        setRewardToast({
            title: `Run complete: level ${profileLevel}`,
            message: `+${xpReward} XP earned${engine.difficulty === 'nightmare' ? ' for surviving nightmare mode.' : '.'}`,
            accent: 'var(--text-accent)',
        });
        window.setTimeout(() => setRewardToast(null), 2200);

        // Check for new achievements
        const newAchs = checkAchievements(
            finalWpm,
            accuracy,
            engine.maxCombo,
            engine.difficulty,
            profileLevel,
            player?.stats.streak ?? 0,
            player?.achievements ?? []
        );

        if (newAchs.length > 0) {
            newAchs.forEach((ach, idx) => {
                setTimeout(() => {
                    setShowAchievementNotification(ach);
                    setTriggerCelebration(true);
                    unlockAchievement(ach);
                    setTimeout(() => setTriggerCelebration(false), 2000);
                    setTimeout(() => setShowAchievementNotification(null), 4500);
                }, idx * 1500);
            });
            player?.achievements && setUnlockedAchievements([...player.achievements, ...newAchs]);
        }
    }, [engine.state, engine.history.length, engine.difficulty, engine.testMode, engine.testType, finalWpm, accuracy, timeTaken, xpReward, player, user, addTestResult, completeDailyChallenge, profileLevel, engine.typed.length]);

    return (
        <div
            className="min-h-screen flex flex-col transition-colors duration-300"
            style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
        >
            <input
                ref={hiddenInputRef}
                type="text"
                className="absolute w-0 h-0 opacity-0 pointer-events-none"
                onKeyDown={handleKeyDown}
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck="false"
                readOnly
            />

            {/* ── Difficulty Effects ── */}
            <DifficultyEffects difficulty={engine.difficulty} typed={engine.typed} />
            <DifficultyWordEffects difficulty={engine.difficulty} words={engine.words} typed={engine.typed} />

            {/* ── Celebration Effects ── */}
            <CelebrationEffects trigger={triggerCelebration} type="achievement" />
            <AnimatePresence>
                {showAchievementNotification && (
                    <AchievementUnlockNotification id={showAchievementNotification} />
                )}
            </AnimatePresence>

            {/* ── Top Navbar ── */}
            <motion.nav
                animate={{ opacity: isFocused ? 0 : 1, y: isFocused ? -10 : 0 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="w-full flex items-center justify-between px-10 py-5"
                style={{ borderBottom: '1px solid var(--border-glass)' }}
            >
                {/* Logo */}
                <Link
                    href="/"
                    onClick={() => {
                        engine.restart();
                        focusInput();
                    }}
                    className="text-2xl font-bold tracking-tight select-none font-typing hover:opacity-80 transition-opacity decoration-transparent"
                    style={{ color: 'var(--text-primary)' }}
                >
                    difi<span style={{ color: 'var(--text-accent)' }}>cult</span>
                </Link>

                {/* Right controls */}
                <div className="flex items-center gap-5 relative">
                    {/* Theme Picker */}
                    <ThemePicker />

                    {/* Mute Button */}
                    <button
                        onClick={() => themeStore.toggleMute()}
                        style={{
                            background: 'var(--bg-secondary)',
                            color: 'var(--text-main)',
                            border: '1px solid var(--border-glass)',
                            borderRadius: '8px',
                            padding: '5px 8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            transition: 'border-color 0.2s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--text-accent)')}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-glass)')}
                        title={themeStore.isMuted ? 'Unmute' : 'Mute'}
                    >
                        {themeStore.isMuted ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                                <line x1="23" y1="9" x2="17" y2="15" />
                                <line x1="17" y1="9" x2="23" y2="15" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                            </svg>
                        )}
                    </button>

                    {/* Leaderboard Link */}
                    <Link
                        href="/leaderboard"
                        className="font-typing text-sm font-bold flex items-center gap-2 hover:opacity-80 transition-opacity decoration-transparent"
                        style={{ color: 'var(--text-main)' }}
                        title="Leaderboard"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 20h20"></path>
                            <path d="M5 20v-5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v5"></path>
                            <path d="M13 20v-9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v9"></path>
                        </svg>
                    </Link>

                    {/* User Auth */}
                    {user ? (
                        <div className="flex items-center gap-3">
                            <Link
                                href="/profile"
                                className="font-typing text-sm flex items-center gap-2 hover:opacity-80 transition-opacity decoration-transparent"
                                style={{ color: 'var(--text-main)' }}
                                title="Profile"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                            </Link>
                            <form>
                                <button
                                    formAction={logout}
                                    className="font-typing text-xs px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
                                    style={{ color: 'var(--text-main)', background: 'none', border: '1px solid var(--border-glass)', cursor: 'pointer', opacity: 0.6 }}
                                >
                                    Log out
                                </button>
                            </form>
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="font-typing text-sm font-bold px-4 py-1.5 rounded-lg transition-all hover:scale-[1.02] active:scale-[0.98] decoration-transparent"
                            style={{ background: 'var(--text-accent)', color: 'var(--bg-primary)' }}
                        >
                            Sign In
                        </Link>
                    )}
                </div>
            </motion.nav>

            {/* ── Main centered content ── */}
            <main className="flex flex-col items-center justify-center flex-1 w-full px-6 pb-12">
                <AnimatePresence mode="wait">
                    {engine.state === 'finished' ? (
                        <motion.div
                            key="stats"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="w-[60vw] min-w-[320px] max-w-[800px]"
                        >
                            <StatsScreen
                                wpm={finalWpm}
                                rawWpm={finalRaw}
                                accuracy={accuracy}
                                history={engine.history}
                                shareText={buildShareText({
                                    wpm: finalWpm,
                                    rawWpm: finalRaw,
                                    accuracy,
                                    timeTaken,
                                    combo: engine.maxCombo,
                                    level: profileLevel,
                                    difficulty: engine.difficulty,
                                    mode: specialMode,
                                })}
                                onRestart={() => {
                                    engine.restart();
                                    focusInput();
                                }}
                                timeTaken={timeTaken}
                            />
                            {/* Soft sign-up prompt for guests */}
                            {!user && <SignUpPrompt wpm={finalWpm} accuracy={accuracy} />}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="typing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-[60vw] min-w-[320px] max-w-[800px] flex flex-col items-center gap-4"
                        >
                            {/* ═════ MINIMAL CONTROLS BAR (MonkeyType Style) ═════ */}
                            <motion.div
                                animate={{ opacity: isFocused ? 0 : 1, y: isFocused ? -4 : 0 }}
                                transition={{ duration: 0.3 }}
                                className="w-full flex items-center gap-4 rounded-lg p-3"
                                style={{ 
                                    background: 'rgba(255,255,255,0.02)', 
                                    border: '1px solid var(--border-glass)'
                                }}
                            >
                                {/* Test Type - Compact */}
                                <div className="flex items-center gap-1.5 text-xs">
                                    <span className="opacity-50 font-mono" style={{ color: 'var(--text-main)' }}>type</span>
                                    <div className="flex gap-1">
                                        {(['words', 'numbers', 'symbols', 'javascript', 'python'] as const).map(type => (
                                            <button
                                                key={type}
                                                onClick={() => engine.setTestType(type)}
                                                className="px-1.5 py-0.5 rounded transition-all duration-150 text-[10px]"
                                                style={{
                                                    color: engine.testType === type ? 'var(--text-accent)' : 'var(--text-main)',
                                                    background: engine.testType === type ? 'rgba(82, 82, 82, 0.3)' : 'transparent',
                                                    cursor: 'pointer',
                                                    opacity: engine.testType === type ? 1 : 0.6,
                                                }}
                                            >
                                                {type === 'javascript' ? 'js' : type === 'python' ? 'py' : type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Divider */}
                                <div style={{ width: '1px', height: '20px', background: 'var(--border-glass)', opacity: 0.3 }} />

                                {/* Duration - Compact */}
                                <div className="flex items-center gap-1.5 text-xs">
                                    <span className="opacity-50 font-mono" style={{ color: 'var(--text-main)' }}>
                                        {engine.testMode === 'time' ? '⏱️' : '📖'}
                                    </span>
                                    <div className="flex gap-1">
                                        {(engine.testMode === 'time' ? [15, 30, 60] : [10, 25, 50]).map(val => (
                                            <button
                                                key={val}
                                                onClick={() => engine.testMode === 'time' ? engine.setTimeConfig(val) : engine.setWordConfig(val)}
                                                className="px-1.5 py-0.5 rounded transition-all duration-150 text-[10px] font-mono"
                                                style={{
                                                    color: (engine.testMode === 'time' ? engine.timeConfig : engine.wordConfig) === val ? 'var(--text-accent)' : 'var(--text-main)',
                                                    background: (engine.testMode === 'time' ? engine.timeConfig : engine.wordConfig) === val ? 'rgba(82, 82, 82, 0.3)' : 'transparent',
                                                    cursor: 'pointer',
                                                    opacity: (engine.testMode === 'time' ? engine.timeConfig : engine.wordConfig) === val ? 1 : 0.6,
                                                }}
                                            >
                                                {val}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Divider */}
                                <div style={{ width: '1px', height: '20px', background: 'var(--border-glass)', opacity: 0.3 }} />

                                {/* Difficulty - Compact Icons Only */}
                                <div className="flex items-center gap-2 text-xs">
                                    <span className="opacity-50 font-mono" style={{ color: 'var(--text-main)' }}>diff</span>
                                    <div className="flex gap-1.5">
                                        {(['normal', 'hard', 'insane', 'chaos', 'nightmare', 'screensaver'] as const).map(diff => (
                                            <button
                                                key={diff}
                                                onClick={() => engine.setDifficulty(diff)}
                                                className="w-6 h-6 flex items-center justify-center rounded transition-all duration-150 text-sm"
                                                style={{
                                                    background: engine.difficulty === diff ? 'rgba(82, 82, 82, 0.3)' : 'transparent',
                                                    border: engine.difficulty === diff ? '1px solid var(--text-accent)' : '1px solid transparent',
                                                    cursor: 'pointer',
                                                    opacity: engine.difficulty === diff ? 1 : 0.6,
                                                }}
                                                title={diff}
                                            >
                                                {diff === 'normal' ? '🎯' : diff === 'hard' ? '😤' : diff === 'insane' ? '🤪' : diff === 'chaos' ? '🌪️' : diff === 'nightmare' ? '👿' : '🌀'}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Spacer */}
                                <div className="flex-1" />

                                {/* Level Badge - Right Side */}
                                {player && (
                                    <div className="flex items-center gap-2 px-2 py-1 rounded" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-glass)' }}>
                                        <span className="text-xs opacity-60">lvl</span>
                                        <span className="text-sm font-bold" style={{ color: 'var(--text-accent)' }}>{profileLevel}</span>
                                    </div>
                                )}
                            </motion.div>

                            {/* Live timer / word counter — centered below nav */}
                            <motion.div
                                animate={{ opacity: isFocused ? 1 : 0 }}
                                transition={{ duration: 0.25 }}
                                className="w-full flex justify-center select-none pointer-events-none relative mb-6"
                                style={{ minHeight: '72px' }}
                            >
                                <span
                                    className="font-typing font-bold"
                                    style={{ color: 'var(--text-accent)', fontSize: '72px', lineHeight: 1, letterSpacing: '-0.03em' }}
                                >
                                    {engine.testMode === 'time'
                                        ? engine.timeLeft
                                        : `${engine.typed.split(' ').filter(Boolean).length}/${engine.wordConfig}`}
                                </span>
                            </motion.div>

                            {/* Words area */}
                            <ScreensaverBounce difficulty={engine.difficulty} className="w-full">
                                <motion.div
                                    className="w-full transition-all duration-500 rounded-3xl p-8 cursor-text"
                                    ref={containerRef}
                                    onClick={focusInput}
                                    animate={{ scale: engine.combo >= 20 ? 1.01 : 1 }}
                                >
                                    <WordDisplay words={engine.words} typed={engine.typed} difficulty={engine.difficulty} />
                                </motion.div>
                            </ScreensaverBounce>

                            <AnimatePresence>
                                {rewardToast && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.96 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                        className="fixed bottom-6 right-6 z-50 max-w-sm rounded-2xl px-4 py-3 border backdrop-blur-md shadow-2xl"
                                        style={{
                                            background: 'rgba(10,10,10,0.88)',
                                            borderColor: 'var(--border-glass)',
                                            color: 'var(--text-primary)',
                                            boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 20px 50px rgba(0,0,0,0.35)',
                                        }}
                                    >
                                        <div className="text-xs uppercase tracking-[0.22em] opacity-60 mb-1" style={{ color: rewardToast.accent }}>{rewardToast.title}</div>
                                        <div className="text-sm" style={{ color: 'var(--text-main)' }}>{rewardToast.message}</div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Combo / On Fire UI - Moved below the typing area */}
                            <div className="h-12 flex items-center justify-center w-full mt-[120px]">
                                <AnimatePresence>
                                    {engine.combo >= 20 && engine.state === 'running' && (
                                        <motion.div
                                            key="combo"
                                            initial={{ opacity: 0, y: -10, scale: 0.9 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -10, scale: 0.9 }}
                                            className="flex items-center gap-2 font-typing font-bold text-orange-500 bg-orange-500/10 px-4 py-2 rounded-full backdrop-blur-sm z-10"
                                            style={{ textShadow: '0 0 10px rgba(249, 115, 22, 0.5)' }}
                                        >
                                            <span className="text-xl">🔥</span>
                                            <span>ON FIRE! {engine.combo} Combo</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Restart hint */}
                            <motion.div
                                animate={{ opacity: isFocused ? 0 : 0.5 }}
                                transition={{ duration: 0.3 }}
                                className="flex items-center gap-2 text-sm font-typing mt-[120px]"
                                style={{ color: 'var(--text-main)' }}
                            >
                                <span
                                    className="px-2 py-1 rounded text-xs"
                                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)' }}
                                >
                                    tab
                                </span>
                                <span>+</span>
                                <span
                                    className="px-2 py-1 rounded text-xs"
                                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)' }}
                                >
                                    enter
                                </span>
                                <span style={{ opacity: 0.7 }}>— restart test</span>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
