// stores/tontineStore.ts
import { create } from 'zustand';
import type { Tontine } from '../types/tontine.types';

interface TontineStore {
  tontines: Tontine[];
  selectedTontine: Tontine | null;
  setTontines: (tontines: Tontine[]) => void;
  setSelectedTontine: (tontine: Tontine | null) => void;
  upsertTontine: (tontine: Tontine) => void;
}

export const useTontineStore = create<TontineStore>((set) => ({
  tontines: [],
  selectedTontine: null,
  setTontines: (tontines) => set({ tontines }),
  setSelectedTontine: (tontine) => set({ selectedTontine: tontine }),
  upsertTontine: (tontine) =>
    set((state) => {
      const exists = state.tontines.findIndex((t) => t.id === tontine.id);
      if (exists >= 0) {
        const updated = [...state.tontines];
        updated[exists] = tontine;
        return { tontines: updated };
      }
      return { tontines: [...state.tontines, tontine] };
    }),
}));
