interface StatChipProps {
  value: string | number;
  label: string;
  unit?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function StatChip({ value, label, unit, size = 'md' }: StatChipProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <span className={`text-stat font-bold ${sizeClasses[size]}`} style={{ color: 'var(--text-primary)' }}>
        {value}
        {unit && <span className="text-sm font-normal ml-1" style={{ color: 'var(--text-muted)' }}>{unit}</span>}
      </span>
      <span className="text-ui" style={{ color: 'var(--text-secondary)' }}>{label}</span>
    </div>
  );
}
