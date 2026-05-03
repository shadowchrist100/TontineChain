import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  hint,
  prefixIcon,
  suffixIcon,
  fullWidth = true,
  id,
  style,
  ...props
}, ref) => {
  const inputId = id ?? `input-${Math.random().toString(36).slice(2)}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: fullWidth ? '100%' : undefined }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            font: 'var(--text-body-sm)',
            fontWeight: 600,
            color: 'var(--color-on-surface)',
          }}
        >
          {label}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {prefixIcon && (
          <span style={{
            position: 'absolute',
            left: '12px',
            color: 'var(--color-on-surface-variant)',
            display: 'flex',
            alignItems: 'center',
          }}>
            {prefixIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          style={{
            width: '100%',
            padding: `12px ${suffixIcon ? '44px' : '16px'} 12px ${prefixIcon ? '44px' : '16px'}`,
            font: 'var(--text-body-md)',
            color: 'var(--color-on-surface)',
            background: 'var(--color-surface-container-lowest)',
            border: `1.5px solid ${error ? 'var(--color-error)' : 'var(--color-outline-variant)'}`,
            borderRadius: 'var(--radius-md)',
            outline: 'none',
            transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
            ...style,
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = error ? 'var(--color-error)' : 'var(--color-secondary)';
            e.currentTarget.style.boxShadow = `0 0 0 3px ${error ? 'rgba(186,26,26,0.1)' : 'rgba(0,108,73,0.12)'}`;
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = error ? 'var(--color-error)' : 'var(--color-outline-variant)';
            e.currentTarget.style.boxShadow = 'none';
            props.onBlur?.(e);
          }}
          {...props}
        />
        {suffixIcon && (
          <span style={{
            position: 'absolute',
            right: '12px',
            color: 'var(--color-on-surface-variant)',
            display: 'flex',
            alignItems: 'center',
          }}>
            {suffixIcon}
          </span>
        )}
      </div>
      {error && (
        <p style={{ font: 'var(--text-body-sm)', color: 'var(--color-error)' }}>
          {error}
        </p>
      )}
      {hint && !error && (
        <p style={{ font: 'var(--text-body-sm)', color: 'var(--color-on-surface-variant)' }}>
          {hint}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
