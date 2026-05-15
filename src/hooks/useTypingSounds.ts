'use client';

import { useCallback, useRef } from 'react';
import { useThemeStore } from '../store/themeStore';

// ── Sound profiles ────────────────────────────────────────────────────────────

export type SoundProfile = 'default' | 'mechanical' | 'typewriter' | 'soft' | 'clicky' | 'retro';

export interface SoundConfig {
    id: SoundProfile;
    name: string;
    description: string;
    access: 'free' | 'premium';
}

export const soundProfiles: SoundConfig[] = [
    { id: 'default',    name: 'Default',        description: 'Clean digital click',          access: 'free' },
    { id: 'mechanical', name: 'Mechanical',      description: 'Heavy Cherry MX-style thock',  access: 'free' },
    { id: 'typewriter', name: 'Typewriter',      description: 'Vintage typewriter clack',     access: 'free' },
    { id: 'soft',       name: 'Soft',            description: 'Whisper-quiet dampened tap',   access: 'free' },
    { id: 'clicky',     name: 'Clicky Blue',     description: 'Crisp Blue-switch click',      access: 'premium' },
    { id: 'retro',      name: 'Retro Arcade',    description: '8-bit beeper vibes',           access: 'premium' },
];

// ── Individual profile audio generators ─────────────────────────────────────

function playDefault(ctx: AudioContext) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.28, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + 0.05);
}

function playMechanical(ctx: AudioContext) {
    // White noise burst + pitched tone = mechanical thock
    const bufSize = ctx.sampleRate * 0.04;
    const buffer = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufSize, 3);
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.35, ctx.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
    noise.connect(noiseGain); noiseGain.connect(ctx.destination);
    noise.start();

    // Low thud body
    const osc = ctx.createOscillator();
    const og = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.06);
    og.gain.setValueAtTime(0.4, ctx.currentTime);
    og.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
    osc.connect(og); og.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + 0.06);
}

function playTypewriter(ctx: AudioContext) {
    // Sharp attack + metallic ring
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sawtooth';
    osc2.type = 'square';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.03);
    osc2.frequency.setValueAtTime(600, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.04);
    g.gain.setValueAtTime(0.18, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.connect(g); osc2.connect(g); g.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + 0.08);
    osc2.start(); osc2.stop(ctx.currentTime + 0.08);
}

function playSoft(ctx: AudioContext) {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.04);
    g.gain.setValueAtTime(0.12, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
    osc.connect(g); g.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + 0.04);
}

function playClicky(ctx: AudioContext) {
    // Two-stage click: sharp transient + resonant click
    const bufSize = ctx.sampleRate * 0.006;
    const buffer = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1);
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.5, ctx.currentTime);
    ng.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.006);
    noise.connect(ng); ng.connect(ctx.destination);
    noise.start();

    const osc = ctx.createOscillator();
    const og = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1800, ctx.currentTime + 0.006);
    osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.02);
    og.gain.setValueAtTime(0.3, ctx.currentTime + 0.006);
    og.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.025);
    osc.connect(og); og.connect(ctx.destination);
    osc.start(ctx.currentTime + 0.006); osc.stop(ctx.currentTime + 0.025);
}

function playRetro(ctx: AudioContext) {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.setValueAtTime(660, ctx.currentTime + 0.02);
    g.gain.setValueAtTime(0.15, ctx.currentTime);
    g.gain.setValueAtTime(0.15, ctx.currentTime + 0.04);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);
    osc.connect(g); g.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + 0.07);
}

// Error sounds per profile

function playErrorDefault(ctx: AudioContext) {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.15);
    g.gain.setValueAtTime(0.2, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.connect(g); g.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + 0.15);
}

function playErrorMechanical(ctx: AudioContext) {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.12);
    g.gain.setValueAtTime(0.35, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    osc.connect(g); g.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + 0.12);
}

function playErrorRetro(ctx: AudioContext) {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.setValueAtTime(150, ctx.currentTime + 0.05);
    osc.frequency.setValueAtTime(100, ctx.currentTime + 0.1);
    g.gain.setValueAtTime(0.18, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.connect(g); g.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + 0.15);
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useTypingSounds() {
    const audioCtxRef = useRef<AudioContext | null>(null);

    const initAudio = useCallback(() => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        }
        if (audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume();
        }
    }, []);

    const playClick = useCallback(() => {
        const state = useThemeStore.getState();
        if (state.isMuted) return;
        initAudio();
        const ctx = audioCtxRef.current;
        if (!ctx) return;
        const profile = (state.currentSound ?? 'default') as SoundProfile;
        switch (profile) {
            case 'mechanical': playMechanical(ctx); break;
            case 'typewriter': playTypewriter(ctx); break;
            case 'soft':       playSoft(ctx);       break;
            case 'clicky':     playClicky(ctx);     break;
            case 'retro':      playRetro(ctx);      break;
            default:           playDefault(ctx);    break;
        }
    }, [initAudio]);

    const playError = useCallback(() => {
        const state = useThemeStore.getState();
        if (state.isMuted) return;
        initAudio();
        const ctx = audioCtxRef.current;
        if (!ctx) return;
        const profile = (state.currentSound ?? 'default') as SoundProfile;
        switch (profile) {
            case 'mechanical': playErrorMechanical(ctx); break;
            case 'retro':      playErrorRetro(ctx);      break;
            default:           playErrorDefault(ctx);    break;
        }
    }, [initAudio]);

    return { playClick, playError };
}
