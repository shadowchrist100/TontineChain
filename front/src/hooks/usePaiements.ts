// hooks/usePaiements.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { mockDelay } from '../services/apiClient';
import { MOCK_TRANSACTIONS, getTransactionsByUser, getTransactionsByTontine } from '../mocks/transactions.mock';
import type { Transaction, PaiementPayload } from '../types/transaction.types';
import { paymentService } from '../services/paymentService';

export const usePaiements = (userId: string) =>
  useQuery({
    queryKey: ['transactions', userId],
    queryFn: async () => {
      await mockDelay(400);
      return getTransactionsByUser(userId);
    },
    staleTime: 1000 * 60,
    enabled: !!userId,
  });

export const usePaiementsTontine = (tontineId: string) =>
  useQuery({
    queryKey: ['transactions', 'tontine', tontineId],
    queryFn: async () => {
      await mockDelay(400);
      return getTransactionsByTontine(tontineId);
    },
    staleTime: 1000 * 60,
    enabled: !!tontineId,
  });

export const useAllTransactions = () =>
  useQuery({
    queryKey: ['transactions', 'all'],
    queryFn: async () => {
      await mockDelay(500);
      return MOCK_TRANSACTIONS;
    },
    staleTime: 1000 * 60,
  });

export const usePayerCotisation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: PaiementPayload): Promise<Transaction> => {
      const service = payload.paymentMethod === 'mtn_money' ? paymentService.mtn : paymentService.moov;
      const result = await service.initiatePayment(payload.phoneNumber, payload.montant, payload.tontineId);

      if (!result.success) throw new Error(result.message);

      const tx: Transaction = {
        id: `tx${Date.now()}`,
        tontineId: payload.tontineId,
        userId: 'current',
        type: 'cotisation',
        montant: payload.montant,
        status: 'pending',
        txHash: result.txHash,
        paymentMethod: payload.paymentMethod,
        createdAt: new Date().toISOString(),
      };
      MOCK_TRANSACTIONS.push(tx);
      return tx;
    },
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['tontines'] });
      toast.success('Paiement initié. En attente de confirmation de l\'opérateur.');
    },
    onError: (error: any) => {
      toast.error(error.message ?? 'Échec du paiement. Veuillez réessayer.');
    },
  });
};
