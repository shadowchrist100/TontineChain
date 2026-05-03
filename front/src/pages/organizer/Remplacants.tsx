import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTontine } from '../../hooks/useTontines';
import { MemberAvatar } from '../../components/tontine/MemberAvatar';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Spinner } from '../../components/ui/Spinner';
import { MOCK_USERS } from '../../mocks/users.mock';
import { ArrowLeft, UserPlus, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface Remplacement {
  abscentId: string;
  remplacantId: string;
}

export function Remplacants() {
  const { id } = useParams<{ id: string }>();
  const { data: tontine, isLoading } = useTontine(id!);
  const navigate = useNavigate();
  const [selectedAbsent, setSelectedAbsent] = useState<string | null>(null);
  const [selectedRemplacant, setSelectedRemplacant] = useState<string>('');
  const [remplacements, setRemplacements] = useState<Remplacement[]>([]);
  const [showModal, setShowModal] = useState(false);

  if (isLoading) return <div className="loading-center"><Spinner size="lg" /></div>;
  if (!tontine) return <div className="page"><p>Tontine introuvable.</p></div>;

  const members = MOCK_USERS.filter(u => tontine.membresIds.includes(u.id));

  const handleConfirm = () => {
    if (!selectedAbsent || !selectedRemplacant) return;
    setRemplacements(prev => [...prev, { abscentId: selectedAbsent, remplacantId: selectedRemplacant }]);
    toast.success('Remplaçant désigné avec succès !');
    setShowModal(false);
    setSelectedAbsent(null);
    setSelectedRemplacant('');
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-header-left">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} /> Retour
          </button>
          <div>
            <h1 className="page-title">Gestion des Remplaçants</h1>
            <p className="page-subtitle">Désignez un remplaçant pour un membre absent</p>
          </div>
        </div>
      </div>

      <div className="alert alert-warning">
        <AlertTriangle size={18} />
        <p>Un remplaçant ne peut <strong>pas</strong> recevoir la cagnotte des tours passés. Il peut uniquement cotiser à la place du membre absent.</p>
      </div>

      <div className="card">
        <h3 className="card-title">Membres — Sélectionnez un absent</h3>
        <div className="members-list">
          {members.map(m => {
            const remplacement = remplacements.find(r => r.abscentId === m.id);
            const remplacant = remplacement ? MOCK_USERS.find(u => u.id === remplacement.remplacantId) : null;
            return (
              <div key={m.id} className="member-row">
                <MemberAvatar nom={m.nom} prenom={m.prenom} size="md" />
                <div className="member-info flex-1">
                  <span className="member-name">{m.prenom} {m.nom}</span>
                  {remplacant && (
                    <span className="member-phone">
                      Remplacé par : {remplacant.prenom} {remplacant.nom}
                    </span>
                  )}
                </div>
                {remplacement ? (
                  <Badge variant="info">Remplacé</Badge>
                ) : (
                  <button
                    className="btn btn-ghost btn-sm"
                    id={`btn-remplacer-${m.id}`}
                    onClick={() => { setSelectedAbsent(m.id); setShowModal(true); }}
                  >
                    <UserPlus size={16} /> Désigner remplaçant
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setSelectedAbsent(null); }}
        title="Désigner un remplaçant"
      >
        <div className="modal-form">
          {selectedAbsent && (() => {
            const absent = MOCK_USERS.find(u => u.id === selectedAbsent);
            return (
              <p>Sélectionnez le remplaçant pour <strong>{absent?.prenom} {absent?.nom}</strong> :</p>
            );
          })()}
          <select
            className="form-select"
            id="select-remplacant"
            value={selectedRemplacant}
            onChange={e => setSelectedRemplacant(e.target.value)}
          >
            <option value="">Choisir un remplaçant…</option>
            {MOCK_USERS
              .filter(u => u.id !== selectedAbsent && !tontine.membresIds.includes(u.id))
              .map(u => (
                <option key={u.id} value={u.id}>{u.prenom} {u.nom} — {u.telephone}</option>
              ))
            }
          </select>
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Annuler</button>
            <button
              className="btn btn-primary"
              id="btn-confirm-remplacant"
              onClick={handleConfirm}
              disabled={!selectedRemplacant}
            >
              Confirmer
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
