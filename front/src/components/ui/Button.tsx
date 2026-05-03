import React from 'react';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: 'var(--color-primary)',
    color: 'var(--color-on-primary)',
  },
  secondary: {
    background: 'var(--color-secondary)',
    color: 'var(--color-on-secondary)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--color-on-surface)',
    border: '1px solid var(--color-outline-variant)',
  },
  danger: {
    background: 'var(--color-error)',
    color: 'var(--color-on-error)',
  },
  outline: {
    background: 'transparent',
    color: 'var(--color-secondary)',
    border: '1.5px solid var(--color-secondary)',
  },
};

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: { padding: '6px 14px', fontSize: '13px', gap: '6px', minHeight: '34px' },
  md: { padding: '10px 20px', fontSize: '14px', gap: '8px', minHeight: '42px' },
  lg: { padding: '14px 28px', fontSize: '16px', gap: '10px', minHeight: '50px' },
};

export const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  children,
  disabled,
  style,
  ...props
}: ButtonProps) => {
  const isDisabled = disabled || loading;

  return (
    <button
      disabled={isDisabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-headline)',
        fontWeight: 600,
        borderRadius: 'var(--radius-md)',
        border: 'none',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.55 : 1,
        transition: 'all var(--transition-fast)',
        width: fullWidth ? '100%' : undefined,
        whiteSpace: 'nowrap',
        textDecoration: 'none',
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...style,
      }}
      {...props}
    >
      {loading ? (
        <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
      ) : (
        iconPosition === 'left' && icon
      )}
      {children}
      {!loading && iconPosition === 'right' && icon}
    </button>
  );
};
