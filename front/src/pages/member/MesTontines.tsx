import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTontines } from '../../hooks/useTontines';
import { useAuthStore } from '../../stores/authStore';
import { TontineCard } from '../../components/tontine/TontineCard';
import { Badge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';
import { PlusCircle, Filter, Search } from 'lucide-react';
import type { TontineStatus } from '../../types/tontine.types';
import { Link } from 'react-router-dom';
import { STATUS_LABEL } from '../../utils/format';

const STATUTS: (TontineStatus | 'tous')[] = ['tous', 'active', 'adhesion', 'configuration', 'terminee'];

export function MesTontines() {
  const user = useAuthStore(s => s.user);
  const { data: tontines, isLoading } = useTontines(user?.id ?? '');
  const navigate = useNavigate();
  const [filtre, setFiltre] = useState<TontineStatus | 'tous'>('tous');
  const [search, setSearch] = useState('');

  const isOrga = user?.role === 'organisateur';

  const filtered = (tontines ?? []).filter(t => {
    const matchStatut = filtre === 'tous' || t.status === filtre;
    const matchSearch = t.nom.toLowerCase().includes(search.toLowerCase());
    return matchStatut && matchSearch;
  });

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Mes Tontines</h1>
          <p className="page-subtitle">Retrouvez toutes vos tontines en un coup d'œil</p>
        </div>
        {isOrga && (
          <Link to="/orga/creer" className="btn btn-primary" id="btn-creer-tontine">
            <PlusCircle size={18} /> Créer une tontine
          </Link>
        )}
      </div>

      {/* Filtres */}
      <div className="filters-bar">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            id="search-tontines"
            type="text"
            placeholder="Rechercher une tontine..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-tabs">
          <Filter size={16} className="filter-icon" />
          {STATUTS.map(s => (
            <button
              key={s}
              className={`filter-tab ${filtre === s ? 'active' : ''}`}
              onClick={() => setFiltre(s)}
              id={`filter-${s}`}
            >
              {s === 'tous' ? 'Tous' : STATUS_LABEL[s as TontineStatus]}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="loading-center">
          <Spinner size="lg" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💳</div>
          <h3>Aucune tontine trouvée</h3>
          <p>
            {filtre !== 'tous'
              ? 'Aucune tontine avec ce statut.'
              : isOrga
              ? 'Commencez par créer votre première tontine.'
              : "Vous n'êtes membre d'aucune tontine pour l'instant."}
          </p>
          {isOrga && (
            <Link to="/orga/creer" className="btn btn-primary" id="btn-creer-empty">
              <PlusCircle size={18} /> Créer une tontine
            </Link>
          )}
        </div>
      ) : (
        <div className="tontines-grid">
          {filtered.map(t => (
            <TontineCard
              key={t.id}
              tontine={t}
              onClick={() => navigate(isOrga ? `/orga/tontines/${t.id}` : `/tontines/${t.id}`)}
            />
          ))}
        </div>
      )}

      <div className="tontines-summary">
        <Badge variant="info">{filtered.length} tontine(s) affichée(s)</Badge>
      </div>
    </div>
  );
}
