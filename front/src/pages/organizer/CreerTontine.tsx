import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreerTontine } from '../../hooks/useTontines';
import { StepIndicator } from '../../components/ui/StepIndicator';
import { Spinner } from '../../components/ui/Spinner';
import { formatFCFA } from '../../utils/format';
import { Rocket, CheckCircle } from 'lucide-react';
import type { CreateTontinePayload, FrequenceCotisation, OrdreType } from '../../types/tontine.types';

const STEPS = [
  { id: 0, label: 'Paramètres généraux' },
  { id: 1, label: 'Règles & Pénalités' },
  { id: 2, label: 'Récapitulatif' },
];

const defaultForm: CreateTontinePayload = {
  nom: '',
  description: '',
  montantCotisation: 50000,
  frequenceCotisation: 'mensuel',
  frequenceRamassage: 'mensuel',
  nombreMembresMax: 10,
  durateLimiteParCycleDays: 35,
  ordreType: 'fixe',
  penalites: {
    retardMontant: 5000,
    retraitFraction: 0.33,
    depassementDelai: 10000,
    interetTontinier: 2,
  },
};

export function CreerTontine() {
  const navigate = useNavigate();
  const { mutateAsync: creerTontine, isPending } = useCreerTontine();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<CreateTontinePayload>(defaultForm);
  const [deployed, setDeployed] = useState(false);

  const update = (key: keyof CreateTontinePayload, val: unknown) =>
    setForm(f => ({ ...f, [key]: val }));
  const updatePenalite = (key: keyof CreateTontinePayload['penalites'], val: number) =>
    setForm(f => ({ ...f, penalites: { ...f.penalites, [key]: val } }));

  const handleDeploy = async () => {
    const t = await creerTontine(form);
    setDeployed(true);
    setTimeout(() => navigate(`/orga/tontines/${t.id}`), 2500);
  };

  if (deployed) {
    return (
      <div className="page page-narrow">
        <div className="card deploy-success">
          <CheckCircle size={72} className="deploy-success-icon" />
          <h2>Smart Contract déployé !</h2>
          <p>Votre tontine <strong>{form.nom}</strong> est maintenant sur la blockchain.</p>
          <Spinner size="sm" />
          <p className="text-muted">Redirection en cours…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page page-narrow">
      <div className="page-header">
        <h1 className="page-title">Créer une Tontine</h1>
      </div>

      <StepIndicator steps={STEPS} currentStep={step} />

      <div className="card form-card">
        {/* ── Étape 0 : Paramètres généraux ── */}
        {step === 0 && (
          <div className="form-step">
            <h2 className="form-step-title">Paramètres généraux</h2>
            <div className="form-group">
              <label htmlFor="nom-tontine" className="form-label">Nom de la tontine *</label>
              <input
                id="nom-tontine"
                className="form-input"
                placeholder="Ex : Solidarité Entrepreneurs Cotonou"
                value={form.nom}
                onChange={e => update('nom', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="desc-tontine" className="form-label">Description</label>
              <textarea
                id="desc-tontine"
                className="form-textarea"
                rows={3}
                placeholder="Décrivez l'objectif de votre tontine…"
                value={form.description}
                onChange={e => update('description', e.target.value)}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="montant" className="form-label">Mise par cycle (FCFA) *</label>
                <input
                  id="montant"
                  type="number"
                  className="form-input"
                  min={1000}
                  step={1000}
                  value={form.montantCotisation}
                  onChange={e => update('montantCotisation', +e.target.value)}
                />
                <span className="form-hint">{formatFCFA(form.montantCotisation)}</span>
              </div>
              <div className="form-group">
                <label htmlFor="nb-membres" className="form-label">Nombre de membres max *</label>
                <input
                  id="nb-membres"
                  type="number"
                  className="form-input"
                  min={2}
                  max={50}
                  value={form.nombreMembresMax}
                  onChange={e => update('nombreMembresMax', +e.target.value)}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="freq-cotisation" className="form-label">Fréquence de cotisation</label>
                <select
                  id="freq-cotisation"
                  className="form-select"
                  value={form.frequenceCotisation}
                  onChange={e => update('frequenceCotisation', e.target.value as FrequenceCotisation)}
                >
                  <option value="hebdomadaire">Hebdomadaire</option>
                  <option value="mensuel">Mensuel</option>
                  <option value="bimensuel">Bimensuel</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="ordre-type" className="form-label">Ordre de passage</label>
                <select
                  id="ordre-type"
                  className="form-select"
                  value={form.ordreType}
                  onChange={e => update('ordreType', e.target.value as OrdreType)}
                >
                  <option value="fixe">Fixe (défini par l'organisateur)</option>
                  <option value="tirage_au_sort">Tirage au sort</option>
                </select>
              </div>
            </div>
            <div className="form-actions">
              <button
                className="btn btn-primary"
                id="btn-step-suivant-1"
                disabled={!form.nom}
                onClick={() => setStep(1)}
              >
                Suivant →
              </button>
            </div>
          </div>
        )}

        {/* ── Étape 1 : Pénalités ── */}
        {step === 1 && (
          <div className="form-step">
            <h2 className="form-step-title">Règles & Pénalités</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="penalite-retard" className="form-label">Pénalité de retard (FCFA)</label>
                <input
                  id="penalite-retard"
                  type="number"
                  className="form-input"
                  min={0}
                  step={500}
                  value={form.penalites.retardMontant}
                  onChange={e => updatePenalite('retardMontant', +e.target.value)}
                />
                <span className="form-hint">{formatFCFA(form.penalites.retardMontant)}</span>
              </div>
              <div className="form-group">
                <label htmlFor="penalite-depassement" className="form-label">Pénalité dépassement délai (FCFA)</label>
                <input
                  id="penalite-depassement"
                  type="number"
                  className="form-input"
                  min={0}
                  step={500}
                  value={form.penalites.depassementDelai}
                  onChange={e => updatePenalite('depassementDelai', +e.target.value)}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="interet" className="form-label">Intérêt du tontinier (%)</label>
                <input
                  id="interet"
                  type="number"
                  className="form-input"
                  min={0}
                  max={10}
                  step={0.5}
                  value={form.penalites.interetTontinier}
                  onChange={e => updatePenalite('interetTontinier', +e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="delai-cycles" className="form-label">Délai limite par cycle (jours)</label>
                <input
                  id="delai-cycles"
                  type="number"
                  className="form-input"
                  min={5}
                  max={60}
                  value={form.durateLimiteParCycleDays}
                  onChange={e => update('durateLimiteParCycleDays', +e.target.value)}
                />
              </div>
            </div>
            <div className="form-actions">
              <button className="btn btn-ghost" id="btn-retour-1" onClick={() => setStep(0)}>← Retour</button>
              <button className="btn btn-primary" id="btn-step-suivant-2" onClick={() => setStep(2)}>Suivant →</button>
            </div>
          </div>
        )}

        {/* ── Étape 2 : Récapitulatif ── */}
        {step === 2 && (
          <div className="form-step">
            <h2 className="form-step-title">Récapitulatif & Déploiement</h2>
            <div className="recap-card">
              <dl className="recap-list">
                {[
                  { label: 'Nom', val: form.nom },
                  { label: 'Description', val: form.description || '—' },
                  { label: 'Mise par cycle', val: formatFCFA(form.montantCotisation) },
                  { label: 'Nombre de membres', val: form.nombreMembresMax },
                  { label: 'Fréquence', val: form.frequenceCotisation },
                  { label: 'Ordre de passage', val: form.ordreType === 'fixe' ? 'Fixe' : 'Tirage au sort' },
                  { label: 'Cagnotte totale', val: formatFCFA(form.montantCotisation * form.nombreMembresMax) },
                  { label: 'Pénalité retard', val: formatFCFA(form.penalites.retardMontant) },
                  { label: 'Intérêt tontinier', val: `${form.penalites.interetTontinier}%` },
                ].map(r => (
                  <div key={r.label} className="recap-item">
                    <dt>{r.label}</dt>
                    <dd>{r.val}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="deploy-notice">
              <Rocket size={20} />
              <p>En cliquant sur "Déployer le Smart Contract", les règles de cette tontine seront gravées sur la blockchain et ne pourront plus être modifiées.</p>
            </div>
            <div className="form-actions">
              <button className="btn btn-ghost" id="btn-retour-2" onClick={() => setStep(1)}>← Retour</button>
              <button
                className="btn btn-primary"
                id="btn-deployer"
                onClick={handleDeploy}
                disabled={isPending}
              >
                {isPending ? <Spinner size="sm" /> : <><Rocket size={18} /> Déployer le Smart Contract</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
