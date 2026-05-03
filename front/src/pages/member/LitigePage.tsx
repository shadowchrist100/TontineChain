import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner } from '../../components/ui/Spinner';
import { Badge } from '../../components/ui/Badge';
import { toast } from 'sonner';
import { AlertTriangle, ArrowLeft, Paperclip, CheckCircle } from 'lucide-react';

const CATEGORIES = ['Paiement non reçu', 'Montant incorrect', 'Ordre de passage erroné', 'Membre absent non signalé', 'Autre'];

export function LitigePage() {
  const navigate = useNavigate();
  const [categorie, setCategorie] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const ticketId = `LIT-${Date.now().toString(36).toUpperCase()}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categorie || !description.trim()) {
      toast.error('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="page page-narrow">
      <div className="page-header">
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Retour
        </button>
        <h1 className="page-title">Signaler un Litige</h1>
      </div>

      {submitted ? (
        <div className="card litige-success">
          <CheckCircle size={64} className="success-icon" />
          <h2>Litige signalé avec succès</h2>
          <p>Votre ticket a été créé. L'équipe TontineChain va examiner votre requête.</p>
          <div className="ticket-ref">
            <span>Référence du ticket :</span>
            <Badge variant="info">{ticketId}</Badge>
          </div>
          <p className="litige-note">Vous serez notifié par email et SMS de l'avancement de votre dossier.</p>
          <button className="btn btn-primary" onClick={() => navigate('/tableau-de-bord')} id="btn-retour-dashboard">
            Retour au tableau de bord
          </button>
        </div>
      ) : (
        <div className="card">
          <div className="litige-warning">
            <AlertTriangle size={20} className="warning-icon" />
            <p>Décrivez votre problème avec précision. Toute fausse déclaration peut entraîner des sanctions.</p>
          </div>

          <form onSubmit={handleSubmit} className="litige-form">
            <div className="form-group">
              <label htmlFor="litige-cat" className="form-label">Catégorie du litige *</label>
              <select
                id="litige-cat"
                className="form-select"
                value={categorie}
                onChange={e => setCategorie(e.target.value)}
                required
              >
                <option value="">Sélectionnez une catégorie</option>
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="litige-desc" className="form-label">Description détaillée *</label>
              <textarea
                id="litige-desc"
                className="form-textarea"
                rows={6}
                placeholder="Décrivez le problème en détail : dates, montants, personnes impliquées..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
              />
              <span className="char-count">{description.length} / 1000 caractères</span>
            </div>

            <div className="form-group">
              <label className="form-label">
                <Paperclip size={14} /> Pièces jointes (optionnel)
              </label>
              <div className="file-drop" id="litige-files">
                <p>Glissez-déposez vos captures d'écran ou documents ici</p>
                <span className="file-formats">PNG, JPG, PDF — max 5 Mo</span>
              </div>
            </div>

            <button
              type="submit"
              id="btn-soumettre-litige"
              className="btn btn-primary btn-full"
              disabled={loading}
            >
              {loading ? <Spinner size="sm" /> : 'Soumettre le litige'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
