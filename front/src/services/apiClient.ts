// services/apiClient.ts
// Instance Axios + intercepteurs JWT
// Pour l'instant, renvoie les mock data

import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Intercepteur requête — ajoute le token JWT
apiClient.interceptors.request.use((config) => {
  // Le token est géré par authStore (en mémoire, jamais localStorage)
  // L'authStore injecte le token via ce mécanisme
  const token = (window as any).__tontinechain_token__;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur réponse — gestion des erreurs globales
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expiré — déconnecter l'utilisateur
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }
    return Promise.reject(error);
  }
);

// Utilitaire pour simuler un délai réseau dans les mocks
export const mockDelay = (ms = 400) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));
