import { useState } from 'react';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { MemberAvatar } from '../../components/tontine/MemberAvatar';
import { formatDate } from '../../utils/format';
import { MOCK_USERS } from '../../mocks/users.mock';
import { CheckCircle, XCircle, ArrowUpCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { Litige } from '../../types/transaction.types';

const MOCK_LITIGES: Litige[] = [
  {
    id: 'l1', tontineId: 't1', declarantUserId: 'u1', accuseUserId: 'u3',
    categorie: 'non_paiement', description: 'Koffi n\'a pas payé sa cotisation du mois de mars malgré 3 rappels.',
    status: 'ouvert', createdAt: '2026-04-10T08:00:00Z', updatedAt: '2026-04-10T08:00:00Z',
  },
  {
    id: 'l2', tontineId: 't2', declarantUserId: 'u4',
    categorie: 'litige_ordre', description: 'L\'ordre de passage a été modifié sans consultation des membres.',
    status: 'en_cours', createdAt: '2026-04-15T10:30:00Z', updatedAt: '2026-04-16T09:00:00Z',
  },
  {
    id: 'l3', tontineId: 't1', declarantUserId: 'u2',
    categorie: 'fraude', description: 'Montant reçu inférieur au montant attendu.',
    status: 'resolu', resolution: 'Vérification blockchain effectuée. Erreur de calcul côté opérateur. Remboursement effectué.',
    createdAt: '2026-03-01T14:00:00Z', updatedAt: '2026-03-05T11:00:00Z',
  },
];

type LitigeStatus = Litige['status'];
const STATUS_V: Record<LitigeStatus, 'error' | 'pending' | 'success' | 'info'> = {
  ouvert: 'error', en_cours: 'pending', resolu: 'success', rejete: 'info',
};

export function GestionLitiges() {
  const [litiges, setLitiges] = useState<Litige[]>(MOCK_LITIGES);
  const [selected, setSelected] = useState<Litige | null>(null);
  const [action, setAction] = useState<'resoudre' | 'escalader' | 'rejeter' | null>(null);
  const [resolution, setResolution] = useState('');
  const [filtre, setFiltre] = useState<LitigeStatus | 'tous'>('tous');

  const filtered = litiges.filter(l => filtre === 'tous' || l.status === filtre);

  const handleAction = () => {
    if (!selected || !action) return;
    setLitiges(prev => prev.map(l => {
      if (l.id !== selected.id) return l;
      const newStatus: LitigeStatus =
        action === 'resoudre' ? 'resolu' :
        action === 'rejeter' ? 'rejete' :
        'en_cours';
      return { ...l, status: newStatus, resolution: resolution || undefined, updatedAt: new Date().toISOString() };
    }));
    toast.success(`Litige ${action === 'resoudre' ? 'résolu' : action === 'rejeter' ? 'rejeté' : 'escaladé'} !`);
    setSelected(null);
    setAction(null);
    setResolution('');
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Gestion des Litiges</h1>
          <p className="page-subtitle">{litiges.filter(l => l.status === 'ouvert').length} litige(s) ouvert(s)</p>
        </div>
      </div>

      <div className="filter-tabs filters-bar">
        {(['tous', 'ouvert', 'en_cours', 'resolu', 'rejete'] as const).map(f => (
          <button
            key={f}
            className={`filter-tab ${filtre === f ? 'active' : ''}`}
            onClick={() => setFiltre(f)}
            id={`filter-litige-${f}`}
          >
            {f === 'tous' ? 'Tous' : f.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="litiges-list">
        {filtered.length === 0 && (
          <div className="card empty-text-card">
            <CheckCircle size={32} className="color-success" />
            <p>Aucun litige dans cette catégorie.</p>
          </div>
        )}
        {filtered.map(l => {
          const declarant = MOCK_USERS.find(u => u.id === l.declarantUserId);
          const accuse = l.accuseUserId ? MOCK_USERS.find(u => u.id === l.accuseUserId) : null;
          return (
            <div key={l.id} className="card litige-card">
              <div className="litige-header">
                <div className="litige-meta">
                  <Badge variant={STATUS_V[l.status]}>{l.status.replace('_', ' ')}</Badge>
                  <Badge variant="info">{l.categorie.replace('_', ' ')}</Badge>
                  <span className="text-muted">{formatDate(l.createdAt)}</span>
                </div>
                {(l.status === 'ouvert' || l.status === 'en_cours') && (
                  <div className="litige-actions">
                    <button className="btn btn-success btn-sm" id={`btn-resoudre-${l.id}`} onClick={() => { setSelected(l); setAction('resoudre'); }}>
                      <CheckCircle size={14} /> Résoudre
                    </button>
                    <button className="btn btn-ghost btn-sm" id={`btn-escalader-${l.id}`} onClick={() => { setSelected(l); setAction('escalader'); }}>
                      <ArrowUpCircle size={14} /> Escalader
                    </button>
                    <button className="btn btn-danger btn-sm" id={`btn-rejeter-${l.id}`} onClick={() => { setSelected(l); setAction('rejeter'); }}>
                      <XCircle size={14} /> Rejeter
                    </button>
                  </div>
                )}
              </div>
              <p className="litige-description">{l.description}</p>
              <div className="litige-parties">
                {declarant && (
                  <div className="litige-party">
                    <span className="party-role">Déclarant :</span>
                    <MemberAvatar nom={declarant.nom} prenom={declarant.prenom} size="sm" />
                    <span>{declarant.prenom} {declarant.nom}</span>
                  </div>
                )}
                {accuse && (
                  <div className="litige-party">
                    <span className="party-role">Mis en cause :</span>
                    <MemberAvatar nom={accuse.nom} prenom={accuse.prenom} size="sm" />
                    <span>{accuse.prenom} {accuse.nom}</span>
                  </div>
                )}
              </div>
              {l.resolution && (
                <div className="litige-resolution">
                  <strong>Résolution :</strong> {l.resolution}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Modal
        isOpen={!!selected && !!action}
        onClose={() => { setSelected(null); setAction(null); setResolution(''); }}
        title={action === 'resoudre' ? 'Résoudre le litige' : action === 'rejeter' ? 'Rejeter le litige' : 'Escalader le litige'}
      >
        <div className="modal-form">
          <p className="litige-description">{selected?.description}</p>
          {action === 'resoudre' && (
            <div className="form-group">
              <label htmlFor="resolution-text" className="form-label">Note de résolution</label>
              <textarea
                id="resolution-text"
                className="form-textarea"
                rows={4}
                placeholder="Décrivez comment le litige a été résolu…"
                value={resolution}
                onChange={e => setResolution(e.target.value)}
              />
            </div>
          )}
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={() => { setSelected(null); setAction(null); }}>Annuler</button>
            <button
              className={`btn ${action === 'resoudre' ? 'btn-success' : action === 'rejeter' ? 'btn-danger' : 'btn-primary'}`}
              id="btn-confirm-litige-action"
              onClick={handleAction}
            >
              Confirmer
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
