import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MemberAvatar } from '../../components/tontine/MemberAvatar';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { MOCK_USERS } from '../../mocks/users.mock';
import { ArrowLeft, CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface PendingRequest {
  userId: string;
  status: 'pending' | 'accepted' | 'rejected';
}

// Simulation: les 2 premiers users qui ne sont pas dans la tontine font une demande
const PENDING_REQUESTS: PendingRequest[] = [
  { userId: 'u3', status: 'pending' },
  { userId: 'u5', status: 'pending' },
];

export function ValidationMembres() {
  const { id: _tontineId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<PendingRequest[]>(PENDING_REQUESTS);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [action, setAction] = useState<'accept' | 'reject' | null>(null);

  const pending = requests.filter(r => r.status === 'pending');
  const processed = requests.filter(r => r.status !== 'pending');

  const openModal = (userId: string, act: 'accept' | 'reject') => {
    setSelectedUser(userId);
    setAction(act);
  };

  const handleConfirm = () => {
    if (!selectedUser || !action) return;
    setRequests(prev => prev.map(r =>
      r.userId === selectedUser ? { ...r, status: action === 'accept' ? 'accepted' : 'rejected' } : r
    ));
    toast.success(action === 'accept' ? 'Membre accepté !' : 'Demande refusée.');
    setSelectedUser(null);
    setAction(null);
  };

  const selectedMember = MOCK_USERS.find(u => u.id === selectedUser);

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-header-left">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} /> Retour
          </button>
          <div>
            <h1 className="page-title">Validation des Membres</h1>
            <p className="page-subtitle">{pending.length} demande(s) en attente</p>
          </div>
        </div>
      </div>

      {/* Demandes en attente */}
      <div className="section">
        <h2 className="section-label">
          <Clock size={16} /> En attente ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <div className="card empty-text-card">
            <CheckCircle size={32} className="color-success" />
            <p>Toutes les demandes ont été traitées.</p>
          </div>
        ) : (
          <div className="validation-list">
            {pending.map(req => {
              const user = MOCK_USERS.find(u => u.id === req.userId);
              if (!user) return null;
              return (
                <div key={req.userId} className="card validation-row">
                  <MemberAvatar nom={user.nom} prenom={user.prenom} size="md" />
                  <div className="member-info flex-1">
                    <span className="member-name">{user.prenom} {user.nom}</span>
                    <span className="member-phone">{user.telephone}</span>
                    <span className="member-email">{user.email}</span>
                  </div>
                  <Badge variant="pending">En attente</Badge>
                  <div className="validation-actions">
                    <button
                      className="btn btn-success btn-sm"
                      id={`btn-accept-${user.id}`}
                      onClick={() => openModal(user.id, 'accept')}
                    >
                      <CheckCircle size={16} /> Accepter
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      id={`btn-reject-${user.id}`}
                      onClick={() => openModal(user.id, 'reject')}
                    >
                      <XCircle size={16} /> Refuser
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Traitées */}
      {processed.length > 0 && (
        <div className="section">
          <h2 className="section-label">Demandes traitées</h2>
          <div className="validation-list">
            {processed.map(req => {
              const user = MOCK_USERS.find(u => u.id === req.userId);
              if (!user) return null;
              return (
                <div key={req.userId} className="card validation-row processed">
                  <MemberAvatar nom={user.nom} prenom={user.prenom} size="md" />
                  <div className="member-info flex-1">
                    <span className="member-name">{user.prenom} {user.nom}</span>
                  </div>
                  <Badge variant={req.status === 'accepted' ? 'success' : 'error'}>
                    {req.status === 'accepted' ? '✓ Accepté' : '✗ Refusé'}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <Modal
        isOpen={!!selectedUser && !!action}
        onClose={() => { setSelectedUser(null); setAction(null); }}
        title={action === 'accept' ? 'Accepter le membre' : 'Refuser la demande'}
      >
        <div className="modal-confirm">
          <p>
            {action === 'accept'
              ? `Accepter ${selectedMember?.prenom} ${selectedMember?.nom} dans cette tontine ?`
              : `Refuser la demande de ${selectedMember?.prenom} ${selectedMember?.nom} ?`}
          </p>
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={() => { setSelectedUser(null); setAction(null); }}>
              Annuler
            </button>
            <button
              className={`btn ${action === 'accept' ? 'btn-primary' : 'btn-danger'}`}
              id="btn-confirm-validation"
              onClick={handleConfirm}
            >
              Confirmer
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
