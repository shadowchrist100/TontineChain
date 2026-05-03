import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTontine } from '../../hooks/useTontines';
import { Modal } from '../../components/ui/Modal';
import { Spinner } from '../../components/ui/Spinner';
import { Badge } from '../../components/ui/Badge';
import { CheckCircle, ArrowLeft, Users, Coins, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

function formatFCFA(n: number) {
  return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
}

export function RejoindreTonitne() {
  const { id } = useParams<{ id: string }>();
  const { data: tontine, isLoading } = useTontine(id!);
  const navigate = useNavigate();
  const [accepted, setAccepted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [joined, setJoined] = useState(false);

  if (isLoading) return <div className="loading-center"><Spinner size="lg" /></div>;
  if (!tontine) return <div className="page"><p>Tontine introuvable.</p></div>;

  const handleJoin = () => {
    setJoined(true);
    setShowModal(false);
    toast.success(`Vous avez rejoint "${tontine.nom}" avec succès !`);
    setTimeout(() => navigate('/mes-tontines'), 2000);
  };

  return (
    <div className="page page-narrow">
      <div className="page-header">
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Retour
        </button>
        <h1 className="page-title">Rejoindre la Tontine</h1>
      </div>

      {joined ? (
        <div className="card join-success">
          <CheckCircle size={64} className="join-success-icon" />
          <h2>Vous avez rejoint la tontine !</h2>
          <p>Redirection vers vos tontines…</p>
        </div>
      ) : (
        <>
          <div className="card join-info-card">
            <h2 className="join-tontine-name">{tontine.nom}</h2>
            <Badge variant={tontine.status === 'adhesion' ? 'info' : 'success'}>
              {tontine.status === 'adhesion' ? "En cours d'adhésion" : 'Active'}
            </Badge>

            <div className="join-stats">
              <div className="join-stat">
                <Coins size={20} className="join-stat-icon" />
                <div>
                  <span className="join-stat-label">Mise / cycle</span>
                  <span className="join-stat-val">{formatFCFA(tontine.montantCotisation)}</span>
                </div>
              </div>
              <div className="join-stat">
                <Users size={20} className="join-stat-icon" />
                <div>
                  <span className="join-stat-label">Membres max</span>
                  <span className="join-stat-val">{tontine.nombreMembresMax}</span>
                </div>
              </div>
              <div className="join-stat">
                <Coins size={20} className="join-stat-icon" />
                <div>
                  <span className="join-stat-label">Cagnotte totale</span>
                  <span className="join-stat-val highlight">
                    {formatFCFA(tontine.montantCotisation * tontine.nombreMembresMax)}
                  </span>
                </div>
              </div>
              {tontine.demarreAt && (
                <div className="join-stat">
                  <Calendar size={20} className="join-stat-icon" />
                  <div>
                    <span className="join-stat-label">Date de démarrage</span>
                    <span className="join-stat-val">
                      {format(new Date(tontine.demarreAt), 'd MMM yyyy', { locale: fr })}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="card rules-agreement">
            <h3 className="rules-title">Règles et engagements</h3>
            <ul className="rules-list-items">
              <li>Je m'engage à payer ma cotisation de <strong>{formatFCFA(tontine.montantCotisation)}</strong> à chaque cycle.</li>
              <li>En cas de retard, une pénalité de <strong>{formatFCFA(tontine.penalites.retardMontant)}</strong> sera appliquée.</li>
              <li>En cas de dépassement de délai, une pénalité de <strong>{formatFCFA(tontine.penalites.depassementDelai)}</strong> sera appliquée.</li>
              <li>Mon ordre de passage sera défini par l'organisateur.</li>
              <li>Toutes les transactions seront enregistrées sur la blockchain.</li>
            </ul>

            <label className="agreement-checkbox" htmlFor="chk-accept">
              <input
                type="checkbox"
                id="chk-accept"
                checked={accepted}
                onChange={e => setAccepted(e.target.checked)}
              />
              <span>J'ai lu et j'accepte les règles de cette tontine</span>
            </label>

            <button
              className="btn btn-primary btn-full"
              id="btn-rejoindre"
              disabled={!accepted}
              onClick={() => setShowModal(true)}
            >
              Rejoindre la tontine
            </button>
          </div>
        </>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Confirmer l'adhésion">
        <div className="modal-confirm">
          <p>Vous êtes sur le point de rejoindre <strong>{tontine.nom}</strong>.</p>
          <p className="modal-note">Votre demande sera envoyée à l'organisateur pour validation.</p>
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Annuler</button>
            <button className="btn btn-primary" id="btn-confirm-rejoindre" onClick={handleJoin}>
              Confirmer l'adhésion
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
