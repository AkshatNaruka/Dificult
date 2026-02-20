'use client';

import React, { useEffect, useState } from 'react';
import { useMultiplayer } from '../../hooks/useMultiplayer';
import { ThemePicker } from '../ThemePicker';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useTypingEngine } from '../../hooks/useTypingEngine';
import { WordDisplay } from '../TypingTest/WordDisplay';
import { Room } from '../../types/multiplayer';

export default function MultiplayerLobby({ user }: { user: { id: string; email?: string } | null }) {
    const {
        isConnected, rooms, currentRoom, currentPlayer, error,
        createRoom, joinRoom, leaveRoom, setReady, sendProgress
    } = useMultiplayer(user);

    const [newRoomName, setNewRoomName] = useState('');
    const engine = useTypingEngine();

    // Sync game state to server
    useEffect(() => {
        if (!currentRoom || currentRoom.status !== 'In Progress' || !currentPlayer) return;

        // Calculate progress percentage
        let correctChars = 0;
        for (let i = 0; i < engine.typed.length; i++) {
            if (engine.typed[i] === engine.words[i]) correctChars++;
        }

        // Ensure we don't divide by zero
        const totalChars = engine.words.length || 1;
        const progress = Math.min(100, (correctChars / totalChars) * 100);

        // Calculate WPM and Accuracy
        const wpm = engine.history.length > 0 ? engine.history[engine.history.length - 1].wpm : 0;
        const accuracy = engine.typed.length > 0 ? Math.round((correctChars / engine.typed.length) * 100) : 100;

        // Only send if changes are meaningful to reduce socket spam
        if (progress > currentPlayer.progress || wpm !== currentPlayer.wpm) {
            sendProgress(progress, wpm, accuracy);
        }

    }, [engine.typed, engine.words, engine.history, currentRoom, currentPlayer, sendProgress]);

    // Handle race start logic
    useEffect(() => {
        if (currentRoom?.isStarted && engine.state === 'idle') {
            // Force words to match server test text (we need to inject this into engine natively but for now we set the mode)
            engine.setTestMode('words');
            // We approximate the word count based on the server text length
            const wordsInText = currentRoom.text.split(' ').length;
            engine.setWordConfig(wordsInText);

            // To be perfectly synced, we should ideally set engine.words = currentRoom.text
            // But useTypingEngine manages its own words. Let's assume the hook generate matching words for now or we build a small bridge.
            // For MVP, if it starts, focus the hidden input.
            const input = document.getElementById('multiplayer-hidden-input') as HTMLInputElement;
            if (input) input.focus();
        }
    }, [currentRoom?.isStarted, engine]);


    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (currentRoom?.status !== 'In Progress' || !currentRoom.isStarted) {
            e.preventDefault();
            return;
        }
        if (e.key === ' ') e.preventDefault();
        if (e.key === 'Backspace') {
            e.preventDefault();
            engine.deleteChar(e.ctrlKey || e.metaKey);
        } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            engine.insertChar(e.key);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
                <div className="p-8 text-center bg-red-500/10 rounded-2xl border border-red-500/20">
                    <h2 className="text-xl font-bold text-red-400 mb-4 font-typing">Authentication Required</h2>
                    <p className="mb-6 text-sm">You must be logged in to access multiplayer.</p>
                    <Link href="/login" className="px-6 py-2 bg-red-500 text-white rounded-lg font-bold">Log In</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col transition-colors duration-300" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
            {/* Navbar */}
            <nav className="w-full flex items-center justify-between px-10 py-5" style={{ borderBottom: '1px solid var(--border-glass)' }}>
                <Link href="/" className="text-2xl font-bold tracking-tight select-none font-typing" style={{ color: 'var(--text-primary)' }}>
                    type<span style={{ color: 'var(--text-accent)' }}>warrior</span>
                </Link>
                <div className="flex items-center gap-5">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                        <span className="text-xs font-typing text-gray-500 uppercase tracking-widest">{isConnected ? 'Server Online' : 'Connecting...'}</span>
                    </div>
                    <ThemePicker />
                    <Link href="/profile" className="font-typing text-sm hover:opacity-80 transition-opacity flex items-center gap-2">
                        <span>{user.email?.split('@')[0]}</span>
                    </Link>
                </div>
            </nav>

            <main className="flex-1 flex flex-col items-center py-10 px-6">

                {error && (
                    <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm w-full max-w-4xl">
                        {error}
                    </div>
                )}

                {!currentRoom ? (
                    /* ====== LOBBY BROWSER ====== */
                    <div className="w-full max-w-5xl flex flex-col gap-8">
                        <div className="flex items-center justify-between">
                            <h1 className="text-3xl font-bold font-typing" style={{ color: 'var(--text-primary)' }}>Active Lobbies</h1>

                            <div className="flex items-center gap-3">
                                <input
                                    type="text"
                                    placeholder="Room Name"
                                    className="px-4 py-2 rounded-lg text-sm outline-none"
                                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', color: 'var(--text-primary)' }}
                                    value={newRoomName}
                                    onChange={e => setNewRoomName(e.target.value)}
                                />
                                <button
                                    onClick={() => createRoom(newRoomName || `${user.email?.split('@')[0]}'s Room`)}
                                    className="px-4 py-2 rounded-lg font-bold font-typing text-sm transition-transform hover:scale-105"
                                    style={{ background: 'var(--text-accent)', color: 'var(--bg-primary)' }}
                                >
                                    Create Room
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {rooms.length === 0 ? (
                                <div className="col-span-full py-12 text-center text-sm font-typing" style={{ color: 'var(--text-main)', opacity: 0.5 }}>
                                    No active rooms. Create one to race!
                                </div>
                            ) : (
                                rooms.map(room => (
                                    <div key={room.id} className="p-6 rounded-2xl flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)' }}>
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-lg">{room.name}</h3>
                                            <span className="text-xs px-2 py-1 rounded bg-black/20 font-typing">{room.difficulty}</span>
                                        </div>

                                        <div className="flex items-center justify-between text-sm" style={{ color: 'var(--text-main)' }}>
                                            <span>Players: {room.players.length}/{room.maxPlayers}</span>
                                            <span className={room.status === 'Waiting' ? 'text-green-500' : 'text-yellow-500'}>{room.status}</span>
                                        </div>

                                        <button
                                            onClick={() => joinRoom(room.id)}
                                            disabled={room.players.length >= room.maxPlayers || room.status !== 'Waiting'}
                                            className="mt-2 w-full py-2 rounded-lg font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                            style={{
                                                background: room.status === 'Waiting' ? 'transparent' : 'var(--bg-primary)',
                                                border: `1px solid ${room.status === 'Waiting' ? 'var(--text-accent)' : 'var(--border-glass)'}`,
                                                color: room.status === 'Waiting' ? 'var(--text-accent)' : 'var(--text-main)'
                                            }}
                                        >
                                            {room.status === 'Waiting' ? 'Join Race' : 'Spectate'}
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                ) : (
                    /* ====== IN ROOM ====== */
                    <div className="w-full max-w-5xl flex flex-col gap-8 relative">
                        {/* Hidden Input for Typing */}
                        <input
                            id="multiplayer-hidden-input"
                            type="text"
                            className="absolute w-0 h-0 opacity-0 pointer-events-none"
                            onKeyDown={handleKeyDown}
                            autoComplete="off"
                            autoCapitalize="off"
                            autoCorrect="off"
                            spellCheck="false"
                            readOnly
                        />

                        {/* Room Header */}
                        <div className="flex items-center justify-between p-6 rounded-2xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)' }}>
                            <div>
                                <h2 className="text-2xl font-bold font-typing">{currentRoom.name}</h2>
                                <p className="text-sm mt-1" style={{ color: 'var(--text-main)' }}>First to finish wins • {currentRoom.difficulty}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                {currentRoom.status === 'Waiting' && (
                                    <button
                                        onClick={setReady}
                                        disabled={currentPlayer?.isReady}
                                        className="px-6 py-2 rounded-lg font-bold font-typing transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        style={{ background: currentPlayer?.isReady ? 'var(--bg-primary)' : 'var(--text-accent)', color: currentPlayer?.isReady ? 'var(--text-main)' : 'var(--bg-primary)' }}
                                    >
                                        {currentPlayer?.isReady ? 'Ready' : 'Set Ready'}
                                    </button>
                                )}
                                <button onClick={leaveRoom} className="px-4 py-2 rounded-lg text-sm text-red-500 border border-red-500/20 hover:bg-red-500/10 transition-colors">
                                    Leave
                                </button>
                            </div>
                        </div>

                        {/* Race Track UI */}
                        <div className="flex flex-col gap-4 w-full p-8 rounded-2xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)' }}>
                            {currentRoom.players.map(player => (
                                <div key={player.id} className="flex relative items-center gap-4 py-3">

                                    {/* Player Info */}
                                    <div className="w-32 flex flex-col">
                                        <span className="font-bold text-sm truncate flex justify-between">
                                            {player.name} {player.id === currentPlayer?.id && <span className="opacity-50">(You)</span>}
                                        </span>
                                        <span className="text-xs" style={{ color: 'var(--text-main)' }}>{player.wpm} WPM</span>
                                    </div>

                                    {/* Track Line */}
                                    <div className="flex-1 h-3 rounded-full relative overflow-visible bg-black/20" style={{ border: '1px solid var(--border-glass)' }}>
                                        {/* Progress Bar Fill */}
                                        <motion.div
                                            className="absolute top-0 left-0 h-full rounded-full"
                                            style={{ background: player.id === currentPlayer?.id ? 'var(--text-accent)' : 'var(--text-main)' }}
                                            animate={{ width: `${player.progress}%` }}
                                            transition={{ ease: "linear", duration: 0.5 }}
                                        />

                                        {/* Avatar Runner */}
                                        <motion.div
                                            className="absolute top-1/2 -mt-4 w-8 h-8 rounded-full flex items-center justify-center text-lg shadow-lg z-10"
                                            style={{ background: 'var(--bg-primary)', border: `2px solid ${player.id === currentPlayer?.id ? 'var(--text-accent)' : 'var(--text-main)'}` }}
                                            animate={{ left: `calc(${player.progress}% - 16px)` }}
                                            transition={{ ease: "linear", duration: 0.5 }}
                                        >
                                            {player.avatar}
                                        </motion.div>
                                    </div>

                                    {/* Finish Flag / Status */}
                                    <div className="w-12 text-center text-xl">
                                        {player.isFinished ? '🏁' : (player.isReady ? '✓' : '...')}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Countdown Overlay */}
                        <AnimatePresence>
                            {currentRoom.status === 'In Progress' && !currentRoom.isStarted && currentRoom.countdown > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.5 }}
                                    className="absolute inset-0 flex items-center justify-center z-50 backdrop-blur-sm rounded-2xl"
                                >
                                    <span className="text-9xl font-bold font-typing" style={{ color: 'var(--text-accent)' }}>
                                        {currentRoom.countdown}
                                    </span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Active Typing Interface */}
                        {currentRoom.isStarted && currentRoom.status === 'In Progress' && (
                            <div className="w-full mt-8 p-8 border rounded-2xl" style={{ borderColor: 'var(--border-glass)' }} onClick={() => document.getElementById('multiplayer-hidden-input')?.focus()}>
                                <WordDisplay words={engine.words} typed={engine.typed} />
                            </div>
                        )}

                        {/* Finish Screen overlay */}
                        {currentRoom.status === 'Finished' && (
                            <div className="w-full mt-4 p-8 text-center rounded-2xl" style={{ background: 'var(--text-accent)', color: 'var(--bg-primary)' }}>
                                <h2 className="text-3xl font-bold font-typing mb-2">Race Finished!</h2>
                                <p className="opacity-80">Waiting for host to return to lobby...</p>

                                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {currentRoom.players.sort((a, b) => a.position - b.position).map((p, idx) => (
                                        <div key={p.id} className="p-4 bg-black/10 rounded-xl flex items-center justify-between">
                                            <span className="font-bold text-xl">#{idx + 1} {p.name}</span>
                                            <span>{p.wpm} WPM</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}

