'use client';

import React from 'react';
import { useThemeStore } from '@/store/themeStore';
import { useBackgroundStore, backgrounds } from '@/store/backgroundStore';

/* ─── Theme-aware color map ─────────────────────────────────────── */
const themeColorMap: Record<string, {
  bg: string; groupBg: string; mutedText: string; accent: string; text: string;
}> = {
  dark:        { bg: '#111827', groupBg: '#1f2937', mutedText: '#6b7280', accent: '#8b5cf6', text: '#f9fafb' },
  cyberpunk:   { bg: '#0f0f0f', groupBg: '#1a1a1a', mutedText: '#525252', accent: '#8b5cf6', text: '#ffffff' },
  nord:        { bg: '#2e3440', groupBg: '#3b4252', mutedText: '#4c566a', accent: '#88c0d0', text: '#eceff4' },
  dracula:     { bg: '#282a36', groupBg: '#44475a', mutedText: '#6272a4', accent: '#bd93f9', text: '#f8f8f2' },
  'tokyo-night': { bg: '#1a1b26', groupBg: '#24283b', mutedText: '#565f89', accent: '#7aa2f7', text: '#c0caf5' },
  forest:      { bg: '#0f172a', groupBg: '#1e293b', mutedText: '#64748b', accent: '#0ea5e9', text: '#f8fafc' },
  ocean:       { bg: '#0c1844', groupBg: '#1e2d5f', mutedText: '#3c5888', accent: '#0ea5e9', text: '#e0f0ff' },
  serika:      { bg: '#1c1917', groupBg: '#292524', mutedText: '#78716c', accent: '#f97316', text: '#fafaf9' },
  carbon:      { bg: '#000000', groupBg: '#141414', mutedText: '#404040', accent: '#e5e5e5', text: '#fafafa' },
};

const fallback = { bg: '#000000', groupBg: '#141414', mutedText: '#404040', accent: '#e5e5e5', text: '#fafafa' };

/* ─── Option Group ──────────────────────────────────────────────── */
interface OptionGroupProps {
  label: string;
  options: { key: string; label: string }[];
  active: string;
  onChange: (key: string) => void;
  colors: typeof fallback;
}

function OptionGroup({ label, options, active, onChange, colors }: OptionGroupProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: '0.12em',
          textTransform: 'uppercase' as const,
          color: colors.mutedText,
          marginRight: 10,
          userSelect: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          background: colors.groupBg,
          borderRadius: 8,
          padding: '4px 6px',
        }}
      >
        {options.map(opt => {
          const isActive = active === opt.key;
          return (
            <button
              key={opt.key}
              onClick={() => onChange(opt.key)}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 13,
                fontWeight: isActive ? 700 : 400,
                padding: '6px 12px',
                borderRadius: 6,
                border: 'none',
                outline: 'none',
                cursor: 'pointer',
                color: isActive ? colors.accent : colors.mutedText,
                background: isActive ? `${colors.accent}1F` : 'transparent',
                transition: 'color 150ms ease, background 150ms ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  (e.target as HTMLElement).style.color = `${colors.accent}99`;
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  (e.target as HTMLElement).style.color = colors.mutedText;
                }
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── BG Picker (emoji buttons) ─────────────────────────────────── */
function BgPicker({ colors }: { colors: typeof fallback }) {
  const { activeBackgroundId, setBackground } = useBackgroundStore();

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: '0.12em',
          textTransform: 'uppercase' as const,
          color: colors.mutedText,
          marginRight: 10,
          userSelect: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        BG
      </span>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          background: colors.groupBg,
          borderRadius: 8,
          padding: '4px 6px',
        }}
      >
        {backgrounds.map(bg => {
          const isActive = activeBackgroundId === bg.id;
          return (
            <button
              key={bg.id}
              onClick={() => setBackground(bg.id)}
              title={bg.name}
              style={{
                fontSize: 14,
                padding: '4px 8px',
                borderRadius: 6,
                border: 'none',
                outline: 'none',
                cursor: 'pointer',
                background: isActive ? `${colors.accent}1F` : 'transparent',
                boxShadow: isActive ? `0 0 0 1.5px ${colors.accent}66` : 'none',
                transition: 'all 150ms ease',
                lineHeight: 1,
              }}
            >
              {bg.preview}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Main SettingsBar ──────────────────────────────────────────── */
interface SettingsBarProps {
  testType: string;
  onTypeChange: (t: string) => void;
  timeValue: number;
  onTimeChange: (v: number) => void;
  timeOptions: number[];
  difficulty: string;
  onDiffChange: (d: string) => void;
}

const typeOptions = [
  { key: 'words', label: 'words' },
  { key: 'numbers', label: 'numbers' },
  { key: 'symbols', label: 'symbols' },
  { key: 'javascript', label: 'js' },
  { key: 'python', label: 'py' },
];

const diffOptions = [
  { key: 'normal', label: 'Easy' },
  { key: 'hard', label: 'Hard' },
  { key: 'insane', label: 'Insane' },
  { key: 'chaos', label: 'Chaos' },
  { key: 'nightmare', label: 'Hell' },
  { key: 'screensaver', label: 'Screen' },
];

export default function SettingsBar({
  testType,
  onTypeChange,
  timeValue,
  onTimeChange,
  timeOptions: timeOpts,
  difficulty,
  onDiffChange,
}: SettingsBarProps) {
  const { activeTheme } = useThemeStore();
  const colors = themeColorMap[activeTheme.id] || fallback;

  const timeButtons = timeOpts.map(v => ({ key: String(v), label: String(v) }));

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
        padding: '12px 20px',
        borderRadius: 14,
        transition: 'all 200ms ease',
        width: '100%',
      }}
    >
      <OptionGroup
        label="TYPE"
        options={typeOptions}
        active={testType}
        onChange={onTypeChange}
        colors={colors}
      />
      <OptionGroup
        label="TIME"
        options={timeButtons}
        active={String(timeValue)}
        onChange={k => onTimeChange(Number(k))}
        colors={colors}
      />
      <OptionGroup
        label="DIFF"
        options={diffOptions}
        active={difficulty}
        onChange={onDiffChange}
        colors={colors}
      />
      <BgPicker colors={colors} />
    </div>
  );
}
