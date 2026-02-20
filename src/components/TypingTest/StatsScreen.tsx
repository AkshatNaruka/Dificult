'use client';

import React, { useRef, useState } from 'react';
import { HistoryDataPoint } from '../../hooks/useTypingEngine';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ScriptableContext
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface StatsScreenProps {
    wpm: number;
    rawWpm: number;
    accuracy: number;
    history: HistoryDataPoint[];
    onRestart: () => void;
    timeTaken: number;
}

export function StatsScreen({ wpm, rawWpm, accuracy, history, onRestart, timeTaken }: StatsScreenProps) {
    const chartRef = useRef(null);
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        try {
            const text = `typewarrior  ${wpm} wpm  ${accuracy}% acc  ${timeTaken}s`;
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    const chartData = {
        labels: history.map(p => p.time + 's'),
        datasets: [
            {
                label: 'WPM',
                data: history.map(p => p.wpm),
                borderColor: 'var(--text-accent, #88c0d0)',
                backgroundColor: (context: ScriptableContext<'line'>) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 280);
                    gradient.addColorStop(0, 'rgba(136,192,208,0.25)');
                    gradient.addColorStop(1, 'rgba(136,192,208,0.0)');
                    return gradient;
                },
                tension: 0.4,
                fill: true,
                yAxisID: 'y',
                pointBackgroundColor: 'var(--text-accent, #88c0d0)',
                pointBorderColor: 'transparent',
                pointRadius: 3,
                pointHoverRadius: 6,
                borderWidth: 2,
            },
            {
                label: 'Raw',
                data: history.map(p => p.rawWpm),
                borderColor: 'rgba(255,255,255,0.2)',
                borderDash: [4, 4],
                tension: 0.4,
                yAxisID: 'y',
                borderWidth: 1.5,
                pointRadius: 0,
            },
            {
                label: 'Errors',
                data: history.map(p => p.errors),
                borderColor: '#bf616a',
                backgroundColor: '#bf616a',
                type: 'line' as const,
                showLine: false,
                yAxisID: 'y1',
                pointRadius: 4,
                pointBorderColor: 'transparent',
            }
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index' as const, intersect: false },
        plugins: {
            tooltip: {
                backgroundColor: 'rgba(20,22,28,0.95)',
                titleColor: 'rgba(255,255,255,0.9)',
                bodyColor: 'rgba(255,255,255,0.6)',
                padding: 12,
                cornerRadius: 10,
                borderColor: 'rgba(255,255,255,0.08)',
                borderWidth: 1,
                titleFont: { size: 13, weight: 600 as const },
                bodyFont: { size: 12 },
                boxPadding: 4,
            },
            legend: {
                position: 'bottom' as const,
                labels: {
                    color: 'rgba(255,255,255,0.4)',
                    font: { size: 12 },
                    usePointStyle: true,
                    padding: 20,
                    boxWidth: 8,
                }
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: 'rgba(255,255,255,0.3)', font: { size: 11 } },
                border: { color: 'rgba(255,255,255,0.06)' },
            },
            y: {
                type: 'linear' as const,
                display: true,
                position: 'left' as const,
                grid: { color: 'rgba(255,255,255,0.04)' },
                ticks: { color: 'rgba(255,255,255,0.3)', font: { size: 11 } },
                border: { color: 'rgba(255,255,255,0.06)' },
                min: 0,
            },
            y1: {
                type: 'linear' as const,
                display: true,
                position: 'right' as const,
                grid: { drawOnChartArea: false },
                ticks: { color: '#bf616a', stepSize: 1, font: { size: 11 } },
                border: { color: 'rgba(255,255,255,0.06)' },
                min: 0,
            },
        },
    };

    return (
        <div
            className="w-full max-w-5xl mx-auto flex flex-col gap-8"
            style={{ fontFamily: 'inherit' }}
        >
            {/* ── Primary stat row ── */}
            <div className="flex items-end gap-12 px-1">
                {/* WPM — hero number */}
                <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-accent)', marginBottom: '2px' }}>
                        wpm
                    </div>
                    <div style={{ fontSize: '96px', fontWeight: 700, lineHeight: 1, letterSpacing: '-0.04em', color: 'var(--text-primary)' }}>
                        {wpm}
                    </div>
                </div>

                {/* Secondary stats — smaller, right of hero */}
                <div className="flex flex-col gap-4 pb-3">
                    <div>
                        <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-main)', opacity: 0.6 }}>accuracy</div>
                        <div style={{ fontSize: '36px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>{accuracy}%</div>
                    </div>
                </div>
                <div className="flex flex-col gap-4 pb-3">
                    <div>
                        <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-main)', opacity: 0.6 }}>raw</div>
                        <div style={{ fontSize: '36px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>{rawWpm}</div>
                    </div>
                </div>
                <div className="flex flex-col gap-4 pb-3">
                    <div>
                        <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-main)', opacity: 0.6 }}>time</div>
                        <div style={{ fontSize: '36px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>{timeTaken}s</div>
                    </div>
                </div>
            </div>

            {/* ── Chart ── */}
            <div style={{ width: '100%', height: '260px' }}>
                <Line ref={chartRef} data={chartData} options={chartOptions} />
            </div>

            {/* ── Actions ── */}
            <div className="flex items-center gap-4 pt-2">
                <button
                    onClick={onRestart}
                    className="group flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all duration-200"
                    style={{
                        background: 'none',
                        border: '1px solid var(--border-glass)',
                        color: 'var(--text-main)',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontFamily: 'inherit',
                    }}
                    onMouseEnter={e => {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--text-accent)';
                        (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)';
                    }}
                    onMouseLeave={e => {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-glass)';
                        (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-main)';
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 0.4s' }} className="group-hover:rotate-180">
                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                        <path d="M3 3v5h5" />
                    </svg>
                    Next Test
                </button>

                <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all duration-200"
                    style={{
                        background: 'none',
                        border: `1px solid ${copied ? 'var(--text-accent)' : 'var(--border-glass)'}`,
                        color: copied ? 'var(--text-accent)' : 'var(--text-main)',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontFamily: 'inherit',
                    }}
                    onMouseEnter={e => {
                        if (!copied) {
                            (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--text-primary)';
                            (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)';
                        }
                    }}
                    onMouseLeave={e => {
                        if (!copied) {
                            (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-glass)';
                            (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-main)';
                        }
                    }}
                >
                    {copied ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                            <polyline points="16 6 12 2 8 6" />
                            <line x1="12" y1="2" x2="12" y2="15" />
                        </svg>
                    )}
                    {copied ? 'Copied!' : 'Share'}
                </button>
            </div>
        </div>
    );
}
