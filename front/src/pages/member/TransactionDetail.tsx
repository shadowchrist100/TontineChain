import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_TRANSACTIONS } from '../../mocks/transactions.mock';
import { PaymentStatusBadge } from '../../components/tontine/PaymentStatusBadge';
import { Badge } from '../../components/ui/Badge';
import { ArrowLeft, ExternalLink, Copy, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useState } from 'react';
import { toast } from 'sonner';

function formatFCFA(n: number) {
  return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
}

export function TransactionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const tx = MOCK_TRANSACTIONS.find(t => t.id === id);

  if (!tx) return (
    <div className="page">
      <p>Transaction introuvable.</p>
    </div>
  );

  const handleCopy = () => {
    if (tx.txHash) {
      navigator.clipboard.writeText(tx.txHash);
      setCopied(true);
      toast.success('Hash copié !');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const statusVariant = tx.status === 'confirmed' ? 'success' : tx.status === 'failed' ? 'error' : 'pending';
  const statusLabel = tx.status === 'confirmed' ? '✓ Confirmé' : tx.status === 'failed' ? '✗ Échoué' : '⏳ En attente';

  return (
    <div className="page page-narrow">
      <div className="page-header">
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Retour
        </button>
        <h1 className="page-title">Détail de la Transaction</h1>
      </div>

      <div className="card tx-detail-card">
        <div className="tx-detail-header">
          <PaymentStatusBadge type={tx.type} />
          <div className={`tx-detail-amount ${tx.type === 'distribution' ? 'amount-positive' : 'amount-neutral'}`}>
            {tx.type === 'distribution' ? '+' : '-'}{formatFCFA(tx.montant)}
          </div>
          <Badge variant={statusVariant}>{statusLabel}</Badge>
        </div>

        <dl className="tx-details-list">
          <div className="tx-detail-item">
            <dt>Date</dt>
            <dd>{format(new Date(tx.createdAt), "EEEE d MMMM yyyy 'à' HH:mm", { locale: fr })}</dd>
          </div>
          <div className="tx-detail-item">
            <dt>Type de transaction</dt>
            <dd className="capitalize">{tx.type}</dd>
          </div>
          <div className="tx-detail-item">
            <dt>Montant</dt>
            <dd>{formatFCFA(tx.montant)}</dd>
          </div>
          <div className="tx-detail-item">
            <dt>Statut</dt>
            <dd><Badge variant={statusVariant} label={tx.status} /></dd>
          </div>
          {tx.txHash && (
            <div className="tx-detail-item tx-hash-item">
              <dt>Hash Blockchain</dt>
              <dd className="tx-hash-value">
                <code className="hash-code">{tx.txHash}</code>
                <button
                  className="btn btn-ghost btn-xs"
                  onClick={handleCopy}
                  id="btn-copy-hash"
                  title="Copier le hash"
                >
                  {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                </button>
              </dd>
            </div>
          )}
          {tx.confirmedAt && (
            <div className="tx-detail-item">
              <dt>Confirmée le</dt>
              <dd>{format(new Date(tx.confirmedAt), "d MMM yyyy 'à' HH:mm", { locale: fr })}</dd>
            </div>
          )}
        </dl>

        {tx.txHash && (
          <div className="tx-blockchain-cta">
            <div className="blockchain-badge">
              <CheckCircle size={16} />
              <span>Enregistrée sur la blockchain Ethereum (simulation)</span>
            </div>
            <a
              href={`https://etherscan.io/tx/${tx.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-sm"
              id="btn-etherscan"
            >
              Voir sur l'explorateur <ExternalLink size={14} />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
