import { Loader2 } from 'lucide-react';

type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const SIZE_MAP: Record<SpinnerSize, number> = {
  xs: 14, sm: 18, md: 24, lg: 40, xl: 56,
};

interface SpinnerProps {
  size?: SpinnerSize | number;
  color?: string;
  label?: string;
}

export const Spinner = ({
  size = 'md',
  color = 'var(--color-secondary)',
  label = 'Chargement…',
}: SpinnerProps) => {
  const px = typeof size === 'number' ? size : SIZE_MAP[size];
  return (
    <div role="status" aria-label={label} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 size={px} color={color} style={{ animation: 'spin 1s linear infinite' }} />
      <span className="sr-only">{label}</span>
    </div>
  );
};

export const PageLoader = () => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    minHeight: '400px', flexDirection: 'column', gap: 'var(--space-4)',
  }}>
    <Spinner size="lg" />
    <p style={{ font: 'var(--text-body-sm)', color: 'var(--color-on-surface-variant)' }}>Chargement…</p>
  </div>
);
