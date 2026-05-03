import type { Tontine } from '../../types/tontine.types';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { Users, Calendar, Coins } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { STATUS_VARIANT, STATUS_LABEL, cycleProgress } from '../../utils/format';

function formatFCFA(amount: number): string {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
}

interface TontineCardProps {
  tontine: Tontine;
  onClick?: () => void;
}

export const TontineCard = ({ tontine, onClick }: TontineCardProps) => {
  const progress = cycleProgress(tontine.cycleActuel, tontine.nombreMembresMax);

  return (
    <div
      className="tontine-card"
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? e => e.key === 'Enter' && onClick() : undefined}
    >
      <div className="tontine-card-header">
        <h3 className="tontine-card-name">{tontine.nom}</h3>
        <Badge variant={STATUS_VARIANT[tontine.status]} label={STATUS_LABEL[tontine.status]} />
      </div>

      <div className="tontine-card-stats">
        <div className="stat-item">
          <Coins size={16} className="stat-icon" />
          <span className="stat-label">Mise</span>
          <span className="stat-value">{formatFCFA(tontine.montantCotisation)}</span>
        </div>
        <div className="stat-item">
          <Users size={16} className="stat-icon" />
          <span className="stat-label">Membres</span>
          <span className="stat-value">{tontine.membresIds.length}/{tontine.nombreMembresMax}</span>
        </div>
        {tontine.demarreAt && (
          <div className="stat-item">
            <Calendar size={16} className="stat-icon" />
            <span className="stat-label">Démarré</span>
            <span className="stat-value">{format(new Date(tontine.demarreAt), 'd MMM', { locale: fr })}</span>
          </div>
        )}
      </div>

      {tontine.status === 'active' && (
        <div className="tontine-card-progress">
          <div className="progress-label">
            <span>Cycle {tontine.cycleActuel} / {tontine.nombreMembresMax}</span>
            <span>{progress}%</span>
          </div>
          <ProgressBar value={progress} max={100} />
        </div>
      )}
    </div>
  );
};
