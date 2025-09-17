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
  currentTheme: 'dark',
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
        const { activeTheme, fontSize, fontFamily } = state;
        
        // Apply CSS custom properties to the document root
        const root = document.documentElement;
        
        // Apply color variables
        Object.entries(activeTheme.colors).forEach(([key, value]) => {
          root.style.setProperty(`--color-${key}`, value);
        });
        
        // Apply font settings
        root.style.setProperty('--font-size-base', `${fontSize}px`);
        root.style.setProperty('--font-family-base', fontFamily);
        
        // Apply theme class for additional styling
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