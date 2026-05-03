// hooks/useTontines.ts
// Wrappers TanStack Query — conforme à ai-context.md section 10

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { mockDelay } from '../services/apiClient';
import {
  MOCK_TONTINES,
  getTontineById,
  getTontinesByUserId,
  getTontinesByOrganizer,
} from '../mocks/tontines.mock';
import type { Tontine, CreateTontinePayload } from '../types/tontine.types';

// Lister toutes les tontines d'un utilisateur
export const useTontines = (userId: string) =>
  useQuery({
    queryKey: ['tontines', userId],
    queryFn: async () => {
      await mockDelay(400);
      return getTontinesByUserId(userId);
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    enabled: !!userId,
  });

// Lister les tontines dont l'utilisateur est organisateur
export const useTontinesOrga = (userId: string) =>
  useQuery({
    queryKey: ['tontines', 'orga', userId],
    queryFn: async () => {
      await mockDelay(400);
      return getTontinesByOrganizer(userId);
    },
    staleTime: 1000 * 60 * 2,
    enabled: !!userId,
  });

// Toutes les tontines (admin)
export const useAllTontines = () =>
  useQuery({
    queryKey: ['tontines', 'all'],
    queryFn: async () => {
      await mockDelay(500);
      return MOCK_TONTINES;
    },
    staleTime: 1000 * 60,
  });

// Détail d'une tontine
export const useTontine = (id: string) =>
  useQuery({
    queryKey: ['tontine', id],
    queryFn: async () => {
      await mockDelay(300);
      const t = getTontineById(id);
      if (!t) throw new Error('Tontine introuvable.');
      return t;
    },
    staleTime: 1000 * 60,
    enabled: !!id,
  });

// Créer une tontine
export const useCreerTontine = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateTontinePayload): Promise<Tontine> => {
      await mockDelay(1500);
      const newTontine: Tontine = {
        ...payload,
        id: `t${Date.now()}`,
        chefTontinierUserId: 'u2', // remplacé par user connecté côté API
        ordreBeneficiaires: [],
        status: 'configuration',
        cycleActuel: 0,
        membresIds: [],
        lienInvitation: `https://tontinechain.bj/invitation/${Math.random().toString(36).slice(2, 10)}`,
        createdAt: new Date().toISOString(),
      };
      MOCK_TONTINES.push(newTontine);
      return newTontine;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tontines'] });
      toast.success('Tontine créée avec succès !');
    },
    onError: () => {
      toast.error('Erreur lors de la création de la tontine. Réessayez.');
    },
  });
};
