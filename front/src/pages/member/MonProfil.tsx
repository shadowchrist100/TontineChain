import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useUserStore } from '../../stores/userStore';
import { MemberAvatar } from '../../components/tontine/MemberAvatar';
import { Badge } from '../../components/ui/Badge';
import { toast } from 'sonner';
import { User, Phone, Mail, Shield, Bell, Globe } from 'lucide-react';

export function MonProfil() {
  const user = useAuthStore(s => s.user);
  const { preferences, setPreferences } = useUserStore();
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    prenom: user?.prenom ?? '',
    nom: user?.nom ?? '',
    telephone: user?.telephone ?? '',
    email: user?.email ?? '',
  });

  const handleSave = () => {
    setEditMode(false);
    toast.success('Profil mis à jour avec succès !');
  };

  if (!user) return null;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Mon Profil</h1>
        <Badge variant={user.role === 'admin' ? 'error' : user.role === 'organisateur' ? 'info' : 'success'}>
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </Badge>
      </div>

      <div className="profil-layout">
        {/* Avatar & header */}
        <div className="card profil-header-card">
          <div className="profil-avatar-section">
            <MemberAvatar nom={user.nom} prenom={user.prenom} size="lg" />
            <div>
              <h2 className="profil-name">{user.prenom} {user.nom}</h2>
              <p className="profil-email">{user.email}</p>
            </div>
          </div>
          <button
            className={`btn ${editMode ? 'btn-ghost' : 'btn-primary'}`}
            id="btn-edit-profil"
            onClick={() => editMode ? setEditMode(false) : setEditMode(true)}
          >
            {editMode ? 'Annuler' : 'Modifier'}
          </button>
        </div>

        <div className="profil-grid">
          {/* Infos personnelles */}
          <div className="card">
            <h3 className="card-title"><User size={18} /> Informations personnelles</h3>
            {editMode ? (
              <div className="profil-form">
                {[
                  { id: 'p-prenom', label: 'Prénom', key: 'prenom' as const },
                  { id: 'p-nom', label: 'Nom', key: 'nom' as const },
                  { id: 'p-email', label: 'Email', key: 'email' as const },
                  { id: 'p-tel', label: 'Téléphone', key: 'telephone' as const },
                ].map(f => (
                  <div key={f.key} className="form-group">
                    <label htmlFor={f.id} className="form-label">{f.label}</label>
                    <input
                      id={f.id}
                      className="form-input"
                      value={form[f.key]}
                      onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    />
                  </div>
                ))}
                <button className="btn btn-primary" id="btn-save-profil" onClick={handleSave}>
                  Enregistrer les modifications
                </button>
              </div>
            ) : (
              <dl className="profil-info-list">
                <div className="info-item">
                  <dt><User size={14} /> Nom complet</dt>
                  <dd>{user.prenom} {user.nom}</dd>
                </div>
                <div className="info-item">
                  <dt><Mail size={14} /> Email</dt>
                  <dd>{user.email}</dd>
                </div>
                <div className="info-item">
                  <dt><Phone size={14} /> Téléphone</dt>
                  <dd>{user.telephone}</dd>
                </div>
              </dl>
            )}
          </div>

          {/* Préférences */}
          <div className="card">
            <h3 className="card-title"><Bell size={18} /> Préférences</h3>
            <div className="preferences-list">
              <div className="pref-item">
                <div className="pref-info">
                  <Mail size={16} />
                  <div>
                    <span className="pref-label">Notifications Email</span>
                    <span className="pref-desc">Recevoir les alertes par email</span>
                  </div>
                </div>
                <label className="toggle" htmlFor="pref-email">
                  <input
                    type="checkbox"
                    id="pref-email"
                    checked={preferences.notificationsEmail}
                    onChange={e => setPreferences({ notificationsEmail: e.target.checked })}
                  />
                  <span className="toggle-slider" />
                </label>
              </div>
              <div className="pref-item">
                <div className="pref-info">
                  <Phone size={16} />
                  <div>
                    <span className="pref-label">Notifications SMS</span>
                    <span className="pref-desc">Recevoir les alertes par SMS</span>
                  </div>
                </div>
                <label className="toggle" htmlFor="pref-sms">
                  <input
                    type="checkbox"
                    id="pref-sms"
                    checked={preferences.notificationsSMS}
                    onChange={e => setPreferences({ notificationsSMS: e.target.checked })}
                  />
                  <span className="toggle-slider" />
                </label>
              </div>
              <div className="pref-item">
                <div className="pref-info">
                  <Globe size={16} />
                  <div>
                    <span className="pref-label">Langue</span>
                    <span className="pref-desc">Langue de l'interface</span>
                  </div>
                </div>
                <select
                  id="pref-langue"
                  className="select-sm"
                  value={preferences.langue}
                  onChange={e => setPreferences({ langue: e.target.value as 'fr' | 'en' })}
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </div>

          {/* Sécurité */}
          <div className="card">
            <h3 className="card-title"><Shield size={18} /> Sécurité</h3>
            <div className="security-list">
              <div className="security-item">
                <div>
                  <span className="security-label">Authentification à deux facteurs</span>
                  <span className="security-desc">Ajoutez une couche de sécurité supplémentaire</span>
                </div>
                <Badge variant="pending">Non activé</Badge>
              </div>
              <button className="btn btn-ghost btn-sm" id="btn-change-password">
                Changer le mot de passe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
