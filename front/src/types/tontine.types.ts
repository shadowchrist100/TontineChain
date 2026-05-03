// types/tontine.types.ts
// Conforme à ai-context.md section 4

export type FrequenceCotisation = 'hebdomadaire' | 'mensuel' | 'bimensuel';
export type TontineStatus = 'configuration' | 'adhesion' | 'active' | 'terminee' | 'annulee';
export type OrdreType = 'fixe' | 'tirage_au_sort';

export interface Penalites {
  retardMontant: number;           // montant fixe en FCFA
  retardPourcentage?: number;      // OU pourcentage (l'un ou l'autre)
  retraitFraction: number;         // ex: 0.33 = 1/3 de la cagnotte
  depassementDelai: number;        // montant fixe FCFA
  interetTontinier: number;        // pourcentage prélevé par cycle
}

export interface Tontine {
  id: string;
  nom: string;
  description?: string;
  chefTontinierUserId: string;
  montantCotisation: number;       // en FCFA
  frequenceCotisation: FrequenceCotisation;
  frequenceRamassage: FrequenceCotisation;
  nombreMembresMax: number;
  durateLimiteParCycleDays: number;
  ordreType: OrdreType;
  ordreBeneficiaires: string[];    // userIds dans l'ordre de passage
  penalites: Penalites;
  status: TontineStatus;
  smartContractAddress?: string;
  cycleActuel: number;
  membresIds: string[];
  lienInvitation: string;          // URL unique
  createdAt: string;
  demarreAt?: string;
}

export interface CreateTontinePayload {
  nom: string;
  description?: string;
  montantCotisation: number;
  frequenceCotisation: FrequenceCotisation;
  frequenceRamassage: FrequenceCotisation;
  nombreMembresMax: number;
  durateLimiteParCycleDays: number;
  ordreType: OrdreType;
  penalites: Penalites;
}
