import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAllTontines } from '../../hooks/useTontines';
import { Spinner } from '../../components/ui/Spinner';
import { Badge } from '../../components/ui/Badge';
import { Table } from '../../components/ui/Table';
import { formatFCFA, formatDate, STATUS_VARIANT, STATUS_LABEL } from '../../utils/format';
import { Search, Eye } from 'lucide-react';
import type { Tontine, TontineStatus } from '../../types/tontine.types';

const STATUTS: TontineStatus[] = ['active', 'adhesion', 'configuration', 'terminee', 'annulee'];

export function SupervisionTontines() {
  const { data: tontines, isLoading } = useAllTontines();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filtre, setFiltre] = useState<TontineStatus | 'tous'>('tous');

  const filtered = (tontines ?? []).filter(t => {
    const matchSearch = t.nom.toLowerCase().includes(search.toLowerCase());
    const matchStatut = filtre === 'tous' || t.status === filtre;
    return matchSearch && matchStatut;
  });

  if (isLoading) return <div className="loading-center"><Spinner size="lg" /></div>;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Supervision des Tontines</h1>
          <p className="page-subtitle">{(tontines ?? []).length} tontines sur la plateforme</p>
        </div>
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            id="search-supervision"
            type="text"
            className="search-input"
            placeholder="Rechercher une tontine…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-tabs">
          <button
            className={`filter-tab ${filtre === 'tous' ? 'active' : ''}`}
            onClick={() => setFiltre('tous')}
          >Tous</button>
          {STATUTS.map(s => (
            <button
              key={s}
              className={`filter-tab ${filtre === s ? 'active' : ''}`}
              onClick={() => setFiltre(s)}
              id={`filter-sup-${s}`}
            >
              {STATUS_LABEL[s]}
            </button>
          ))}
        </div>
      </div>

      <Table<Tontine>
        columns={[
          { key: 'nom', header: 'Nom', sortable: true },
          {
            key: 'status',
            header: 'Statut',
            render: r => <Badge variant={STATUS_VARIANT[r.status]}>{STATUS_LABEL[r.status]}</Badge>,
          },
          {
            key: 'montantCotisation',
            header: 'Mise',
            sortable: true,
            render: r => formatFCFA(r.montantCotisation),
          },
          {
            key: 'nombreMembresMax',
            header: 'Membres',
            render: r => `${r.membresIds.length}/${r.nombreMembresMax}`,
          },
          {
            key: 'frequenceCotisation',
            header: 'Fréquence',
            render: r => <span className="capitalize">{r.frequenceCotisation}</span>,
          },
          {
            key: 'cycleActuel',
            header: 'Cycle',
            render: r => r.status === 'active' ? `Tour ${r.cycleActuel}/${r.nombreMembresMax}` : '—',
          },
          { key: 'createdAt', header: 'Créée le', sortable: true, render: r => formatDate(r.createdAt) },
          {
            key: 'id',
            header: 'Actions',
            render: r => (
              <button
                className="btn btn-ghost btn-xs"
                onClick={() => navigate(`/orga/tontines/${r.id}`)}
                id={`btn-view-tontine-${r.id}`}
              >
                <Eye size={14} /> Voir
              </button>
            ),
          },
        ]}
        data={filtered}
        keyExtractor={t => t.id}
        emptyMessage="Aucune tontine trouvée"
        pageSize={8}
      />
    </div>
  );
}
