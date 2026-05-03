import React from 'react';

interface ProgressBarProps {
  value: number; // 0–100
  max?: number;
  color?: string;
  bgColor?: string;
  height?: number;
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
}

export const ProgressBar = ({
  value,
  max = 100,
  color = 'var(--color-secondary)',
  bgColor = 'var(--color-surface-container)',
  height = 8,
  showLabel = false,
  label,
  animated = true,
}: ProgressBarProps) => {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', width: '100%' }}>
      {(showLabel || label) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {label && (
            <span style={{ font: 'var(--text-body-sm)', color: 'var(--color-on-surface-variant)' }}>{label}</span>
          )}
          {showLabel && (
            <span style={{ font: 'var(--text-label)', color: 'var(--color-on-surface)', fontWeight: 700 }}>
              {Math.round(pct)}%
            </span>
          )}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        style={{
          width: '100%',
          height: `${height}px`,
          background: bgColor,
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: color,
            borderRadius: 'var(--radius-full)',
            transition: animated ? 'width 600ms cubic-bezier(0.4, 0, 0.2, 1)' : undefined,
          }}
        />
      </div>
    </div>
  );
};

/* --- Cycle Progress (spécifique tontine) --- */
interface CycleProgressProps {
  currentCycle: number;
  totalCycles: number;
  currentUserPosition?: number;
}

export const CycleProgress = ({ currentCycle, totalCycles, currentUserPosition }: CycleProgressProps) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ font: 'var(--text-body-sm)', color: 'var(--color-on-surface-variant)', fontWeight: 600 }}>
        Cycle {currentCycle} / {totalCycles}
      </span>
      {currentUserPosition && (
        <span style={{ font: 'var(--text-body-sm)', color: 'var(--color-secondary)', fontWeight: 700 }}>
          Votre tour : #{currentUserPosition}
        </span>
      )}
    </div>
    <ProgressBar
      value={currentCycle}
      max={totalCycles}
      color="var(--color-secondary)"
      height={10}
    />
  </div>
);
