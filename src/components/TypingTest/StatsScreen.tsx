'use client';

import React, { useRef, useEffect, useState } from 'react';
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
            const textToShare = `TypeWarrior | ${wpm} WPM | ${accuracy}% Acc | ${timeTaken}s`;
            await navigator.clipboard.writeText(textToShare);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    const chartData = {
        labels: history.map(p => p.time.toString() + 's'),
        datasets: [
            {
                label: 'WPM',
                data: history.map(p => p.wpm),
                borderColor: '#00f0ff', // var(--text-accent)
                backgroundColor: (context: ScriptableContext<'line'>) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                    gradient.addColorStop(0, 'rgba(0, 240, 255, 0.4)');
                    gradient.addColorStop(1, 'rgba(0, 240, 255, 0.0)');
                    return gradient;
                },
                tension: 0.4,
                fill: true,
                yAxisID: 'y',
                pointBackgroundColor: '#00f0ff',
                pointBorderColor: '#fff',
                pointHoverRadius: 6,
                borderWidth: 3,
            },
            {
                label: 'Raw WPM',
                data: history.map(p => p.rawWpm),
                borderColor: '#6c7182', // var(--text-main)
                borderDash: [5, 5],
                tension: 0.4,
                yAxisID: 'y',
                borderWidth: 2,
                pointRadius: 0,
            },
            {
                label: 'Errors',
                data: history.map(p => p.errors),
                borderColor: '#ff4757', // var(--text-error)
                backgroundColor: '#ff4757',
                type: 'line' as const,
                showLine: false,
                yAxisID: 'y1',
                pointRadius: 5,
                pointBorderColor: '#fff',
                pointBorderWidth: 1,
            }
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
        plugins: {
            tooltip: {
                backgroundColor: 'rgba(25, 28, 35, 0.8)',
                titleColor: '#00f0ff',
                bodyColor: '#f8f9fa',
                padding: 16,
                cornerRadius: 12,
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
                titleFont: { family: 'Outfit', size: 14, weight: 700 as const },
                bodyFont: { family: 'Outfit', size: 13 },
                boxPadding: 6,
            },
            legend: {
                position: 'top' as const,
                labels: {
                    color: '#6c7182',
                    font: { family: 'Outfit', size: 13, weight: 500 as const },
                    usePointStyle: true,
                    padding: 20
                }
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: '#6c7182', font: { family: 'Outfit' } }
            },
            y: {
                type: 'linear' as const,
                display: true,
                position: 'left' as const,
                title: {
                    display: true,
                    text: 'Words per Minute',
                    color: '#6c7182',
                    font: { family: 'Outfit' }
                },
                grid: { color: 'rgba(255,255,255,0.03)' },
                ticks: { color: '#6c7182', font: { family: 'Outfit' } },
                min: 0,
            },
            y1: {
                type: 'linear' as const,
                display: true,
                position: 'right' as const,
                title: {
                    display: true,
                    text: 'Errors',
                    color: '#ff4757',
                    font: { family: 'Outfit' }
                },
                grid: { drawOnChartArea: false },
                ticks: { color: '#ff4757', stepSize: 1, font: { family: 'Outfit' } },
                min: 0,
            },
        },
    };

    return (
        <div className="w-full max-w-6xl mx-auto flex flex-col gap-8">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-2">
                <div className="bg-transparent border border-[var(--border-glass)] p-6 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="text-[var(--text-main)] text-sm font-semibold tracking-widest uppercase mb-1">WPM</div>
                    <div className="text-[var(--text-primary)] text-6xl font-bold tracking-tighter">{wpm}</div>
                </div>

                <div className="bg-transparent border border-[var(--border-glass)] p-6 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="text-[var(--text-main)] text-sm font-semibold tracking-widest uppercase mb-1">Accuracy</div>
                    <div className="text-[var(--text-primary)] text-5xl font-bold tracking-tighter">{accuracy}%</div>
                </div>

                <div className="bg-transparent border border-[var(--border-glass)] p-6 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="text-[var(--text-main)] text-sm font-semibold tracking-widest uppercase mb-1">Raw WPM</div>
                    <div className="text-[var(--text-primary)] text-4xl font-bold tracking-tighter">{rawWpm}</div>
                </div>

                <div className="bg-transparent border border-[var(--border-glass)] p-6 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="text-[var(--text-main)] text-sm font-semibold tracking-widest uppercase mb-1">Time</div>
                    <div className="text-[var(--text-primary)] text-4xl font-bold tracking-tighter">{timeTaken}s</div>
                </div>
            </div>

            {/* Chart Panel */}
            <div className="w-full h-[400px] bg-transparent rounded-3xl p-6 relative">
                <Line ref={chartRef} data={chartData} options={chartOptions} />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center mt-6 gap-6">
                {/* Next Test Action - Kept as primary */}
                <button
                    onClick={onRestart}
                    className="group px-8 py-3 rounded-xl bg-transparent border border-[var(--border-glass)] text-[var(--text-main)] hover:text-[var(--text-primary)] hover:border-[var(--text-primary)] transition-all duration-300"
                >
                    <div className="flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-180 transition-transform duration-500"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
                        <span className="text-lg font-medium tracking-wide">Next Test</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-2 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                    </div>
                </button>

                {/* Share Action */}
                <button
                    onClick={handleShare}
                    className={`group px-8 py-3 rounded-xl border transition-all duration-300 ${copied ? 'text-[var(--text-correct)] border-[var(--text-correct)]' : 'bg-transparent border-[var(--border-glass)] text-[var(--text-main)] hover:text-[var(--text-primary)] hover:border-[var(--text-primary)]'}`}
                >
                    <div className="flex items-center gap-3">
                        {copied ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-correct)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
                        )}
                        <span className="text-lg font-medium tracking-wide">
                            {copied ? 'Copied!' : 'Share'}
                        </span>
                    </div>
                </button>
            </div>
        </div>
    );
}
