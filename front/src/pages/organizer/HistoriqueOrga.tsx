import { useState } from 'react';
import { useAllTransactions } from '../../hooks/usePaiements';
import { Table } from '../../components/ui/Table';
import { PaymentStatusBadge } from '../../components/tontine/PaymentStatusBadge';
import { Badge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';
import { formatFCFA, formatDate } from '../../utils/format';
import { Download, Filter } from 'lucide-react';
import { toast } from 'sonner';
import type { Transaction } from '../../types/transaction.types';

export function HistoriqueOrga() {
  const { data: transactions, isLoading } = useAllTransactions();
  
  const [filtre, setFiltre] = useState('tous');

  const filtered = (transactions ?? []).filter(t =>
    filtre === 'tous' || t.type === filtre
  );

  const totalVolume = filtered.reduce((acc, t) => acc + t.montant, 0);

  const handleExport = () => {
    const csv = [
      'Date,Type,Montant,Statut,Hash',
      ...filtered.map(t =>
        `${t.createdAt},${t.type},${t.montant},${t.status},${t.txHash ?? ''}`
      )
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `historique-tontine-${Date.now()}.csv`;
    a.click();
    toast.success('Export CSV téléchargé !');
  };

  if (isLoading) return <div className="loading-center"><Spinner size="lg" /></div>;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Historique des Paiements</h1>
          <p className="page-subtitle">Volume total : <strong>{formatFCFA(totalVolume)}</strong></p>
        </div>
        <button className="btn btn-ghost" id="btn-export-csv" onClick={handleExport}>
          <Download size={18} /> Exporter CSV
        </button>
      </div>

      <div className="filters-bar">
        <Filter size={16} />
        {['tous', 'cotisation', 'distribution', 'penalite', 'remboursement'].map(f => (
          <button
            key={f}
            className={`filter-tab ${filtre === f ? 'active' : ''}`}
            onClick={() => setFiltre(f)}
            id={`filter-orga-${f}`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <Table<Transaction>
        columns={[
          { key: 'createdAt', header: 'Date', sortable: true, render: r => formatDate(r.createdAt) },
          { key: 'type', header: 'Type', render: r => <PaymentStatusBadge type={r.type} /> },
          { key: 'userId', header: 'Utilisateur', render: r => <code className="user-id">{r.userId}</code> },
          { key: 'montant', header: 'Montant', sortable: true, render: r => <strong>{formatFCFA(r.montant)}</strong> },
          {
            key: 'status',
            header: 'Statut',
            render: r => (
              <Badge variant={r.status === 'confirmed' ? 'success' : r.status === 'failed' ? 'error' : 'pending'}>
                {r.status}
              </Badge>
            ),
          },
          {
            key: 'txHash',
            header: 'Hash',
            render: r => r.txHash ? (
              <code className="hash-short" title={r.txHash}>{r.txHash.slice(0, 12)}…</code>
            ) : <span className="text-muted">—</span>,
          },
        ]}
        data={filtered}
        keyExtractor={t => t.id}
        emptyMessage="Aucune transaction"
        pageSize={10}
      />
    </div>
  );
}
