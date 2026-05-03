import type { TransactionType } from '../../types/transaction.types';

const TYPE_CONFIG: Record<TransactionType, { label: string; color: string; bg: string }> = {
  cotisation:    { label: 'Cotisation',    color: '#006C49', bg: '#D4FBE8' },
  distribution:  { label: 'Distribution', color: '#3B82F6', bg: '#DBEAFE' },
  penalite:      { label: 'Pénalité',     color: '#D97706', bg: '#FEF3C7' },
  remboursement: { label: 'Remboursement', color: '#8B5CF6', bg: '#EDE9FE' },
};

export function PaymentStatusBadge({ type }: { type: TransactionType }) {
  const cfg = TYPE_CONFIG[type] ?? TYPE_CONFIG.cotisation;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      padding: '3px 10px', borderRadius: '999px', fontSize: '11px',
      fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase',
      background: cfg.bg, color: cfg.color, whiteSpace: 'nowrap',
    }}>
      {cfg.label}
    </span>
  );
}
