interface SectionHeaderProps {
  label: string;
  heading: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

export function SectionHeader({ label, heading, subtitle, align = 'center' }: SectionHeaderProps) {
  const alignClass = align === 'center' ? 'text-center' : 'text-left';

  return (
    <div className={`${alignClass} mb-12`}>
      <span className="section-label block mb-3">{label}</span>
      <h2 className="heading-display text-3xl md:text-5xl mb-3">{heading}</h2>
      {subtitle && <p className="text-body max-w-2xl mx-auto">{subtitle}</p>}
    </div>
  );
}
