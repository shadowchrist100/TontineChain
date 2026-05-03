// pages/public/InvitationPage.tsx
import { useParams, Link } from 'react-router-dom';
import { Shield, Users, Calendar, Coins, Check, X, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ConfirmModal } from '../../components/ui/Modal';
import { MOCK_TONTINES } from '../../mocks/tontines.mock';
import { useAuthStore } from '../../stores/authStore';
import { toast } from 'sonner';

const formatFCFA = (n: number) =>
  new Intl.NumberFormat('fr-BJ', { style: 'currency', currency: 'XOF' }).format(n);

const freqLabel: Record<string, string> = {
  hebdomadaire: 'Hebdomadaire', mensuel: 'Mensuel', bimensuel: 'Bimensuel',
};

export const InvitationPage = () => {
  const { lienId }    = useParams<{ lienId: string }>();
  const isAuth        = useAuthStore((s) => s.isAuthenticated);
  const [accepted, setAccepted]   = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading]     = useState(false);

  const tontine = MOCK_TONTINES.find((t) => t.lienInvitation.includes(lienId ?? ''));

  if (!tontine) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-background)' }}>
      <div style={{ textAlign: 'center' }}>
        <AlertTriangle size={48} color="var(--color-error)" style={{ marginInline: 'auto', marginBottom: 'var(--space-4)' }} />
        <h2 style={{ font: 'var(--text-h2)', color: 'var(--color-on-surface)', marginBottom: 'var(--space-2)' }}>Lien invalide</h2>
        <p style={{ font: 'var(--text-body-md)', color: 'var(--color-on-surface-variant)' }}>Ce lien d'invitation n'existe pas ou a expiré.</p>
        <Link to="/"><Button variant="outline" style={{ marginTop: 'var(--space-6)' }}>Retour à l'accueil</Button></Link>
      </div>
    </div>
  );

  const handleAccept = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setAccepted(true);
    setConfirmOpen(false);
    toast.success('Vous avez rejoint la tontine avec succès !');
  };

  const rules = [
    `Cotisation : ${formatFCFA(tontine.montantCotisation)} / ${freqLabel[tontine.frequenceCotisation].toLowerCase()}`,
    `Nombre max de membres : ${tontine.nombreMembresMax}`,
    `Ordre de passage : ${tontine.ordreType === 'fixe' ? 'Fixe (défini par l\'organisateur)' : 'Tirage au sort'}`,
    `Pénalité de retard : ${formatFCFA(tontine.penalites.retardMontant)}`,
    `Retrait anticipé : 1/3 de la cagnotte retenu`,
    `Aucune modification des règles possible après le démarrage`,
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-background)', padding: 'var(--space-8) var(--space-4)' }}>
      <div style={{ maxWidth: '640px', marginInline: 'auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <div style={{
            width: '64px', height: '64px',
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
            borderRadius: 'var(--radius-xl)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginInline: 'auto', marginBottom: 'var(--space-4)', boxShadow: 'var(--shadow-md)',
          }}>
            <Shield size={32} color="#fff" />
          </div>
          <p style={{ font: 'var(--text-label)', color: 'var(--color-secondary)', letterSpacing: '0.1em', marginBottom: 'var(--space-2)' }}>INVITATION À REJOINDRE</p>
          <h1 style={{ font: 'var(--text-h1)', color: 'var(--color-on-surface)', marginBottom: 'var(--space-2)' }}>{tontine.nom}</h1>
          {tontine.description && (
            <p style={{ font: 'var(--text-body-md)', color: 'var(--color-on-surface-variant)' }}>{tontine.description}</p>
          )}
        </div>

        {accepted ? (
          <Card>
            <div style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
              <div style={{ width: '64px', height: '64px', background: 'var(--color-success-bg)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginInline: 'auto', marginBottom: 'var(--space-4)' }}>
                <Check size={32} color="var(--color-success)" />
              </div>
              <h2 style={{ font: 'var(--text-h2)', color: 'var(--color-on-surface)', marginBottom: 'var(--space-3)' }}>Bienvenue dans la tontine !</h2>
              <p style={{ font: 'var(--text-body-md)', color: 'var(--color-on-surface-variant)', marginBottom: 'var(--space-6)' }}>
                Vous avez accepté les règles et rejoint la tontine avec succès.
              </p>
              <Link to={isAuth ? '/tableau-de-bord' : '/connexion'}>
                <Button>Accéder à mon tableau de bord</Button>
              </Link>
            </div>
          </Card>
        ) : (
          <>
            {/* Détails */}
            <div className="grid-2" style={{ marginBottom: 'var(--space-6)' }}>
              {[
                { icon: <Coins size={20} color="var(--color-secondary)" />, label: 'Cotisation', value: formatFCFA(tontine.montantCotisation) },
                { icon: <Calendar size={20} color="var(--color-tertiary)" />, label: 'Fréquence', value: freqLabel[tontine.frequenceCotisation] },
                { icon: <Users size={20} color="var(--color-secondary)" />, label: 'Membres', value: `${tontine.membresIds.length} / ${tontine.nombreMembresMax}` },
                { icon: <Shield size={20} color="var(--color-primary)" />, label: 'Statut', value: tontine.status === 'adhesion' ? 'Ouvert aux adhésions' : 'En cours' },
              ].map((item) => (
                <Card key={item.label} flat>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div style={{ width: '40px', height: '40px', background: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {item.icon}
                    </div>
                    <div>
                      <p style={{ font: 'var(--text-label)', color: 'var(--color-on-surface-variant)', marginBottom: '2px' }}>{item.label}</p>
                      <p style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, color: 'var(--color-on-surface)' }}>{item.value}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Règles */}
            <Card style={{ marginBottom: 'var(--space-6)' }}>
              <h3 style={{ font: 'var(--text-h3)', color: 'var(--color-on-surface)', marginBottom: 'var(--space-4)' }}>
                📋 Règles de la tontine
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {rules.map((rule) => (
                  <div key={rule} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
                    <Check size={16} color="var(--color-secondary)" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <p style={{ font: 'var(--text-body-sm)', color: 'var(--color-on-surface)', lineHeight: 1.6 }}>{rule}</p>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 'var(--space-5)', padding: 'var(--space-4)', background: 'var(--color-warning-bg)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--color-warning)' }}>
                <p style={{ font: 'var(--text-body-sm)', color: 'var(--color-pending)', fontWeight: 600 }}>
                  ⚠️ En acceptant ces règles, vous vous engagez à respecter toutes les conditions de cette tontine. Cet engagement est enregistré sur la blockchain.
                </p>
              </div>
            </Card>

            {/* Actions */}
            {!isAuth ? (
              <Card flat>
                <p style={{ font: 'var(--text-body-md)', color: 'var(--color-on-surface-variant)', marginBottom: 'var(--space-4)', textAlign: 'center' }}>
                  Connectez-vous ou créez un compte pour rejoindre cette tontine.
                </p>
                <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
                  <Link to={`/connexion`}><Button variant="primary">Se connecter</Button></Link>
                  <Link to={`/inscription`}><Button variant="outline">Créer un compte</Button></Link>
                </div>
              </Card>
            ) : (
              <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                <Button variant="danger" fullWidth icon={<X size={18} />}>Refuser</Button>
                <Button variant="secondary" fullWidth icon={<Check size={18} />} onClick={() => setConfirmOpen(true)}>
                  Accepter et rejoindre
                </Button>
              </div>
            )}
          </>
        )}

        <ConfirmModal
          isOpen={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={handleAccept}
          title="Confirmer votre adhésion"
          message={`Vous êtes sur le point de rejoindre "${tontine.nom}". En confirmant, vous acceptez toutes les règles et vous vous engagez à payer vos cotisations. Cet engagement sera enregistré sur la blockchain.`}
          confirmLabel="Oui, je rejoins la tontine"
          loading={loading}
        />
      </div>
    </div>
  );
};
