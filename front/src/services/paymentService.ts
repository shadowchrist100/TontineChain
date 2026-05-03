// services/paymentService.ts
// Stub MTN Money & Moov Money — simulation paiement mobile

import { mockDelay } from './apiClient';
import type { PaymentMethod } from '../types/transaction.types';

export interface PaymentResult {
  success: boolean;
  txHash?: string;
  reference?: string;
  message: string;
}

const initiatePayment = async (
  method: PaymentMethod,
  phoneNumber: string,
  montant: number,
  tontineId: string,
): Promise<PaymentResult> => {
  await mockDelay(1200);

  // Simulation : 90% de succès
  const success = Math.random() > 0.1;

  if (!success) {
    return {
      success: false,
      message: 'Paiement refusé par l\'opérateur. Vérifiez votre solde et réessayez.',
    };
  }

  const reference = `REF-${Date.now()}`;
  const txHash = `0x${Math.random().toString(16).slice(2, 66).padEnd(64, '0')}`;

  console.log(`[Payment] ${method} — ${montant} FCFA → ${phoneNumber} (tontine: ${tontineId})`);

  return {
    success: true,
    txHash,
    reference,
    message: 'Paiement initié. En attente de confirmation de l\'opérateur (peut prendre jusqu\'à 60 secondes).',
  };
};

export const paymentService = {
  mtn: {
    initiatePayment: (phoneNumber: string, montant: number, tontineId: string) =>
      initiatePayment('mtn_money', phoneNumber, montant, tontineId),
  },
  moov: {
    initiatePayment: (phoneNumber: string, montant: number, tontineId: string) =>
      initiatePayment('moov_money', phoneNumber, montant, tontineId),
  },

  // Confirmation webhook (simulée)
  async checkPaymentStatus(_reference: string): Promise<'pending' | 'confirmed' | 'failed'> {
    await mockDelay(800);
    return 'confirmed';
  },
};
