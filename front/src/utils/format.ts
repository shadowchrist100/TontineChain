// utils/format.ts — Fonctions utilitaires partagées

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { TontineStatus } from '../types/tontine.types';

export function formatFCFA(n: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'decimal' }).format(n) + ' FCFA';
}

export function formatDate(iso: string, pattern = 'd MMM yyyy'): string {
  return format(new Date(iso), pattern, { locale: fr });
}

export function formatDateTime(iso: string): string {
  return format(new Date(iso), "d MMM yyyy 'à' HH:mm", { locale: fr });
}

export type StatusVariant = 'success' | 'info' | 'pending' | 'error';

export const STATUS_VARIANT: Record<TontineStatus, StatusVariant> = {
  active: 'success',
  adhesion: 'info',
  configuration: 'pending',
  terminee: 'error',
  annulee: 'error',
};

export const STATUS_LABEL: Record<TontineStatus, string> = {
  active: 'Active',
  adhesion: 'Adhésion',
  configuration: 'Configuration',
  terminee: 'Terminée',
  annulee: 'Annulée',
};

/** Calcule le pourcentage de progression d'un cycle */
export function cycleProgress(current: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(100, Math.round((current / total) * 100));
}
