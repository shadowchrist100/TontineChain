import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  padding?: 'sm' | 'md' | 'lg' | 'none';
  hoverable?: boolean;
  flat?: boolean;
}

const paddingMap = {
  none: '0',
  sm:   'var(--space-4)',
  md:   'var(--space-5) var(--space-6)',
  lg:   'var(--space-6) var(--space-8)',
};

export const Card = ({
  children,
  padding = 'md',
  hoverable = false,
  flat = false,
  style,
  ...props
}: CardProps) => (
  <div
    style={{
      background: 'var(--color-surface-container-lowest)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: flat ? 'none' : 'var(--shadow-sm)',
      border: flat ? '1px solid var(--color-surface-container-high)' : 'none',
      padding: paddingMap[padding],
      transition: hoverable ? 'box-shadow var(--transition-fast), transform var(--transition-fast)' : undefined,
      cursor: hoverable ? 'pointer' : undefined,
      ...style,
    }}
    onMouseEnter={(e) => {
      if (hoverable) {
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-md)';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
      }
    }}
    onMouseLeave={(e) => {
      if (hoverable) {
        (e.currentTarget as HTMLDivElement).style.boxShadow = flat ? 'none' : 'var(--shadow-sm)';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
      }
    }}
    {...props}
  >
    {children}
  </div>
);

/* --- KPI Card --- */
interface KpiCardProps {
  label: string;
  value: string;
  sub?: string;
  icon?: React.ReactNode;
  iconBg?: string;
  trend?: { value: string; up: boolean };
}

export const KpiCard = ({ label, value, sub, icon, iconBg = 'var(--color-surface-container)', trend }: KpiCardProps) => (
  <Card>
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-4)' }}>
      <div style={{ flex: 1 }}>
        <p style={{ font: 'var(--text-body-sm)', color: 'var(--color-on-surface-variant)', marginBottom: 'var(--space-2)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: '11px' }}>
          {label}
        </p>
        <p style={{ font: 'var(--text-numeric-xl)', color: 'var(--color-on-surface)', lineHeight: 1.1 }}>
          {value}
        </p>
        {sub && (
          <p style={{ font: 'var(--text-body-sm)', color: 'var(--color-on-surface-variant)', marginTop: 'var(--space-1)' }}>
            {sub}
          </p>
        )}
        {trend && (
          <p style={{ font: 'var(--text-body-sm)', color: trend.up ? 'var(--color-success)' : 'var(--color-error)', marginTop: 'var(--space-2)', fontWeight: 600 }}>
            {trend.up ? '↑' : '↓'} {trend.value}
          </p>
        )}
      </div>
      {icon && (
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: 'var(--radius-lg)',
          background: iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          {icon}
        </div>
      )}
    </div>
  </Card>
);
