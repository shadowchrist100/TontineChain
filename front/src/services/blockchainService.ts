// services/blockchainService.ts
// Stub ethers.js — simulation lecture smart contract

import { mockDelay } from './apiClient';

export const blockchainService = {
  // Simuler la lecture du solde d'une tontine
  async getTontineBalance(contractAddress: string): Promise<number> {
    await mockDelay(600);
    console.log(`[Blockchain] Reading balance from ${contractAddress}`);
    // Montant simulé en FCFA
    return 600000;
  },

  // Simuler la vérification d'une transaction
  async verifyTransaction(txHash: string): Promise<boolean> {
    await mockDelay(800);
    console.log(`[Blockchain] Verifying tx ${txHash}`);
    return true;
  },

  // Simuler le déploiement d'un smart contract
  async deployTontineContract(_params: {
    nom: string;
    montantCotisation: number;
    nombreMembres: number;
  }): Promise<{ address: string; txHash: string }> {
    await mockDelay(2000);
    const address = `0x${Math.random().toString(16).slice(2, 42).padEnd(40, '0')}`;
    const txHash = `0x${Math.random().toString(16).slice(2, 66).padEnd(64, '0')}`;
    console.log(`[Blockchain] Contract deployed at ${address}`);
    return { address, txHash };
  },

  // Simuler le paiement d'une cotisation via smart contract
  async payerCotisation(contractAddress: string, montant: number): Promise<string> {
    await mockDelay(1500);
    const txHash = `0x${Math.random().toString(16).slice(2, 66).padEnd(64, '0')}`;
    console.log(`[Blockchain] Cotisation ${montant} FCFA → ${contractAddress}`);
    return txHash;
  },
};
