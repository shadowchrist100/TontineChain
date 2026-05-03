// stores/authStore.ts
// Conforme à ai-context.md section 9
// Le token JWT est stocké en mémoire, jamais en localStorage

import { create } from 'zustand';
import type { User, LoginPayload } from '../types/user.types';
import { USERS_BY_EMAIL } from '../mocks/users.mock';
import { mockDelay } from '../services/apiClient';
import { toast } from 'sonner';

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginPayload) => Promise<void>;
  logout: () => void;
  setToken: (token: string) => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,

  login: async ({ email, password }) => {
    set({ isLoading: true });
    try {
      await mockDelay(800);
      const found = USERS_BY_EMAIL[email.toLowerCase()];
      if (!found || found.password !== password) {
        throw new Error('Email ou mot de passe incorrect.');
      }
      const { password: _pw, ...user } = found;
      const token = `mock-jwt-${user.id}-${Date.now()}`;
      // Injecter le token pour apiClient
      (window as any).__tontinechain_token__ = token;

      set({ user, token, isAuthenticated: true, isLoading: false });
      toast.success(`Bienvenue, ${user.prenom} !`);
    } catch (err: any) {
      set({ isLoading: false });
      toast.error(err.message ?? 'Erreur de connexion. Réessayez.');
      throw err;
    }
  },

  logout: () => {
    (window as any).__tontinechain_token__ = undefined;
    set({ user: null, token: null, isAuthenticated: false });
    toast.success('Vous avez été déconnecté.');
  },

  setToken: (token: string) => {
    (window as any).__tontinechain_token__ = token;
    set({ token });
  },
}));

// Écouter l'événement de déconnexion forcée (ex: 401)
window.addEventListener('auth:logout', () => {
  useAuthStore.getState().logout();
});
