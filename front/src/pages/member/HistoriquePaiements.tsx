import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePaiements } from '../../hooks/usePaiements';
import { useAuthStore } from '../../stores/authStore';
import { Table } from '../../components/ui/Table';
import { PaymentStatusBadge } from '../../components/tontine/PaymentStatusBadge';
import { Badge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';
import { formatDate } from '../../utils/format';
import { ExternalLink, Filter } from 'lucide-react';
import type { Transaction } from '../../types/transaction.types';

function formatFCFA(n: number) {
  return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
}

export function HistoriquePaiements() {
  const user = useAuthStore(s => s.user);
  const { data: transactions, isLoading } = usePaiements(user?.id ?? '');
  const [filtre, setFiltre] = useState<string>('tous');

  const filtered = (transactions ?? []).filter(t =>
    filtre === 'tous' || t.type === filtre
  );

  if (isLoading) return <div className="loading-center"><Spinner size="lg" /></div>;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Historique des paiements</h1>
          <p className="page-subtitle">Toutes vos transactions enregistrées sur la blockchain</p>
        </div>
      </div>

      <div className="filters-bar">
        <Filter size={16} />
        {['tous', 'cotisation', 'distribution', 'penalite', 'remboursement'].map(f => (
          <button
            key={f}
            className={`filter-tab ${filtre === f ? 'active' : ''}`}
            onClick={() => setFiltre(f)}
            id={`filter-tx-${f}`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <Table<Transaction>
        columns={[
          {
            key: 'createdAt',
            header: 'Date',
            sortable: true,
            render: row => formatDate(row.createdAt),
          },
          {
            key: 'type',
            header: 'Type',
            render: row => <PaymentStatusBadge type={row.type} />,
          },
          {
            key: 'montant',
            header: 'Montant',
            sortable: true,
            render: row => <span className="tx-amount">{formatFCFA(row.montant)}</span>,
          },
          {
            key: 'status',
            header: 'Statut',
            render: row => (
              <Badge variant={row.status === 'confirmed' ? 'success' : row.status === 'failed' ? 'error' : 'pending'}>
                {row.status}
              </Badge>
            ),
          },
          {
            key: 'txHash',
            header: 'Hash blockchain',
            render: row => row.txHash ? (
              <Link
                to={`/transactions/${row.id}`}
                className="hash-link"
                id={`tx-link-${row.id}`}
                title={row.txHash}
              >
                {row.txHash.slice(0, 14)}…
                <ExternalLink size={12} />
              </Link>
            ) : <span className="text-muted">—</span>,
          },
        ]}
        data={filtered}
        keyExtractor={t => t.id}
        emptyMessage="Aucune transaction trouvée"
        pageSize={8}
      />
    </div>
  );
}
