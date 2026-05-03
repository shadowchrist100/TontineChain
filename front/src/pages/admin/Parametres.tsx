import { useState } from 'react';
import { Badge } from '../../components/ui/Badge';
import { toast } from 'sonner';
import { Save, AlertTriangle, Smartphone, Percent, Settings as SettingsIcon } from 'lucide-react';

interface PlatformSettings {
  fraisService: number;
  mtnEnabled: boolean;
  moovEnabled: boolean;
  maintenanceMode: boolean;
  maxMembresParTontine: number;
  montantMinCotisation: number;
  montantMaxCotisation: number;
}

const DEFAULTS: PlatformSettings = {
  fraisService: 1.5,
  mtnEnabled: true,
  moovEnabled: true,
  maintenanceMode: false,
  maxMembresParTontine: 50,
  montantMinCotisation: 1000,
  montantMaxCotisation: 500000,
};

export function Parametres() {
  const [settings, setSettings] = useState<PlatformSettings>(DEFAULTS);
  const [saved, setSaved] = useState(false);

  const update = <K extends keyof PlatformSettings>(key: K, val: PlatformSettings[K]) => {
    setSettings(s => ({ ...s, [key]: val }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    toast.success('Paramètres enregistrés avec succès !');
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Paramètres de la Plateforme</h1>
          <p className="page-subtitle">Configuration globale de TontineChain</p>
        </div>
        <button className="btn btn-primary" id="btn-save-settings" onClick={handleSave}>
          <Save size={18} /> {saved ? 'Enregistré ✓' : 'Enregistrer'}
        </button>
      </div>

      <div className="settings-grid">
        {/* Frais de service */}
        <div className="card">
          <h3 className="card-title"><Percent size={18} /> Frais de service</h3>
          <p className="card-desc">Pourcentage prélevé sur chaque distribution.</p>
          <div className="form-group">
            <label htmlFor="frais-service" className="form-label">Frais (%) par distribution</label>
            <div className="input-with-suffix">
              <input
                id="frais-service"
                type="number"
                className="form-input"
                min={0}
                max={5}
                step={0.1}
                value={settings.fraisService}
                onChange={e => update('fraisService', +e.target.value)}
              />
              <span className="input-suffix">%</span>
            </div>
            <span className="form-hint">
              Sur une cagnotte de 600 000 FCFA → frais : {(settings.fraisService * 6000).toFixed(0)} FCFA
            </span>
          </div>
        </div>

        {/* Intégrations Mobile Money */}
        <div className="card">
          <h3 className="card-title"><Smartphone size={18} /> Intégrations Mobile Money</h3>
          <p className="card-desc">Activez/désactivez les opérateurs de paiement.</p>
          <div className="settings-toggles">
            {[
              { key: 'mtnEnabled' as const, label: 'MTN Mobile Money', color: '#FFD700' },
              { key: 'moovEnabled' as const, label: 'Moov Money', color: '#0066CC' },
            ].map(op => (
              <div key={op.key} className="pref-item">
                <div className="pref-info">
                  <div className="op-dot" style={{ background: op.color }} />
                  <div>
                    <span className="pref-label">{op.label}</span>
                    <Badge variant={settings[op.key] ? 'success' : 'error'}>
                      {settings[op.key] ? 'Actif' : 'Désactivé'}
                    </Badge>
                  </div>
                </div>
                <label className="toggle" htmlFor={`toggle-${op.key}`}>
                  <input
                    type="checkbox"
                    id={`toggle-${op.key}`}
                    checked={settings[op.key]}
                    onChange={e => update(op.key, e.target.checked)}
                  />
                  <span className="toggle-slider" />
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Limites */}
        <div className="card">
          <h3 className="card-title"><SettingsIcon size={18} /> Limites de la plateforme</h3>
          <div className="form-group">
            <label htmlFor="max-membres" className="form-label">Membres max par tontine</label>
            <input
              id="max-membres"
              type="number"
              className="form-input"
              min={2}
              max={200}
              value={settings.maxMembresParTontine}
              onChange={e => update('maxMembresParTontine', +e.target.value)}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="montant-min" className="form-label">Mise minimum (FCFA)</label>
              <input
                id="montant-min"
                type="number"
                className="form-input"
                min={500}
                step={500}
                value={settings.montantMinCotisation}
                onChange={e => update('montantMinCotisation', +e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="montant-max" className="form-label">Mise maximum (FCFA)</label>
              <input
                id="montant-max"
                type="number"
                className="form-input"
                min={10000}
                step={10000}
                value={settings.montantMaxCotisation}
                onChange={e => update('montantMaxCotisation', +e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Mode maintenance */}
        <div className="card">
          <h3 className="card-title"><AlertTriangle size={18} /> Mode maintenance</h3>
          <p className="card-desc">
            En mode maintenance, seuls les administrateurs peuvent accéder à la plateforme.
          </p>
          <div className="pref-item">
            <div className="pref-info">
              <div>
                <span className="pref-label">Mode maintenance</span>
                <Badge variant={settings.maintenanceMode ? 'error' : 'success'}>
                  {settings.maintenanceMode ? '⚠ Activé' : 'Désactivé'}
                </Badge>
              </div>
            </div>
            <label className="toggle" htmlFor="toggle-maintenance">
              <input
                type="checkbox"
                id="toggle-maintenance"
                checked={settings.maintenanceMode}
                onChange={e => update('maintenanceMode', e.target.checked)}
              />
              <span className="toggle-slider" />
            </label>
          </div>
          {settings.maintenanceMode && (
            <div className="alert alert-warning">
              <AlertTriangle size={16} />
              <p>La plateforme sera inaccessible aux utilisateurs ! N'activez ce mode que pour des maintenances planifiées.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
