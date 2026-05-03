import { useState } from 'react';
import { MOCK_USERS } from '../../mocks/users.mock';
import { MemberAvatar } from '../../components/tontine/MemberAvatar';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { formatDate } from '../../utils/format';
import { Search, UserX, UserCheck, Eye } from 'lucide-react';
import { toast } from 'sonner';
import type { User } from '../../types/user.types';

type UserStatus = 'actif' | 'suspendu';

interface ManagedUser extends User {
  userStatus: UserStatus;
}

const ROLE_VARIANT: Record<string, 'success' | 'info' | 'error'> = {
  membre: 'success',
  organisateur: 'info',
  admin: 'error',
};

export function GestionUtilisateurs() {
  const [users, setUsers] = useState<ManagedUser[]>(
    MOCK_USERS.map(u => ({ ...u, userStatus: 'actif' as UserStatus }))
  );
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null);
  const [viewUser, setViewUser] = useState<ManagedUser | null>(null);

  const filtered = users.filter(u =>
    `${u.prenom} ${u.nom} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStatus = (userId: string) => {
    setUsers(prev => prev.map(u =>
      u.id === userId
        ? { ...u, userStatus: u.userStatus === 'actif' ? 'suspendu' : 'actif' }
        : u
    ));
    const u = users.find(u => u.id === userId);
    const newStatus = u?.userStatus === 'actif' ? 'suspendu' : 'actif';
    toast.success(`Utilisateur ${newStatus === 'suspendu' ? 'suspendu' : 'réactivé'} avec succès.`);
    setSelectedUser(null);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Gestion des Utilisateurs</h1>
          <p className="page-subtitle">{users.length} utilisateurs inscrits</p>
        </div>
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            id="search-users"
            type="text"
            className="search-input"
            placeholder="Rechercher par nom, email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="card">
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Statut</th>
                <th>Inscrit le</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="table-row">
                  <td>
                    <div className="user-cell">
                      <MemberAvatar nom={u.nom} prenom={u.prenom} size="sm" />
                      <span className="user-name">{u.prenom} {u.nom}</span>
                    </div>
                  </td>
                  <td>{u.email}</td>
                  <td><Badge variant={ROLE_VARIANT[u.role]}>{u.role}</Badge></td>
                  <td>
                    <Badge variant={u.userStatus === 'actif' ? 'success' : 'error'}>
                      {u.userStatus}
                    </Badge>
                  </td>
                  <td>{formatDate(u.createdAt)}</td>
                  <td>
                    <div className="row-actions">
                      <button
                        className="btn btn-ghost btn-xs"
                        title="Voir le profil"
                        onClick={() => setViewUser(u)}
                        id={`btn-view-${u.id}`}
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        className={`btn btn-xs ${u.userStatus === 'actif' ? 'btn-danger' : 'btn-success'}`}
                        title={u.userStatus === 'actif' ? 'Suspendre' : 'Réactiver'}
                        onClick={() => setSelectedUser(u)}
                        id={`btn-toggle-${u.id}`}
                      >
                        {u.userStatus === 'actif' ? <UserX size={14} /> : <UserCheck size={14} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal confirmation */}
      <Modal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title={selectedUser?.userStatus === 'actif' ? 'Suspendre l\'utilisateur' : 'Réactiver l\'utilisateur'}
      >
        <div className="modal-confirm">
          <p>
            {selectedUser?.userStatus === 'actif'
              ? `Suspendre ${selectedUser?.prenom} ${selectedUser?.nom} ? Il ne pourra plus se connecter.`
              : `Réactiver ${selectedUser?.prenom} ${selectedUser?.nom} ?`}
          </p>
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={() => setSelectedUser(null)}>Annuler</button>
            <button
              className={`btn ${selectedUser?.userStatus === 'actif' ? 'btn-danger' : 'btn-primary'}`}
              id="btn-confirm-toggle"
              onClick={() => selectedUser && toggleStatus(selectedUser.id)}
            >
              Confirmer
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal profil */}
      <Modal isOpen={!!viewUser} onClose={() => setViewUser(null)} title="Profil utilisateur">
        {viewUser && (
          <div className="profil-modal">
            <MemberAvatar nom={viewUser.nom} prenom={viewUser.prenom} size="lg" />
            <dl className="profil-info-list">
              <div className="info-item"><dt>Nom</dt><dd>{viewUser.prenom} {viewUser.nom}</dd></div>
              <div className="info-item"><dt>Email</dt><dd>{viewUser.email}</dd></div>
              <div className="info-item"><dt>Téléphone</dt><dd>{viewUser.telephone}</dd></div>
              <div className="info-item"><dt>Rôle</dt><dd>{viewUser.role}</dd></div>
              <div className="info-item"><dt>Inscrit le</dt><dd>{formatDate(viewUser.createdAt)}</dd></div>
              <div className="info-item"><dt>Tontines</dt><dd>{viewUser.tontinesIds.length}</dd></div>
            </dl>
          </div>
        )}
      </Modal>
    </div>
  );
}
