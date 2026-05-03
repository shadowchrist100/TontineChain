import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTontine } from '../../hooks/useTontines';
import { Modal } from '../../components/ui/Modal';
import { Spinner } from '../../components/ui/Spinner';
import { Badge } from '../../components/ui/Badge';
import { formatFCFA, STATUS_VARIANT } from '../../utils/format';
import { ArrowLeft, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export function ClotureTontine() {
  const { id } = useParams<{ id: string }>();
  const { data: tontine, isLoading } = useTontine(id!);
  const navigate = useNavigate();
  const [step, setStep] = useState<'review' | 'confirm1' | 'confirm2' | 'done'>('review');
  const [typed, setTyped] = useState('');

  if (isLoading) return <div className="loading-center"><Spinner size="lg" /></div>;
  if (!tontine) return <div className="page"><p>Tontine introuvable.</p></div>;

  const canClose = tontine.status === 'active' || tontine.status === 'adhesion';
  const confirmPhrase = tontine.nom.toUpperCase();

  const handleClose = () => {
    toast.success(`Tontine "${tontine.nom}" clôturée avec succès !`);
    setStep('done');
    setTimeout(() => navigate('/mes-tontines'), 2500);
  };

  if (!canClose) {
    return (
      <div className="page page-narrow">
        <div className="page-header">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}><ArrowLeft size={16} /> Retour</button>
          <h1 className="page-title">Clôture de la Tontine</h1>
        </div>
        <div className="card">
          <div className="info-block">
            <XCircle size={48} className="color-error" />
            <h3>Clôture impossible</h3>
            <p>Cette tontine est déjà <strong>{tontine.status}</strong> et ne peut pas être clôturée.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page page-narrow">
      <div className="page-header">
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}><ArrowLeft size={16} /> Retour</button>
        <h1 className="page-title">Clôture de la Tontine</h1>
      </div>

      {step === 'done' ? (
        <div className="card info-block">
          <CheckCircle size={72} className="color-success" />
          <h2>Tontine clôturée !</h2>
          <p>Toutes les données ont été archivées sur la blockchain.</p>
          <Spinner size="sm" />
        </div>
      ) : (
        <>
          <div className="alert alert-error">
            <AlertTriangle size={20} />
            <p><strong>Action irréversible !</strong> La clôture mettra fin à toutes les cotisations et distributions en cours.</p>
          </div>

          <div className="card">
            <h3 className="card-title">Résumé de la tontine</h3>
            <dl className="recap-list">
              <div className="recap-item"><dt>Nom</dt><dd>{tontine.nom}</dd></div>
              <div className="recap-item"><dt>Statut</dt><dd><Badge variant={STATUS_VARIANT[tontine.status]}>{tontine.status}</Badge></dd></div>
              <div className="recap-item"><dt>Cycle actuel</dt><dd>Tour {tontine.cycleActuel} / {tontine.nombreMembresMax}</dd></div>
              <div className="recap-item"><dt>Volume géré</dt><dd>{formatFCFA(tontine.montantCotisation * tontine.cycleActuel)}</dd></div>
              {tontine.smartContractAddress && (
                <div className="recap-item"><dt>Smart Contract</dt><dd><code className="hash-short">{tontine.smartContractAddress.slice(0, 18)}…</code></dd></div>
              )}
            </dl>

            <div className="form-group mt-2">
              <label htmlFor="confirm-phrase" className="form-label">
                Tapez <strong>{confirmPhrase}</strong> pour confirmer :
              </label>
              <input
                id="confirm-phrase"
                className="form-input"
                value={typed}
                onChange={e => setTyped(e.target.value)}
                placeholder={confirmPhrase}
              />
            </div>

            <button
              className="btn btn-danger btn-full"
              id="btn-cloture"
              disabled={typed !== confirmPhrase}
              onClick={() => setStep('confirm1')}
            >
              <XCircle size={18} /> Clôturer la tontine
            </button>
          </div>
        </>
      )}

      <Modal isOpen={step === 'confirm1'} onClose={() => setStep('review')} title="Première confirmation">
        <div className="modal-confirm">
          <AlertTriangle size={32} className="color-error" />
          <p>Êtes-vous <strong>absolument certain</strong> de vouloir clôturer cette tontine ?</p>
          <p className="modal-note">Cette action est irréversible.</p>
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={() => setStep('review')}>Annuler</button>
            <button className="btn btn-danger" id="btn-confirm1" onClick={() => setStep('confirm2')}>Oui, je confirme</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={step === 'confirm2'} onClose={() => setStep('review')} title="Confirmation finale">
        <div className="modal-confirm">
          <p>Dernière confirmation. Cette action <strong>ne peut pas être annulée</strong>.</p>
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={() => setStep('review')}>Annuler</button>
            <button className="btn btn-danger" id="btn-confirm2" onClick={handleClose}>Confirmer la clôture définitive</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
