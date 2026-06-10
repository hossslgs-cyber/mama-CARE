import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-teal-700 text-white',
  secondary: 'border border-slate-200 text-slate-700',
};

export function Button({ variant = 'primary', fullWidth = true, className, children, ...props }: ButtonProps) {
  const base = 'rounded-2xl px-4 py-3 text-base font-semibold disabled:cursor-not-allowed disabled:opacity-60';
  const width = fullWidth ? 'w-full' : '';

  return (
    <button className={`${base} ${variantStyles[variant]} ${width} ${className ?? ''}`} {...props}>
      {children}
    </button>
  );
}
