import type { User } from '../types/user.types';

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    nom: 'Agossou',
    prenom: 'Koffi',
    telephone: '+22967001122',
    email: 'koffi@example.com',
    role: 'membre',
    tontinesIds: ['t1', 't2'],
    createdAt: '2026-01-15T08:00:00Z',
  },
  {
    id: 'u2',
    nom: 'Dossou',
    prenom: 'Aline',
    telephone: '+22996334455',
    email: 'aline@example.com',
    role: 'organisateur',
    tontinesIds: ['t1', 't3'],
    createdAt: '2026-01-10T09:00:00Z',
  },
  {
    id: 'u3',
    nom: 'Zinsou',
    prenom: 'Marc',
    telephone: '+22961778899',
    email: 'marc@example.com',
    role: 'membre',
    tontinesIds: ['t1'],
    createdAt: '2026-01-20T10:00:00Z',
  },
  {
    id: 'u4',
    nom: 'Hounkpatin',
    prenom: 'Béatrice',
    telephone: '+22997556677',
    email: 'beatrice@example.com',
    role: 'membre',
    tontinesIds: ['t2', 't3'],
    createdAt: '2026-02-01T11:00:00Z',
  },
  {
    id: 'u5',
    nom: 'Adjovi',
    prenom: 'Rodrigue',
    telephone: '+22961223344',
    email: 'rodrigue@example.com',
    role: 'organisateur',
    tontinesIds: ['t2'],
    createdAt: '2025-12-01T08:00:00Z',
  },
  {
    id: 'admin1',
    nom: 'Admin',
    prenom: 'TontineChain',
    telephone: '+22900000001',
    email: 'admin@tontinechain.bj',
    role: 'admin',
    tontinesIds: [],
    createdAt: '2025-11-01T00:00:00Z',
  },
];

// Utilisateurs par email (pour la simulation de login)
export const USERS_BY_EMAIL: Record<string, User & { password: string }> = {
  'koffi@example.com':     { ...MOCK_USERS[0], password: 'password123' },
  'aline@example.com':     { ...MOCK_USERS[1], password: 'password123' },
  'marc@example.com':      { ...MOCK_USERS[2], password: 'password123' },
  'beatrice@example.com':  { ...MOCK_USERS[3], password: 'password123' },
  'rodrigue@example.com':  { ...MOCK_USERS[4], password: 'password123' },
  'admin@tontinechain.bj': { ...MOCK_USERS[5], password: 'admin123' },
};
