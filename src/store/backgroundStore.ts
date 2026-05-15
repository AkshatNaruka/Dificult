import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type BackgroundTier = 'free' | 'premium';

export interface BackgroundItem {
  id: string;
  name: string;
  type: 'video' | 'gif' | 'none';
  src: string;
  tier: BackgroundTier;
  preview: string; // emoji or short label for the selector
}

export const backgrounds: BackgroundItem[] = [
  {
    id: 'none',
    name: 'None',
    type: 'none',
    src: '',
    tier: 'free',
    preview: '✕',
  },
  {
    id: 'anime-aesthetic',
    name: 'Anime Chill',
    type: 'gif',
    src: '/backgrounds/anime-aesthetic.gif',
    tier: 'free',
    preview: '🌸',
  },
  {
    id: 'neon-rain',
    name: 'Neon Rain',
    type: 'video',
    src: '/backgrounds/neon-rain.mp4',
    tier: 'free',
    preview: '🌧️',
  },
  {
    id: 'cyber-drive',
    name: 'Cyber Drive',
    type: 'video',
    src: '/backgrounds/cyber-drive.mp4',
    tier: 'free',
    preview: '🚗',
  },
];

interface BackgroundState {
  activeBackgroundId: string;
  setBackground: (id: string) => void;
  getActiveBackground: () => BackgroundItem;
}

export const useBackgroundStore = create<BackgroundState>()(
  persist(
    (set, get) => ({
      activeBackgroundId: 'none',

      setBackground: (id: string) => {
        set({ activeBackgroundId: id });
      },

      getActiveBackground: () => {
        const { activeBackgroundId } = get();
        return backgrounds.find((b) => b.id === activeBackgroundId) || backgrounds[0];
      },
    }),
    {
      name: 'dificult-background',
    }
  )
);
