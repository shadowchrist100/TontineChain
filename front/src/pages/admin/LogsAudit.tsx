import { useState } from 'react';
import { Badge } from '../../components/ui/Badge';
import { formatDateTime } from '../../utils/format';
import { Shield, Download, Filter, Search } from 'lucide-react';
import { toast } from 'sonner';

type EventType = 'connexion' | 'deconnexion' | 'paiement' | 'creation_tontine' | 'suspension' | 'cloture';

interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  eventType: EventType;
  description: string;
  ip: string;
  at: string;
}

const EVENT_VARIANT: Record<EventType, 'success' | 'info' | 'pending' | 'error'> = {
  connexion: 'success',
  deconnexion: 'info',
  paiement: 'success',
  creation_tontine: 'info',
  suspension: 'error',
  cloture: 'pending',
};

const MOCK_LOGS: AuditLog[] = [
  { id: 'log1', userId: 'admin1', userName: 'Admin TontineChain', eventType: 'connexion', description: 'Connexion admin depuis Cotonou', ip: '197.155.41.12', at: '2026-05-03T08:00:00Z' },
  { id: 'log2', userId: 'u1', userName: 'Koffi Agossou', eventType: 'paiement', description: 'Paiement cotisation 50 000 FCFA — Tontine Entrepreneurs Cotonou', ip: '197.155.42.88', at: '2026-05-03T09:15:00Z' },
  { id: 'log3', userId: 'u2', userName: 'Aline Dossou', eventType: 'creation_tontine', description: 'Création de la tontine "Investissement Avenir — Porto-Novo"', ip: '197.155.43.55', at: '2026-05-02T14:30:00Z' },
  { id: 'log4', userId: 'admin1', userName: 'Admin TontineChain', eventType: 'suspension', description: 'Suspension du compte utilisateur u3 (Marc Zinsou)', ip: '197.155.41.12', at: '2026-05-01T11:00:00Z' },
  { id: 'log5', userId: 'u5', userName: 'Rodrigue Adjovi', eventType: 'connexion', description: 'Connexion depuis Parakou', ip: '41.203.88.22', at: '2026-04-30T16:45:00Z' },
  { id: 'log6', userId: 'u4', userName: 'Béatrice Hounkpatin', eventType: 'paiement', description: 'Paiement cotisation 10 000 FCFA — Solidarité Femmes Parakou', ip: '197.155.91.34', at: '2026-04-29T10:00:00Z' },
  { id: 'log7', userId: 'u2', userName: 'Aline Dossou', eventType: 'cloture', description: 'Clôture de la tontine "Caisse Famille Agossou"', ip: '197.155.43.55', at: '2026-04-28T17:30:00Z' },
];

export function LogsAudit() {
  const [filtre, setFiltre] = useState<EventType | 'tous'>('tous');
  const [search, setSearch] = useState('');

  const filtered = MOCK_LOGS.filter(l => {
    const matchType = filtre === 'tous' || l.eventType === filtre;
    const matchSearch = `${l.userName} ${l.description}`.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const handleExport = () => {
    const csv = ['Date,Utilisateur,Type,Description,IP',
      ...filtered.map(l => `${l.at},"${l.userName}",${l.eventType},"${l.description}",${l.ip}`)
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(blob),
      download: `audit-logs-${Date.now()}.csv`,
    });
    a.click();
    toast.success('Export CSV téléchargé !');
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Logs & Audit de Sécurité</h1>
          <p className="page-subtitle">{MOCK_LOGS.length} événements enregistrés</p>
        </div>
        <button className="btn btn-ghost" id="btn-export-logs" onClick={handleExport}>
          <Download size={18} /> Exporter CSV
        </button>
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            id="search-logs"
            type="text"
            className="search-input"
            placeholder="Rechercher un utilisateur, action…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-tabs">
          <Filter size={16} />
          {(['tous', 'connexion', 'deconnexion', 'paiement', 'creation_tontine', 'suspension', 'cloture'] as const).map(f => (
            <button
              key={f}
              className={`filter-tab ${filtre === f ? 'active' : ''}`}
              onClick={() => setFiltre(f)}
              id={`filter-log-${f}`}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="audit-logs-list">
          {filtered.length === 0 ? (
            <p className="empty-text">Aucun log trouvé.</p>
          ) : (
            filtered.map(log => (
              <div key={log.id} className="audit-log-row" id={`log-${log.id}`}>
                <div className="log-icon">
                  <Shield size={16} />
                </div>
                <div className="log-content">
                  <div className="log-header">
                    <span className="log-user">{log.userName}</span>
                    <Badge variant={EVENT_VARIANT[log.eventType]}>{log.eventType.replace('_', ' ')}</Badge>
                    <span className="log-time text-muted">{formatDateTime(log.at)}</span>
                  </div>
                  <p className="log-description">{log.description}</p>
                  <span className="log-ip text-muted">IP : {log.ip}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
