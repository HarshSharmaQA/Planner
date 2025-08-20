import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeStore {
  darkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (enabled: boolean) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      darkMode: false,
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      setDarkMode: (enabled) => set({ darkMode: enabled })
    }),
    {
      name: 'zz-planner-theme',
      version: 1
    }
  )
);