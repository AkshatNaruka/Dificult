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
    const [showShareMenu, setShowShareMenu] = useState(false);
    const shareMenuRef = useRef<HTMLDivElement>(null);

    // Close share menu on outside click
    React.useEffect(() => {
        if (!showShareMenu) return;
        const handler = (e: MouseEvent) => {
            if (shareMenuRef.current && !shareMenuRef.current.contains(e.target as Node)) {
                setShowShareMenu(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [showShareMenu]);

    const handleCopyText = async () => {
        try {
            const text = `⌨️ dificult\n\n${wpm} WPM · ${accuracy}% accuracy · ${rawWpm} raw · ${timeTaken}s\n\nTest your speed → dificult.com`;
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setShowShareMenu(false);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    const handleDownloadImage = () => {
        const canvas = document.createElement('canvas');
        const w = 1200;
        const h = 630;
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d')!;

        // ── Background ──
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, w, h);

        // Subtle gradient overlay
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, 'rgba(255,255,255,0.03)');
        bgGrad.addColorStop(0.5, 'rgba(255,255,255,0)');
        bgGrad.addColorStop(1, 'rgba(255,255,255,0.02)');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // Accent glow behind WPM
        const glowGrad = ctx.createRadialGradient(200, 280, 0, 200, 280, 300);
        glowGrad.addColorStop(0, 'rgba(139, 92, 246, 0.08)');
        glowGrad.addColorStop(1, 'rgba(139, 92, 246, 0)');
        ctx.fillStyle = glowGrad;
        ctx.fillRect(0, 0, w, h);

        // ── Top left branding ──
        ctx.font = '600 20px Inter, system-ui, sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.fillText('type', 60, 60);
        const typeWidth = ctx.measureText('type').width;
        ctx.fillStyle = 'rgba(139, 92, 246, 0.7)';
        ctx.fillText('warrior', 60 + typeWidth, 60);

        // ── Divider line ──
        ctx.strokeStyle = 'rgba(255,255,255,0.06)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(60, 85);
        ctx.lineTo(w - 60, 85);
        ctx.stroke();

        // ── WPM label ──
        ctx.font = '700 14px Inter, system-ui, sans-serif';
        ctx.fillStyle = 'rgba(139, 92, 246, 0.8)';
        ctx.letterSpacing = '3px';
        ctx.fillText('W P M', 64, 150);
        ctx.letterSpacing = '0px';

        // ── WPM hero number ──
        ctx.font = '800 160px Inter, system-ui, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(String(wpm), 56, 310);

        // ── Secondary stats row ──
        const statsY = 390;
        const statsLabelY = statsY;
        const statsValueY = statsY + 50;

        const stats = [
            { label: 'ACCURACY', value: `${accuracy}%` },
            { label: 'RAW', value: String(rawWpm) },
            { label: 'TIME', value: `${timeTaken}s` },
        ];

        let statsX = 68;
        stats.forEach((stat, i) => {
            ctx.font = '600 12px Inter, system-ui, sans-serif';
            ctx.fillStyle = 'rgba(255,255,255,0.35)';
            ctx.letterSpacing = '2px';
            ctx.fillText(stat.label, statsX, statsLabelY);
            ctx.letterSpacing = '0px';

            ctx.font = '700 44px Inter, system-ui, sans-serif';
            ctx.fillStyle = 'rgba(255,255,255,0.9)';
            ctx.fillText(stat.value, statsX, statsValueY);

            statsX += 220;

            // Vertical divider between stats
            if (i < stats.length - 1) {
                ctx.strokeStyle = 'rgba(255,255,255,0.08)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(statsX - 40, statsLabelY - 10);
                ctx.lineTo(statsX - 40, statsValueY + 10);
                ctx.stroke();
            }
        });

        // ── Chart visualization (mini sparkline) ──
        if (history.length > 1) {
            const chartX = 700;
            const chartY = 120;
            const chartW = 430;
            const chartH = 300;

            const maxWpm = Math.max(...history.map(p => p.wpm), 1);

            // Chart area fill
            ctx.beginPath();
            ctx.moveTo(chartX, chartY + chartH);
            history.forEach((p, i) => {
                const x = chartX + (i / (history.length - 1)) * chartW;
                const y = chartY + chartH - (p.wpm / maxWpm) * chartH * 0.85;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.lineTo(chartX + chartW, chartY + chartH);
            ctx.lineTo(chartX, chartY + chartH);
            ctx.closePath();
            const fillGrad = ctx.createLinearGradient(chartX, chartY, chartX, chartY + chartH);
            fillGrad.addColorStop(0, 'rgba(139, 92, 246, 0.15)');
            fillGrad.addColorStop(1, 'rgba(139, 92, 246, 0)');
            ctx.fillStyle = fillGrad;
            ctx.fill();

            // Chart line
            ctx.beginPath();
            history.forEach((p, i) => {
                const x = chartX + (i / (history.length - 1)) * chartW;
                const y = chartY + chartH - (p.wpm / maxWpm) * chartH * 0.85;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.strokeStyle = 'rgba(139, 92, 246, 0.5)';
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // ── Bottom bar ──
        ctx.fillStyle = 'rgba(255,255,255,0.03)';
        ctx.fillRect(0, h - 80, w, 80);
        ctx.strokeStyle = 'rgba(255,255,255,0.06)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, h - 80);
        ctx.lineTo(w, h - 80);
        ctx.stroke();

        // Website URL
        ctx.font = '600 16px Inter, system-ui, sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.fillText('dificult.com', 60, h - 38);

        // Tagline
        ctx.font = '400 14px Inter, system-ui, sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.25)';
        ctx.textAlign = 'right';
        ctx.fillText('Master your typing speed', w - 60, h - 38);
        ctx.textAlign = 'left';

        // ── Download ──
        const link = document.createElement('a');
        link.download = `dificult-${wpm}wpm.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        setShowShareMenu(false);
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
            <div className="flex items-end px-1" style={{ gap: '48px' }}>
                {/* WPM — hero number */}
                <div style={{ flexShrink: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-accent)', marginBottom: '4px' }}>
                        wpm
                    </div>
                    <div style={{ fontSize: '96px', fontWeight: 700, lineHeight: 1, letterSpacing: '-0.04em', color: 'var(--text-primary)' }}>
                        {wpm}
                    </div>
                </div>

                {/* Secondary stats */}
                <div className="flex items-end pb-2" style={{ gap: '40px' }}>
                    <div>
                        <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-main)', opacity: 0.6, marginBottom: '4px' }}>accuracy</div>
                        <div style={{ fontSize: '36px', fontWeight: 700, lineHeight: 1, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>{accuracy}%</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-main)', opacity: 0.6, marginBottom: '4px' }}>raw</div>
                        <div style={{ fontSize: '36px', fontWeight: 700, lineHeight: 1, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>{rawWpm}</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-main)', opacity: 0.6, marginBottom: '4px' }}>time</div>
                        <div style={{ fontSize: '36px', fontWeight: 700, lineHeight: 1, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>{timeTaken}s</div>
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

                {/* Share dropdown */}
                <div className="relative" ref={shareMenuRef}>
                    <button
                        onClick={() => setShowShareMenu(!showShareMenu)}
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
                                (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--text-accent)';
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
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5, marginLeft: '2px' }}>
                            <path d="m6 9 6 6 6-6" />
                        </svg>
                    </button>

                    {/* Dropdown menu */}
                    {showShareMenu && (
                        <div
                            style={{
                                position: 'absolute',
                                bottom: 'calc(100% + 8px)',
                                left: 0,
                                zIndex: 50,
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--border-glass)',
                                borderRadius: '12px',
                                padding: '6px',
                                minWidth: '220px',
                                boxShadow: '0 12px 32px rgba(0,0,0,0.4)',
                            }}
                        >
                            {/* Copy Text */}
                            <button
                                onClick={handleCopyText}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    width: '100%',
                                    padding: '10px 14px',
                                    background: 'none',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: 'var(--text-primary)',
                                    cursor: 'pointer',
                                    fontSize: '13px',
                                    fontFamily: 'inherit',
                                    transition: 'background 0.15s',
                                    textAlign: 'left',
                                }}
                                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6, flexShrink: 0 }}>
                                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                </svg>
                                <div>
                                    <div style={{ fontWeight: 600 }}>Copy Text</div>
                                    <div style={{ fontSize: '11px', color: 'var(--text-main)', opacity: 0.6, marginTop: '2px' }}>Share as text with link</div>
                                </div>
                            </button>

                            {/* Divider */}
                            <div style={{ height: '1px', background: 'var(--border-glass)', margin: '4px 8px' }} />

                            {/* Download Image */}
                            <button
                                onClick={handleDownloadImage}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    width: '100%',
                                    padding: '10px 14px',
                                    background: 'none',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: 'var(--text-primary)',
                                    cursor: 'pointer',
                                    fontSize: '13px',
                                    fontFamily: 'inherit',
                                    transition: 'background 0.15s',
                                    textAlign: 'left',
                                }}
                                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6, flexShrink: 0 }}>
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="7 10 12 15 17 10" />
                                    <line x1="12" y1="15" x2="12" y2="3" />
                                </svg>
                                <div>
                                    <div style={{ fontWeight: 600 }}>Download Image</div>
                                    <div style={{ fontSize: '11px', color: 'var(--text-main)', opacity: 0.6, marginTop: '2px' }}>Save as shareable card</div>
                                </div>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
