import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserPreferences {
  langue: 'fr' | 'en';
  notificationsEmail: boolean;
  notificationsSMS: boolean;
  theme: 'light' | 'dark';
}

interface UserStore {
  preferences: UserPreferences;
  setPreferences: (prefs: Partial<UserPreferences>) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      preferences: {
        langue: 'fr',
        notificationsEmail: true,
        notificationsSMS: true,
        theme: 'light',
      },
      setPreferences: (prefs) =>
        set((state) => ({
          preferences: { ...state.preferences, ...prefs },
        })),
    }),
    { name: 'tontinechain-user-prefs' }
  )
);
