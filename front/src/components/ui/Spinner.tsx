import React from 'react';
import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  size?: number;
  color?: string;
  label?: string;
}

export const Spinner = ({ size = 24, color = 'var(--color-secondary)', label = 'Chargement…' }: SpinnerProps) => (
  <div role="status" aria-label={label} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
    <Loader2 size={size} color={color} style={{ animation: 'spin 1s linear infinite' }} />
    <span className="sr-only">{label}</span>
  </div>
);

export const PageLoader = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    flexDirection: 'column',
    gap: 'var(--space-4)',
  }}>
    <Spinner size={40} />
    <p style={{ font: 'var(--text-body-sm)', color: 'var(--color-on-surface-variant)' }}>Chargement…</p>
  </div>
);
