import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTontine } from '../../hooks/useTontines';
import { usePaiementsTontine } from '../../hooks/usePaiements';
import { Spinner } from '../../components/ui/Spinner';
import { Badge } from '../../components/ui/Badge';
import { MemberAvatar } from '../../components/tontine/MemberAvatar';
import { PaymentStatusBadge } from '../../components/tontine/PaymentStatusBadge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { MOCK_USERS } from '../../mocks/users.mock';
import { formatFCFA, formatDate, STATUS_VARIANT, STATUS_LABEL, cycleProgress } from '../../utils/format';
import {
  ArrowLeft, Users, CreditCard, Link2,
  UserCheck, Shuffle, MessageSquare, XCircle
} from 'lucide-react';

export function GererTontine() {
  const { id } = useParams<{ id: string }>();
  const { data: tontine, isLoading } = useTontine(id!);
  const { data: transactions } = usePaiementsTontine(id!);
  const navigate = useNavigate();

  if (isLoading) return <div className="loading-center"><Spinner size="lg" /></div>;
  if (!tontine) return <div className="page"><p>Tontine introuvable.</p></div>;

  const members = MOCK_USERS.filter(u => tontine.membresIds.includes(u.id));
  const recentTx = (transactions ?? []).slice(0, 5);
  const progress = cycleProgress(tontine.cycleActuel, tontine.nombreMembresMax);

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-header-left">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} /> Retour
          </button>
          <div>
            <h1 className="page-title">{tontine.nom}</h1>
            <div className="page-title-meta">
              <Badge variant={STATUS_VARIANT[tontine.status]}>{STATUS_LABEL[tontine.status]}</Badge>
              <span className="meta-text">· {formatFCFA(tontine.montantCotisation)} / {tontine.frequenceCotisation}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Barre de progression */}
      {tontine.status === 'active' && (
        <div className="card detail-progress">
          <div className="progress-header">
            <span>Cycle en cours</span>
            <strong>Tour {tontine.cycleActuel} / {tontine.nombreMembresMax}</strong>
          </div>
          <ProgressBar value={progress} max={100} showLabel />
        </div>
      )}

      {/* Actions rapides */}
      <div className="quick-actions-grid">
        {[
          { label: "Ordre de passage", icon: <Shuffle size={20} />, path: `/orga/tontines/${id}/ordre` },
          { label: "Valider membres", icon: <UserCheck size={20} />, path: `/orga/tontines/${id}/membres` },
          { label: "Lien d'invitation", icon: <Link2 size={20} />, path: `/orga/tontines/${id}/invitation` },
          { label: "Remplaçants", icon: <Users size={20} />, path: `/orga/tontines/${id}/remplacants` },
          { label: "Messagerie", icon: <MessageSquare size={20} />, path: `/orga/messagerie` },
          { label: "Clôturer", icon: <XCircle size={20} />, path: `/orga/cloture/${id}` },
        ].map(a => (
          <button
            key={a.label}
            className="quick-action-btn card"
            onClick={() => navigate(a.path)}
            id={`qa-${a.label.replace(/\s/g, '-').toLowerCase()}`}
          >
            <div className="qa-icon">{a.icon}</div>
            <span>{a.label}</span>
          </button>
        ))}
      </div>

      <div className="detail-grid">
        {/* Membres */}
        <div className="card">
          <h3 className="card-title"><Users size={18} /> Membres ({members.length}/{tontine.nombreMembresMax})</h3>
          <div className="members-list">
            {members.map((m, i) => (
              <div key={m.id} className="member-row">
                <MemberAvatar nom={m.nom} prenom={m.prenom} size="sm" />
                <div className="member-info">
                  <span className="member-name">{m.prenom} {m.nom}</span>
                  <span className="member-phone">{m.telephone}</span>
                </div>
                <Badge variant="info">#{i + 1}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Transactions récentes */}
        <div className="card">
          <div className="card-header-row">
            <h3 className="card-title"><CreditCard size={18} /> Paiements récents</h3>
            <Link to="/orga/historique" className="btn btn-ghost btn-sm">Voir tout</Link>
          </div>
          {recentTx.length === 0 ? (
            <p className="empty-text">Aucune transaction.</p>
          ) : (
            <div className="transactions-list">
              {recentTx.map(tx => (
                <div key={tx.id} className="tx-row">
                  <PaymentStatusBadge type={tx.type} />
                  <span className="tx-montant">{formatFCFA(tx.montant)}</span>
                  <span className="tx-date">{formatDate(tx.createdAt)}</span>
                  <Badge variant={tx.status === 'confirmed' ? 'success' : tx.status === 'failed' ? 'error' : 'pending'}>
                    {tx.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
