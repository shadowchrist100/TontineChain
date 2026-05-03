// types/user.types.ts
// Conforme à ai-context.md section 4 (KYC désactivé)

export type Role = 'membre' | 'organisateur' | 'admin';

export interface User {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  role: Role;
  tontinesIds: string[];
  createdAt: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  password: string;
}
