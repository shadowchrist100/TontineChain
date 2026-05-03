// types/transaction.types.ts
// Conforme à ai-context.md section 4

export type TransactionType = 'cotisation' | 'penalite' | 'distribution' | 'remboursement';
export type TransactionStatus = 'pending' | 'confirmed' | 'failed';
export type PaymentMethod = 'mtn_money' | 'moov_money' | 'orange_money';

export interface Transaction {
  id: string;
  tontineId: string;
  userId: string;
  type: TransactionType;
  montant: number;                 // en FCFA
  status: TransactionStatus;
  txHash?: string;                 // hash blockchain
  paymentMethod?: PaymentMethod;
  createdAt: string;
  confirmedAt?: string;
}

export interface PaiementPayload {
  tontineId: string;
  montant: number;
  paymentMethod: PaymentMethod;
  phoneNumber: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'paiement' | 'rappel' | 'systeme' | 'litige';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface Litige {
  id: string;
  tontineId: string;
  declarantUserId: string;
  accuseUserId?: string;
  categorie: 'non_paiement' | 'litige_ordre' | 'fraude' | 'autre';
  description: string;
  status: 'ouvert' | 'en_cours' | 'resolu' | 'rejete';
  resolution?: string;
  createdAt: string;
  updatedAt: string;
}
