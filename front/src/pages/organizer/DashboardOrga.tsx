import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useTontinesOrga } from '../../hooks/useTontines';
import { Spinner } from '../../components/ui/Spinner';
import { TontineCard } from '../../components/tontine/TontineCard';
import { formatFCFA } from '../../utils/format';
import {
  Users, TrendingUp, AlertTriangle, PlusCircle,
  ArrowRight, Calendar, Coins, Activity
} from 'lucide-react';

export function DashboardOrga() {
  const user = useAuthStore(s => s.user);
  const navigate = useNavigate();
  const { data: tontines, isLoading } = useTontinesOrga(user?.id ?? '');

  if (isLoading) return <div className="loading-center"><Spinner size="lg" /></div>;

  const activeTontines = (tontines ?? []).filter(t => t.status === 'active');
  const pendingTontines = (tontines ?? []).filter(t => t.status === 'adhesion');
  const totalMembers = (tontines ?? []).reduce((acc, t) => acc + t.membresIds.length, 0);
  const totalVolume = (tontines ?? []).reduce(
    (acc, t) => acc + t.montantCotisation * t.nombreMembresMax,
    0
  );

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Tableau de bord Organisateur</h1>
          <p className="page-subtitle">Bienvenue, {user?.prenom} ! Voici un aperçu de vos tontines.</p>
        </div>
        <button
          className="btn btn-primary"
          id="btn-creer-tontine-orga"
          onClick={() => navigate('/orga/creer')}
        >
          <PlusCircle size={18} /> Créer une tontine
        </button>
      </div>

      {/* KPIs */}
      <div className="kpi-grid">
        {[
          {
            icon: <Activity size={24} />,
            label: 'Tontines actives',
            value: activeTontines.length,
            color: 'var(--secondary)',
          },
          {
            icon: <Users size={24} />,
            label: 'Total membres',
            value: totalMembers,
            color: '#3B82F6',
          },
          {
            icon: <AlertTriangle size={24} />,
            label: 'En attente d\'adhésion',
            value: pendingTontines.length,
            color: 'var(--tertiary)',
          },
          {
            icon: <Coins size={24} />,
            label: 'Volume total géré',
            value: formatFCFA(totalVolume),
            color: '#8B5CF6',
          },
        ].map(k => (
          <div key={k.label} className="kpi-card card">
            <div className="kpi-icon" style={{ color: k.color, background: k.color + '20' }}>
              {k.icon}
            </div>
            <div>
              <div className="kpi-value">{k.value}</div>
              <div className="kpi-label">{k.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Mes tontines */}
      <div className="section">
        <div className="section-header">
          <h2 className="section-label">Mes tontines</h2>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/mes-tontines')} id="btn-voir-toutes">
            Voir toutes <ArrowRight size={16} />
          </button>
        </div>
        {(tontines ?? []).length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🏦</div>
            <h3>Aucune tontine créée</h3>
            <p>Créez votre première tontine pour commencer.</p>
            <button className="btn btn-primary" onClick={() => navigate('/orga/creer')} id="btn-creer-empty">
              <PlusCircle size={18} /> Créer une tontine
            </button>
          </div>
        ) : (
          <div className="tontines-grid">
            {(tontines ?? []).slice(0, 4).map(t => (
              <TontineCard
                key={t.id}
                tontine={t}
                onClick={() => navigate(`/orga/tontines/${t.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Actions rapides */}
      <div className="section">
        <h2 className="section-label">Actions rapides</h2>
        <div className="quick-actions-grid">
          {[
            { label: 'Valider des membres', icon: <Users size={20} />, path: '/mes-tontines' },
            { label: 'Créer une tontine', icon: <PlusCircle size={20} />, path: '/orga/creer' },
            { label: 'Envoyer un message', icon: <Calendar size={20} />, path: '/orga/messagerie' },
            { label: 'Voir l\'historique', icon: <TrendingUp size={20} />, path: '/orga/historique' },
          ].map(a => (
            <button
              key={a.label}
              className="quick-action-btn card"
              onClick={() => navigate(a.path)}
              id={`qa-${a.label.toLowerCase().replace(/\s/g, '-')}`}
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
