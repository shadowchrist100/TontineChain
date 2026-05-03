// pages/member/DashboardMembre.tsx
import { Link } from 'react-router-dom';
import { ArrowRight, CreditCard, Clock, TrendingUp, Bell } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuthStore } from '../../stores/authStore';
import { useTontines } from '../../hooks/useTontines';
import { usePaiements } from '../../hooks/usePaiements';
import { KpiCard, Card } from '../../components/ui/Card';
import { TontineBadge, TransactionBadge } from '../../components/ui/Badge';
import { CycleProgress } from '../../components/ui/ProgressBar';
import { PageLoader } from '../../components/ui/Spinner';
import { Button } from '../../components/ui/Button';

const formatFCFA = (n: number) => new Intl.NumberFormat('fr-BJ', { style: 'currency', currency: 'XOF' }).format(n);

export const DashboardMembre = () => {
  const user = useAuthStore((s) => s.user);
  const { data: tontines, isLoading: loadingTontines } = useTontines(user?.id ?? '');
  const { data: transactions, isLoading: loadingTx }   = usePaiements(user?.id ?? '');

  if (loadingTontines || loadingTx) return <PageLoader />;

  const activeTontines  = tontines?.filter((t) => t.status === 'active') ?? [];
  const totalCotisations = transactions?.filter((t) => t.status === 'confirmed' && t.type === 'cotisation').reduce((acc, t) => acc + t.montant, 0) ?? 0;
  const recentTx = (transactions ?? []).slice(0, 5);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>Bonjour, {user?.prenom} 👋</h1>
        <p>Voici un aperçu de votre activité TontineChain</p>
      </div>

      {/* KPIs */}
      <div className="grid-4" style={{ marginBottom: 'var(--space-8)' }}>
        <KpiCard label="Tontines actives" value={String(activeTontines.length)} icon={<TrendingUp size={22} color="var(--color-secondary)" />} iconBg="var(--color-success-bg)" />
        <KpiCard label="Total cotisations" value={formatFCFA(totalCotisations)} icon={<CreditCard size={22} color="var(--color-tertiary)" />} iconBg="var(--color-warning-bg)" />
        <KpiCard label="Transactions" value={String(transactions?.length ?? 0)} icon={<Clock size={22} color="var(--color-primary)" />} iconBg="var(--color-primary-fixed)" />
        <KpiCard label="Position moyenne" value="#2" sub="dans vos tontines" icon={<Bell size={22} color="var(--color-secondary)" />} iconBg="var(--color-success-bg)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-6)' }}>
        {/* Tontines actives */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h2 style={{ font: 'var(--text-h3)' }}>Mes Tontines</h2>
            <Link to="/mes-tontines"><Button variant="ghost" size="sm" icon={<ArrowRight size={14} />} iconPosition="right">Voir tout</Button></Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {(tontines ?? []).length === 0 ? (
              <Card flat><p style={{ font: 'var(--text-body-md)', color: 'var(--color-on-surface-variant)', textAlign: 'center', padding: 'var(--space-8)' }}>Aucune tontine pour l'instant.</p></Card>
            ) : (
              (tontines ?? []).map((t) => (
                <Card key={t.id} hoverable>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
                    <div>
                      <h3 style={{ font: 'var(--text-h4)', marginBottom: 'var(--space-1)' }}>{t.nom}</h3>
                      <p style={{ font: 'var(--text-body-sm)', color: 'var(--color-on-surface-variant)' }}>
                        {formatFCFA(t.montantCotisation)} / {t.frequenceCotisation}
                      </p>
                    </div>
                    <TontineBadge status={t.status} />
                  </div>
                  {t.status === 'active' && (
                    <CycleProgress currentCycle={t.cycleActuel} totalCycles={t.nombreMembresMax} />
                  )}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-4)' }}>
                    <Link to={`/tontines/${t.id}`}>
                      <Button size="sm" variant="outline" icon={<ArrowRight size={14} />} iconPosition="right">Détails</Button>
                    </Link>
                    {t.status === 'active' && (
                      <Link to={`/tontines/${t.id}/payer`} style={{ marginLeft: 'var(--space-3)' }}>
                        <Button size="sm">Payer</Button>
                      </Link>
                    )}
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Activité récente */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h2 style={{ font: 'var(--text-h3)' }}>Activité récente</h2>
            <Link to="/historique"><Button variant="ghost" size="sm">Tout voir</Button></Link>
          </div>
          <Card style={{ padding: 0 }}>
            {recentTx.length === 0 ? (
              <p style={{ padding: 'var(--space-6)', font: 'var(--text-body-sm)', color: 'var(--color-on-surface-variant)', textAlign: 'center' }}>Aucune transaction.</p>
            ) : (
              recentTx.map((tx, i) => (
                <Link key={tx.id} to={`/transactions/${tx.id}`} style={{ display: 'block', textDecoration: 'none' }}>
                  <div style={{
                    padding: 'var(--space-4) var(--space-5)',
                    borderBottom: i < recentTx.length - 1 ? '1px solid var(--color-surface-container-high)' : 'none',
                    transition: 'background var(--transition-fast)',
                  }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-surface-container-low)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-1)' }}>
                      <p style={{ font: 'var(--text-body-sm)', fontWeight: 700, color: 'var(--color-on-surface)', textTransform: 'capitalize' }}>{tx.type}</p>
                      <TransactionBadge status={tx.status} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <p style={{ font: 'var(--text-body-sm)', color: 'var(--color-on-surface-variant)' }}>
                        {format(new Date(tx.createdAt), 'dd MMM yyyy', { locale: fr })}
                      </p>
                      <p style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, color: 'var(--color-on-surface)', fontSize: '13px' }}>
                        {formatFCFA(tx.montant)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
