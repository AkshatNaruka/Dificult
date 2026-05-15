interface RankBadgeProps {
  rank: number;
  size?: 'sm' | 'md' | 'lg';
}

export function RankBadge({ rank, size = 'md' }: RankBadgeProps) {
  const colors = rank === 1
    ? 'bg-[#fbbf24] text-black'
    : rank === 2
    ? 'bg-[#94a3b8] text-black'
    : rank === 3
    ? 'bg-[#d97706] text-black'
    : 'bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)]';

  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  };

  return (
    <span className={`inline-flex items-center justify-center rounded-full font-mono font-bold ${colors} ${sizeClasses[size]}`}>
      {rank}
    </span>
  );
}
