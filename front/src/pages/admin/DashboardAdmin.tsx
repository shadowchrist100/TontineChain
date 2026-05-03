import { useNavigate } from 'react-router-dom';
import { useAllTontines } from '../../hooks/useTontines';
import { useAllTransactions } from '../../hooks/usePaiements';
import { MOCK_USERS } from '../../mocks/users.mock';
import { Spinner } from '../../components/ui/Spinner';
import { Badge } from '../../components/ui/Badge';
import { PaymentStatusBadge } from '../../components/tontine/PaymentStatusBadge';
import { formatFCFA, formatDate, STATUS_VARIANT, STATUS_LABEL } from '../../utils/format';
import {
  Users, Activity, Coins, AlertTriangle,
  TrendingUp, ArrowRight, Shield
} from 'lucide-react';

export function DashboardAdmin() {
  const { data: tontines, isLoading: tLoading } = useAllTontines();
  const { data: transactions, isLoading: txLoading } = useAllTransactions();
  const navigate = useNavigate();

  if (tLoading || txLoading) return <div className="loading-center"><Spinner size="lg" /></div>;

  const activeTontines = (tontines ?? []).filter(t => t.status === 'active');
  const totalVolume = (transactions ?? [])
    .filter(t => t.status === 'confirmed')
    .reduce((acc, t) => acc + t.montant, 0);
  const pendingTx = (transactions ?? []).filter(t => t.status === 'pending');

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Tableau de bord Administrateur</h1>
          <p className="page-subtitle">Supervision globale de la plateforme TontineChain</p>
        </div>
        <div className="admin-badge">
          <Shield size={16} />
          <span>Admin</span>
        </div>
      </div>

      {/* KPIs globaux */}
      <div className="kpi-grid">
        {[
          {
            icon: <Coins size={28} />,
            label: 'Volume total (FCFA)',
            value: formatFCFA(totalVolume),
            sub: 'Transactions confirmées',
            color: 'var(--secondary)',
          },
          {
            icon: <Activity size={28} />,
            label: 'Tontines actives',
            value: activeTontines.length,
            sub: `${(tontines ?? []).length} tontines au total`,
            color: '#3B82F6',
          },
          {
            icon: <Users size={28} />,
            label: 'Utilisateurs inscrits',
            value: MOCK_USERS.length,
            sub: 'Membres + Organisateurs',
            color: '#8B5CF6',
          },
          {
            icon: <AlertTriangle size={28} />,
            label: 'Transactions en attente',
            value: pendingTx.length,
            sub: 'À surveiller',
            color: 'var(--tertiary)',
          },
        ].map(k => (
          <div key={k.label} className="kpi-card card">
            <div className="kpi-icon" style={{ color: k.color, background: k.color + '20' }}>
              {k.icon}
            </div>
            <div className="kpi-body">
              <div className="kpi-value">{k.value}</div>
              <div className="kpi-label">{k.label}</div>
              <div className="kpi-sub">{k.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        {/* Tontines actives récentes */}
        <div className="card">
          <div className="card-header-row">
            <h3 className="card-title"><Activity size={18} /> Tontines actives</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/tontines')} id="btn-voir-tontines">
              Voir toutes <ArrowRight size={14} />
            </button>
          </div>
          <div className="admin-list">
            {activeTontines.slice(0, 5).map(t => (
              <div key={t.id} className="admin-list-row">
                <div className="admin-row-info">
                  <span className="admin-row-name">{t.nom}</span>
                  <span className="admin-row-sub">{t.membresIds.length} membres · Tour {t.cycleActuel}/{t.nombreMembresMax}</span>
                </div>
                <Badge variant={STATUS_VARIANT[t.status]}>{STATUS_LABEL[t.status]}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Dernières transactions */}
        <div className="card">
          <div className="card-header-row">
            <h3 className="card-title"><TrendingUp size={18} /> Transactions récentes</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/logs')} id="btn-voir-logs">
              Logs <ArrowRight size={14} />
            </button>
          </div>
          <div className="admin-list">
            {(transactions ?? []).slice(0, 6).map(tx => (
              <div key={tx.id} className="admin-list-row">
                <PaymentStatusBadge type={tx.type} />
                <span className="admin-row-name">{formatFCFA(tx.montant)}</span>
                <span className="admin-row-sub">{formatDate(tx.createdAt)}</span>
                <Badge variant={tx.status === 'confirmed' ? 'success' : tx.status === 'failed' ? 'error' : 'pending'}>
                  {tx.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation rapide admin */}
      <div className="section">
        <h2 className="section-label">Navigation rapide</h2>
        <div className="quick-actions-grid">
          {[
            { label: 'Utilisateurs', icon: <Users size={20} />, path: '/admin/utilisateurs' },
            { label: 'Supervision', icon: <Activity size={20} />, path: '/admin/tontines' },
            { label: 'Litiges', icon: <AlertTriangle size={20} />, path: '/admin/litiges' },
            { label: 'Paramètres', icon: <Shield size={20} />, path: '/admin/parametres' },
          ].map(a => (
            <button
              key={a.label}
              className="quick-action-btn card"
              onClick={() => navigate(a.path)}
              id={`admin-qa-${a.label.toLowerCase()}`}
            >
              <div className="qa-icon">{a.icon}</div>
              <span>{a.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
