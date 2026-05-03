import React from 'react';

type BadgeVariant = 'success' | 'error' | 'pending' | 'warning' | 'info' | 'default';

const variantConfig: Record<BadgeVariant, { bg: string; color: string; dot: string }> = {
  success: { bg: 'var(--color-success-bg)', color: 'var(--color-success)', dot: 'var(--color-success)' },
  error:   { bg: 'var(--color-error-container)', color: 'var(--color-error)', dot: 'var(--color-error)' },
  pending: { bg: 'var(--color-pending-bg)', color: 'var(--color-pending)', dot: 'var(--color-pending)' },
  warning: { bg: 'var(--color-warning-bg)', color: 'var(--color-warning)', dot: 'var(--color-warning)' },
  info:    { bg: 'var(--color-primary-fixed)', color: 'var(--color-primary)', dot: 'var(--color-primary)' },
  default: { bg: 'var(--color-surface-container)', color: 'var(--color-on-surface-variant)', dot: 'var(--color-outline)' },
};

interface BadgeProps {
  variant?: BadgeVariant;
  label: string;
  showDot?: boolean;
  size?: 'sm' | 'md';
}

export const Badge = ({ variant = 'default', label, showDot = true, size = 'md' }: BadgeProps) => {
  const cfg = variantConfig[variant];
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: size === 'sm' ? '2px 8px' : '4px 12px',
      fontSize: size === 'sm' ? '11px' : '12px',
      fontFamily: 'var(--font-body)',
      fontWeight: 700,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      borderRadius: 'var(--radius-full)',
      background: cfg.bg,
      color: cfg.color,
      whiteSpace: 'nowrap',
    }}>
      {showDot && (
        <span style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: cfg.dot,
          flexShrink: 0,
        }} />
      )}
      {label}
    </span>
  );
};

/* --- Statut spécifique Tontine --- */
type TontineStatus = 'configuration' | 'adhesion' | 'active' | 'terminee' | 'annulee';

const tontineStatusMap: Record<TontineStatus, { variant: BadgeVariant; label: string }> = {
  configuration: { variant: 'info',    label: 'Configuration' },
  adhesion:      { variant: 'warning', label: 'Adhésion' },
  active:        { variant: 'success', label: 'Active' },
  terminee:      { variant: 'default', label: 'Terminée' },
  annulee:       { variant: 'error',   label: 'Annulée' },
};

export const TontineBadge = ({ status }: { status: TontineStatus }) => {
  const cfg = tontineStatusMap[status];
  return <Badge variant={cfg.variant} label={cfg.label} />;
};

/* --- Statut transaction --- */
type TransactionStatus = 'pending' | 'confirmed' | 'failed';

const txStatusMap: Record<TransactionStatus, { variant: BadgeVariant; label: string }> = {
  pending:   { variant: 'pending', label: 'En attente' },
  confirmed: { variant: 'success', label: 'Succès' },
  failed:    { variant: 'error',   label: 'Échoué' },
};

export const TransactionBadge = ({ status }: { status: TransactionStatus }) => {
  const cfg = txStatusMap[status];
  return <Badge variant={cfg.variant} label={cfg.label} />;
};
