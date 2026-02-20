import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Theme, ThemeConfig } from '@/types/theme';
import { themes, getThemeById, getDefaultTheme } from '@/data/themes';

interface ThemeState extends ThemeConfig {
  // Available themes
  availableThemes: Theme[];

  // Current active theme object
  activeTheme: Theme;

  // Actions
  setTheme: (themeId: string) => void;
  setFontSize: (size: number) => void;
  setFontFamily: (family: string) => void;
  setSmoothCaret: (smooth: boolean) => void;
  setShowKeyboard: (show: boolean) => void;

  // Theme utilities
  applyTheme: () => void;
  resetToDefault: () => void;
}

const defaultConfig: ThemeConfig = {
  currentTheme: 'minimal',
  fontSize: 16,
  fontFamily: 'Inter',
  smoothCaret: true,
  showKeyboard: false,
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      // Initial state
      ...defaultConfig,
      availableThemes: themes,
      activeTheme: getDefaultTheme(),

      // Actions
      setTheme: (themeId: string) => {
        const theme = getThemeById(themeId);
        if (theme) {
          set({ currentTheme: themeId, activeTheme: theme });
          // Apply theme immediately
          get().applyTheme();
        }
      },

      setFontSize: (size: number) => {
        set({ fontSize: Math.max(12, Math.min(32, size)) });
        get().applyTheme();
      },

      setFontFamily: (family: string) => {
        set({ fontFamily: family });
        get().applyTheme();
      },

      setSmoothCaret: (smooth: boolean) => {
        set({ smoothCaret: smooth });
      },

      setShowKeyboard: (show: boolean) => {
        set({ showKeyboard: show });
      },

      applyTheme: () => {
        const state = get();
        const { activeTheme } = state;

        const root = document.documentElement;

        // Map store colors to our custom CSS variables
        root.style.setProperty('--bg-primary', activeTheme.colors.background);
        root.style.setProperty('--bg-secondary', activeTheme.colors.backgroundSecondary);
        root.style.setProperty('--text-primary', activeTheme.colors.text);
        root.style.setProperty('--text-main', activeTheme.colors.textDimmed);
        root.style.setProperty('--text-accent', activeTheme.colors.accent);
        root.style.setProperty('--text-error', activeTheme.colors.error);

        // Create custom muted/glass variants based on the theme colors (using hex to rgba approximations for simplicity, or hardcoded approximations)
        // For a robust solution, we're relying on the base colors mapping accurately.
        root.style.setProperty('--bg-glass', activeTheme.colors.backgroundSecondary + 'CC'); // 80% opacity hex
        root.style.setProperty('--border-glass', activeTheme.colors.border + '66'); // 40% opacity hex
        root.style.setProperty('--bg-error', activeTheme.colors.error + '26'); // 15% opacity hex
        root.style.setProperty('--text-accent-muted', activeTheme.colors.accent + '33'); // 20% opacity hex

        root.className = root.className.replace(/theme-\w+/g, '');
        root.classList.add(`theme-${activeTheme.id}`);
      },

      resetToDefault: () => {
        set({
          ...defaultConfig,
          activeTheme: getDefaultTheme()
        });
        get().applyTheme();
      },
    }),
    {
      name: 'typewarrior-theme',
      partialize: (state) => ({
        currentTheme: state.currentTheme,
        fontSize: state.fontSize,
        fontFamily: state.fontFamily,
        smoothCaret: state.smoothCaret,
        showKeyboard: state.showKeyboard,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Ensure the activeTheme is set after rehydration
          const theme = getThemeById(state.currentTheme);
          if (theme) {
            state.activeTheme = theme;
            // Apply theme on rehydration
            setTimeout(() => state.applyTheme(), 0);
          }
        }
      },
    }
  )
);