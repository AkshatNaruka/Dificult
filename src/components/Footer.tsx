'use client';

import { ThemePicker } from './ThemePicker';
import { SoundPicker } from './SoundPicker';

export function Footer() {
    return (
        <footer style={{
            position: 'relative',
            zIndex: 10,
            padding: '12px clamp(20px, 4vw, 48px)',
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                maxWidth: 1100,
                margin: '0 auto',
            }}>
                {/* Left: brand + links */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                }}>
                    <span style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 12,
                        fontWeight: 600,
                        color: 'var(--text-muted)',
                        letterSpacing: '-0.01em',
                    }}>
                        dificult
                    </span>
                    <span style={{
                        width: 1,
                        height: 12,
                        background: 'rgba(255,255,255,0.06)',
                        flexShrink: 0,
                    }} />
                    {['GitHub', 'Discord', 'Privacy'].map(link => (
                        <a
                            key={link}
                            href="#"
                            style={{
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: 10,
                                fontWeight: 400,
                                color: 'var(--text-muted)',
                                textDecoration: 'none',
                                transition: 'color 0.15s ease',
                                letterSpacing: '0.02em',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                        >
                            {link}
                        </a>
                    ))}
                </div>

                {/* Right: Theme + Sound pickers */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                }}>
                    <ThemePicker />
                    <SoundPicker />
                </div>
            </div>
        </footer>
    );
}
