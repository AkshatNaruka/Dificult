'use client';

import React from 'react';
import { useThemeStore } from '@/store/themeStore';

/* ─── Rank Tiers ────────────────────────────────────────────────── */
const rankTiers = [
  { name: 'NOVICE',     minXP: 0,     maxXP: 500,   icon: '🌱', level: 1 },
  { name: 'APPRENTICE', minXP: 500,   maxXP: 1500,  icon: '⚡', level: 2 },
  { name: 'SKILLED',    minXP: 1500,  maxXP: 3000,  icon: '🔥', level: 3 },
  { name: 'EXPERT',     minXP: 3000,  maxXP: 6000,  icon: '💎', level: 4 },
  { name: 'MASTER',     minXP: 6000,  maxXP: 10000, icon: '👑', level: 5 },
  { name: 'LEGEND',     minXP: 10000, maxXP: null,  icon: '💀', level: 6 },
];

function getCurrentRank(xp: number) {
  for (let i = rankTiers.length - 1; i >= 0; i--) {
    if (xp >= rankTiers[i].minXP) return rankTiers[i];
  }
  return rankTiers[0];
}

/* ─── Theme color map (mirrors SettingsBar) ─────────────────────── */
const themeColorMap: Record<string, {
  groupBg: string; mutedText: string; accent: string; text: string;
}> = {
  dark:          { groupBg: '#1f2937', mutedText: '#6b7280', accent: '#8b5cf6', text: '#f9fafb' },
  light:         { groupBg: '#e2e8f0', mutedText: '#94a3b8', accent: '#0ea5e9', text: '#1e293b' },
  cyberpunk:     { groupBg: '#1a1a1a', mutedText: '#525252', accent: '#8b5cf6', text: '#ffffff' },
  nord:          { groupBg: '#3b4252', mutedText: '#4c566a', accent: '#88c0d0', text: '#eceff4' },
  dracula:       { groupBg: '#44475a', mutedText: '#6272a4', accent: '#bd93f9', text: '#f8f8f2' },
  'tokyo-night': { groupBg: '#24283b', mutedText: '#565f89', accent: '#7aa2f7', text: '#c0caf5' },
  forest:        { groupBg: '#1e293b', mutedText: '#64748b', accent: '#0ea5e9', text: '#f8fafc' },
  ocean:         { groupBg: '#1e2d5f', mutedText: '#3c5888', accent: '#0ea5e9', text: '#e0f0ff' },
  serika:        { groupBg: '#292524', mutedText: '#78716c', accent: '#f97316', text: '#fafaf9' },
  minimal:       { groupBg: '#f1f5f9', mutedText: '#cbd5e1', accent: '#171717', text: '#171717' },
  carbon:        { groupBg: '#141414', mutedText: '#404040', accent: '#e5e5e5', text: '#fafafa' },
};

const fallback = { groupBg: '#141414', mutedText: '#404040', accent: '#e5e5e5', text: '#fafafa' };

/* ─── Component ─────────────────────────────────────────────────── */
interface RankBadgeProps {
  xp: number;
}

export default function RankBadge({ xp }: RankBadgeProps) {
  const { activeTheme } = useThemeStore();
  const colors = themeColorMap[activeTheme.id] || fallback;
  const rank = getCurrentRank(xp);

  // Progress calc
  const isMaxRank = rank.maxXP === null;
  const progress = isMaxRank
    ? 1
    : Math.min(1, (xp - rank.minXP) / ((rank.maxXP ?? 1) - rank.minXP));
  const xpInTier = xp - rank.minXP;
  const xpNeeded = isMaxRank ? '∞' : String(rank.maxXP! - rank.minXP);

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '12px 28px 14px',
        borderRadius: 12,
        border: `1px solid ${colors.accent}40`, // 25% opacity
        background: colors.groupBg,
        gap: 8,
        transition: 'all 200ms ease',
      }}
    >
      {/* Top row: icon + rank + level */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          width: '100%',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18, lineHeight: 1 }}>{rank.icon}</span>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 13,
              fontWeight: 700,
              color: colors.accent,
              letterSpacing: '0.12em',
              textTransform: 'uppercase' as const,
            }}
          >
            {rank.name}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              color: colors.mutedText,
              fontWeight: 500,
            }}
          >
            LVL {rank.level}
          </span>
          <span
            style={{
              fontSize: 12,
              color: `${colors.mutedText}80`,
              userSelect: 'none',
            }}
          >
            →
          </span>
        </div>
      </div>

      {/* XP Progress Bar */}
      <div
        style={{
          width: 180,
          height: 4,
          borderRadius: 999,
          background: `${colors.mutedText}33`, // 20% opacity
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: '100%',
            borderRadius: 999,
            background: colors.accent,
            transition: 'width 600ms ease',
          }}
        />
      </div>

      {/* XP label */}
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
          color: colors.mutedText,
          letterSpacing: '0.05em',
        }}
      >
        {xpInTier} / {xpNeeded} XP
      </span>
    </div>
  );
}
