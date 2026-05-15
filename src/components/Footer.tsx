import Link from 'next/link';

export function Footer() {
    return (
        <footer style={{ borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
            <div className="flex flex-col md:flex-row justify-between items-center w-full py-6 px-8 max-w-[1200px] mx-auto gap-4">
                <span className="font-mono text-sm font-bold" style={{ color: 'var(--text-muted)' }}>dificult</span>
                <div className="flex items-center gap-6">
                    {['GitHub', 'Discord', 'Privacy', 'Terms'].map(link => (
                        <a key={link} href="#" className="text-ui transition-colors hover:text-[var(--accent)]" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                            {link}
                        </a>
                    ))}
                </div>
                <p className="text-ui" style={{ color: 'var(--text-muted)' }}>
                    © 2025 dificult
                </p>
            </div>
        </footer>
    );
}
