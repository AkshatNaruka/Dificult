import { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: ReactNode;
  fullWidth?: boolean;
}

export function Button({ variant = 'primary', children, fullWidth, className = '', ...props }: ButtonProps) {
  const base = variant === 'primary' ? 'btn-primary' : 'btn-secondary';
  const width = fullWidth ? 'w-full' : '';

  return (
    <button className={`${base} ${width} ${className}`} {...props}>
      {children}
    </button>
  );
}
