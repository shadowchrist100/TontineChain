import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTontine } from '../../hooks/useTontines';
import { usePayerCotisation } from '../../hooks/usePaiements';
import { Modal } from '../../components/ui/Modal';
import { Spinner } from '../../components/ui/Spinner';
import { Badge } from '../../components/ui/Badge';
import { STATUS_VARIANT } from '../../utils/format';
import { ArrowLeft, Smartphone, CheckCircle, Clock } from 'lucide-react';

function formatFCFA(n: number) {
  return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
}

type Operateur = 'mtn_money' | 'moov_money';
type PaiementState = 'form' | 'confirm' | 'attente' | 'succes';

export function PaiementPage() {
  const { id } = useParams<{ id: string }>();
  const { data: tontine, isLoading } = useTontine(id!);
  const { mutateAsync: payer, isPending } = usePayerCotisation();
  const navigate = useNavigate();

  const [operateur, setOperateur] = useState<Operateur>('mtn_money');
  const [telephone, setTelephone] = useState('');
  const [state, setState] = useState<PaiementState>('form');
  const [countdown, setCountdown] = useState(60);

  if (isLoading) return <div className="loading-center"><Spinner size="lg" /></div>;
  if (!tontine) return <div className="page"><p>Tontine introuvable.</p></div>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setState('confirm');
  };

  const handleConfirm = async () => {
    setState('attente');
    let c = 60;
    const timer = setInterval(() => {
      c -= 1;
      setCountdown(c);
      if (c <= 0) { clearInterval(timer); setState('succes'); }
    }, 1000);

    try {
      await payer({
        tontineId: tontine.id,
        montant: tontine.montantCotisation,
        paymentMethod: operateur,
        phoneNumber: telephone,
      });
    } catch {
      clearInterval(timer);
      setState('form');
    }
  };

  return (
    <div className="page page-narrow">
      <div className="page-header">
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Retour
        </button>
        <h1 className="page-title">Payer ma cotisation</h1>
      </div>

      <div className="card payment-card">
        <div className="payment-tontine-info">
          <h2 className="payment-tontine-name">{tontine.nom}</h2>
          <div className="payment-amount">{formatFCFA(tontine.montantCotisation)}</div>
          <Badge variant={STATUS_VARIANT[tontine.status]}>Cotisation cycle en cours</Badge>
        </div>

        {state === 'form' && (
          <form onSubmit={handleSubmit} className="payment-form">
            <div className="form-group">
              <label className="form-label">Opérateur Mobile Money</label>
              <div className="operator-selector">
                {([['mtn_money', 'MTN MoMo'], ['moov_money', 'Moov Money']] as [Operateur, string][]).map(([op, label]) => (
                  <button
                    type="button"
                    key={op}
                    id={`op-${op}`}
                    className={`operator-btn ${operateur === op ? 'selected' : ''}`}
                    onClick={() => setOperateur(op)}
                  >
                    <Smartphone size={20} />
                    <span>{label}</span>
                    {operateur === op && <CheckCircle size={16} className="op-check" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="tel-paiement" className="form-label">Numéro de téléphone</label>
              <input
                id="tel-paiement"
                type="tel"
                className="form-input"
                placeholder="+229 XX XX XX XX"
                value={telephone}
                onChange={e => setTelephone(e.target.value)}
                required
              />
            </div>

            <button type="submit" id="btn-confirmer-paiement" className="btn btn-primary btn-full" disabled={!telephone}>
              Procéder au paiement — {formatFCFA(tontine.montantCotisation)}
            </button>
          </form>
        )}

        {state === 'attente' && (
          <div className="payment-waiting">
            <div className="waiting-icon"><Clock size={48} /></div>
            <h3>En attente de confirmation</h3>
            <p>Validez le paiement sur votre téléphone ({operateur === 'mtn_money' ? 'MTN' : 'Moov'}).</p>
            <div className="countdown-ring">
              <svg viewBox="0 0 60 60" className="countdown-svg">
                <circle cx="30" cy="30" r="26" fill="none" stroke="var(--color-surface-container-high)" strokeWidth="4" />
                <circle cx="30" cy="30" r="26" fill="none" stroke="var(--color-secondary)" strokeWidth="4"
                  strokeDasharray={`${(countdown / 60) * 163} 163`} strokeLinecap="round" transform="rotate(-90 30 30)" />
              </svg>
              <span className="countdown-val">{countdown}s</span>
            </div>
            <Spinner size="sm" />
          </div>
        )}

        {state === 'succes' && (
          <div className="payment-success">
            <div className="success-icon"><CheckCircle size={64} /></div>
            <h3>Paiement confirmé !</h3>
            <p>Votre cotisation de {formatFCFA(tontine.montantCotisation)} a été enregistrée sur la blockchain.</p>
            <button className="btn btn-primary" onClick={() => navigate('/historique')} id="btn-voir-historique">
              Voir mon historique
            </button>
          </div>
        )}
      </div>

      <Modal isOpen={state === 'confirm'} onClose={() => setState('form')} title="Confirmer le paiement">
        <div className="modal-confirm">
          <p>Vous allez payer <strong>{formatFCFA(tontine.montantCotisation)}</strong> via <strong>{operateur === 'mtn_money' ? 'MTN MoMo' : 'Moov Money'}</strong>.</p>
          <p className="modal-note">Le montant sera débité du numéro <strong>{telephone}</strong>.</p>
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={() => setState('form')} id="btn-annuler">Annuler</button>
            <button className="btn btn-primary" onClick={handleConfirm} disabled={isPending} id="btn-valider-paiement">
              {isPending ? <Spinner size="sm" /> : 'Confirmer'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
