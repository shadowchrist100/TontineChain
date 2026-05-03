import { useState } from 'react';
import type { ReactElement } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTontine } from '../../hooks/useTontines';
import { Badge } from '../../components/ui/Badge';
import { CycleBar } from '../../components/tontine/CycleBar';
import { MemberAvatar } from '../../components/tontine/MemberAvatar';
import { PaymentStatusBadge } from '../../components/tontine/PaymentStatusBadge';
import { Spinner } from '../../components/ui/Spinner';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { MOCK_USERS } from '../../mocks/users.mock';
import { MOCK_TRANSACTIONS } from '../../mocks/transactions.mock';
import { formatDate, STATUS_VARIANT, STATUS_LABEL, cycleProgress } from '../../utils/format';
import { ArrowLeft, CreditCard, Users, Calendar, FileText, Activity } from 'lucide-react';

type Tab = 'regles' | 'membres' | 'cycle' | 'paiements';

function formatFCFA(n: number) {
  return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
}

export function TontineDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: tontine, isLoading } = useTontine(id!);
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('regles');

  if (isLoading) return <div className="loading-center"><Spinner size="lg" /></div>;
  if (!tontine) return <div className="page"><p>Tontine introuvable.</p></div>;

  const members = MOCK_USERS.filter(u => tontine.membresIds.includes(u.id));
  const txs = MOCK_TRANSACTIONS.filter(t => t.tontineId === tontine.id).slice(0, 8);
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
              <span className="meta-text">·</span>
              <span className="meta-text">{formatFCFA(tontine.montantCotisation)} / {tontine.frequenceCotisation}</span>
            </div>
          </div>
        </div>
        {tontine.status === 'active' && (
          <Link to={`/tontines/${tontine.id}/payer`} className="btn btn-primary" id="btn-payer">
            <CreditCard size={18} /> Payer ma cotisation
          </Link>
        )}
      </div>

      {/* Progression */}
      {tontine.status === 'active' && (
        <div className="card detail-progress">
          <div className="progress-header">
            <span>Progression du cycle</span>
            <strong>Tour {tontine.cycleActuel} / {tontine.nombreMembresMax}</strong>
          </div>
          <ProgressBar value={progress} max={100} showLabel />
        </div>
      )}

      {/* Tabs */}
      <div className="tabs">
        {([
          { key: 'regles', label: 'Règles', icon: <FileText size={16} /> },
          { key: 'membres', label: 'Membres', icon: <Users size={16} /> },
          { key: 'cycle', label: 'Cycle', icon: <Activity size={16} /> },
          { key: 'paiements', label: 'Paiements', icon: <CreditCard size={16} /> },
        ] as { key: Tab; label: string; icon: ReactElement }[]).map(t => (
          <button
            key={t.key}
            className={`tab-btn ${tab === t.key ? 'active' : ''}`}
            onClick={() => setTab(t.key)}
            id={`tab-${t.key}`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {tab === 'regles' && (
          <div className="card rules-card">
            <h3 className="card-subtitle">Paramètres de la tontine</h3>
            <dl className="rules-list">
              <div className="rule-item"><dt>Montant de la mise</dt><dd>{formatFCFA(tontine.montantCotisation)}</dd></div>
              <div className="rule-item"><dt>Fréquence</dt><dd className="capitalize">{tontine.frequenceCotisation}</dd></div>
              <div className="rule-item"><dt>Membres max</dt><dd>{tontine.nombreMembresMax}</dd></div>
              <div className="rule-item"><dt>Cagnotte totale</dt><dd className="highlight">{formatFCFA(tontine.montantCotisation * tontine.nombreMembresMax)}</dd></div>
              <div className="rule-item"><dt>Pénalité retard</dt><dd>{formatFCFA(tontine.penalites.retardMontant)}</dd></div>
              <div className="rule-item"><dt>Pénalité dépassement</dt><dd>{formatFCFA(tontine.penalites.depassementDelai)}</dd></div>
              <div className="rule-item"><dt>Intérêt tontinier</dt><dd>{tontine.penalites.interetTontinier}%</dd></div>
              {tontine.demarreAt && (
                <div className="rule-item">
                  <dt><Calendar size={14} /> Démarré le</dt>
                  <dd>{formatDate(tontine.demarreAt, 'EEEE d MMMM yyyy')}</dd>
                </div>
              )}
            </dl>
          </div>
        )}

        {tab === 'membres' && (
          <div className="card">
            <h3 className="card-subtitle">Membres ({members.length}/{tontine.nombreMembresMax})</h3>
            <div className="members-list">
              {members.map((m, i) => (
                <div key={m.id} className="member-row">
                  <MemberAvatar nom={m.nom} prenom={m.prenom} size="md" />
                  <div className="member-info">
                    <span className="member-name">{m.prenom} {m.nom}</span>
                    <span className="member-phone">{m.telephone}</span>
                  </div>
                  <div className="member-meta">
                    {m.role === 'organisateur' && <Badge variant="info">Organisateur</Badge>}
                    <span className="member-position">Tour #{i + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'cycle' && (
          <div className="card">
            <h3 className="card-subtitle">Cycle de passage</h3>
            <p className="card-desc">Visualisation de l'ordre de passage des bénéficiaires.</p>
            <div className="cycle-wrapper">
              <CycleBar
                total={tontine.nombreMembresMax}
                current={tontine.cycleActuel}
                beneficiaries={members.map(m => m.prenom)}
              />
            </div>
          </div>
        )}

        {tab === 'paiements' && (
          <div className="card">
            <h3 className="card-subtitle">Derniers paiements</h3>
            {txs.length === 0 ? (
              <p className="empty-text">Aucune transaction pour cette tontine.</p>
            ) : (
              <div className="transactions-list">
                {txs.map(tx => (
                  <div key={tx.id} className="tx-row">
                    <PaymentStatusBadge type={tx.type} />
                    <div className="tx-info">
                      <span className="tx-montant">{formatFCFA(tx.montant)}</span>
                      <span className="tx-date">{formatDate(tx.createdAt)}</span>
                    </div>
                    <Badge variant={tx.status === 'confirmed' ? 'success' : tx.status === 'failed' ? 'error' : 'pending'}>
                      {tx.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
