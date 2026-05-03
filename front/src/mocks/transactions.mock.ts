import type { Transaction } from '../types/transaction.types';
import type { Notification, Litige } from '../types/transaction.types';

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'tx1', tontineId: 't1', userId: 'u1', type: 'cotisation',    montant: 50000,  status: 'confirmed', txHash: '0xabc1234...def5', paymentMethod: 'mtn_money',  createdAt: '2026-05-01T10:00:00Z', confirmedAt: '2026-05-01T10:02:00Z' },
  { id: 'tx2', tontineId: 't1', userId: 'u3', type: 'cotisation',    montant: 50000,  status: 'confirmed', txHash: '0xbcd2345...ef56', paymentMethod: 'moov_money', createdAt: '2026-05-01T11:00:00Z', confirmedAt: '2026-05-01T11:03:00Z' },
  { id: 'tx3', tontineId: 't1', userId: 'u4', type: 'cotisation',    montant: 50000,  status: 'pending',                               paymentMethod: 'mtn_money',  createdAt: '2026-05-02T09:00:00Z' },
  { id: 'tx4', tontineId: 't1', userId: 'u2', type: 'distribution',  montant: 150000, status: 'confirmed', txHash: '0xcde3456...f678', createdAt: '2026-05-02T14:00:00Z', confirmedAt: '2026-05-02T14:01:00Z' },
  { id: 'tx5', tontineId: 't2', userId: 'u1', type: 'cotisation',    montant: 10000,  status: 'confirmed', txHash: '0xdef4567...7890', paymentMethod: 'mtn_money',  createdAt: '2026-04-28T08:00:00Z', confirmedAt: '2026-04-28T08:02:00Z' },
  { id: 'tx6', tontineId: 't2', userId: 'u4', type: 'penalite',      montant: 2000,   status: 'confirmed', txHash: '0xef56789...8901', createdAt: '2026-04-30T10:00:00Z', confirmedAt: '2026-04-30T10:01:00Z' },
  { id: 'tx7', tontineId: 't1', userId: 'u3', type: 'cotisation',    montant: 50000,  status: 'failed',                                paymentMethod: 'moov_money', createdAt: '2026-04-01T09:00:00Z' },
  { id: 'tx8', tontineId: 't5', userId: 'u1', type: 'remboursement', montant: 30000,  status: 'confirmed', txHash: '0xf678901...9012', createdAt: '2026-03-01T12:00:00Z', confirmedAt: '2026-03-01T12:05:00Z' },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', userId: 'u1', title: 'Cotisation due demain', message: 'Votre cotisation de 50 000 FCFA pour "Tontine des Entrepreneurs" est due le 5 mai 2026.', type: 'rappel', read: false, createdAt: '2026-05-03T08:00:00Z', link: '/tontines/t1/payer' },
  { id: 'n2', userId: 'u1', title: 'Paiement confirmé', message: 'Votre cotisation de 50 000 FCFA a été enregistrée sur la blockchain.', type: 'paiement', read: false, createdAt: '2026-05-01T10:02:00Z', link: '/transactions/tx1' },
  { id: 'n3', userId: 'u1', title: 'Nouvelle tontine disponible', message: 'Vous avez été invité à rejoindre "Investissement Avenir — Porto-Novo".', type: 'systeme', read: true, createdAt: '2026-04-25T14:00:00Z', link: '/invitation/ghi789rst' },
  { id: 'n4', userId: 'u2', title: 'Nouveau membre en attente', message: 'Jean Kouamé souhaite rejoindre votre tontine. Validez ou refusez sa demande.', type: 'systeme', read: false, createdAt: '2026-05-02T16:00:00Z', link: '/orga/tontines/t1/membres' },
  { id: 'n5', userId: 'u1', title: 'Pénalité appliquée', message: 'Une pénalité de retard de 5 000 FCFA a été appliquée à votre compte.', type: 'paiement', read: true, createdAt: '2026-04-15T09:00:00Z' },
];

export const MOCK_LITIGES: Litige[] = [
  { id: 'l1', tontineId: 't1', declarantUserId: 'u1', accuseUserId: 'u3', categorie: 'non_paiement', description: 'Le membre n\'a pas payé sa cotisation depuis 2 mois malgré les rappels.', status: 'en_cours', createdAt: '2026-04-20T10:00:00Z', updatedAt: '2026-04-22T14:00:00Z' },
  { id: 'l2', tontineId: 't2', declarantUserId: 'u4', categorie: 'litige_ordre', description: 'L\'ordre de passage défini ne correspond pas à ce qui avait été convenu lors de la réunion.', status: 'ouvert', createdAt: '2026-05-01T08:00:00Z', updatedAt: '2026-05-01T08:00:00Z' },
  { id: 'l3', tontineId: 't5', declarantUserId: 'u3', accuseUserId: 'u1', categorie: 'fraude', description: 'Montant reçu lors de la distribution inférieur au montant attendu.', status: 'resolu', resolution: 'Vérification blockchain effectuée — transaction correcte. Litige classé sans suite.', createdAt: '2026-03-10T11:00:00Z', updatedAt: '2026-03-15T16:00:00Z' },
];

export const getTransactionsByUser = (userId: string): Transaction[] =>
  MOCK_TRANSACTIONS.filter((t) => t.userId === userId);

export const getTransactionsByTontine = (tontineId: string): Transaction[] =>
  MOCK_TRANSACTIONS.filter((t) => t.tontineId === tontineId);

export const getNotificationsByUser = (userId: string): Notification[] =>
  MOCK_NOTIFICATIONS.filter((n) => n.userId === userId);
