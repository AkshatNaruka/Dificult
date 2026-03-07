import { create } from 'zustand';

export interface LeaderboardEntry {
  id: string;
  name: string;
  wpm: number;
  accuracy: number;
  avatar: string;
  level: number;
  lastUpdated: string;
  rank?: number;
}

interface LeaderboardState {
  globalLeaderboard: LeaderboardEntry[];
  weeklyLeaderboard: LeaderboardEntry[];
  localLeaderboard: LeaderboardEntry[];
  playerRank: number | null;
  isLoading: boolean;

  // Actions
  initializeLeaderboard: () => void;
  addOrUpdatePlayer: (entry: Omit<LeaderboardEntry, 'lastUpdated' | 'rank'>) => void;
  loadGlobalLeaderboard: () => Promise<void>;
  saveToGlobalLeaderboard: (entry: LeaderboardEntry) => Promise<void>;
  calculateRanks: () => void;
  getPlayerRank: (playerId: string) => number | null;
}

// Default leaderboard entries for initial state
const defaultLeaderboard: LeaderboardEntry[] = [
  { id: 'default_1', name: 'TypeMaster', wpm: 156, accuracy: 98.5, avatar: '👑', level: 12, lastUpdated: '2024-01-01', rank: 1 },
  { id: 'default_2', name: 'SpeedDemon', wpm: 142, accuracy: 97.2, avatar: '⚡', level: 10, lastUpdated: '2024-01-01', rank: 2 },
  { id: 'default_3', name: 'KeyboardNinja', wpm: 138, accuracy: 99.1, avatar: '🥷', level: 11, lastUpdated: '2024-01-01', rank: 3 },
  { id: 'default_4', name: 'FingerFlash', wpm: 134, accuracy: 96.8, avatar: '💨', level: 9, lastUpdated: '2024-01-01', rank: 4 },
  { id: 'default_5', name: 'TextTornado', wpm: 129, accuracy: 98.3, avatar: '🌪️', level: 8, lastUpdated: '2024-01-01', rank: 5 },
  { id: 'default_6', name: 'CodeCrusher', wpm: 125, accuracy: 97.8, avatar: '💻', level: 7, lastUpdated: '2024-01-01', rank: 6 },
  { id: 'default_7', name: 'SwiftStroke', wpm: 121, accuracy: 96.5, avatar: '🚀', level: 7, lastUpdated: '2024-01-01', rank: 7 },
  { id: 'default_8', name: 'QuantumQuill', wpm: 118, accuracy: 98.9, avatar: '🔮', level: 6, lastUpdated: '2024-01-01', rank: 8 },
  { id: 'default_9', name: 'LaserLetters', wpm: 115, accuracy: 95.7, avatar: '🎯', level: 6, lastUpdated: '2024-01-01', rank: 9 },
  { id: 'default_10', name: 'TurboType', wpm: 112, accuracy: 97.1, avatar: '🏎️', level: 5, lastUpdated: '2024-01-01', rank: 10 },
];

export const useLeaderboardStore = create<LeaderboardState>((set, get) => ({
  globalLeaderboard: [...defaultLeaderboard],
  weeklyLeaderboard: [],
  localLeaderboard: [],
  playerRank: null,
  isLoading: false,

  initializeLeaderboard: () => {
    // Load local leaderboard from localStorage
    const savedLeaderboard = localStorage.getItem('dificult-local-leaderboard');
    if (savedLeaderboard) {
      try {
        const localData = JSON.parse(savedLeaderboard);
        set({ localLeaderboard: localData });
      } catch (error) {
        console.error('Failed to load local leaderboard:', error);
      }
    }

    // Try to load global leaderboard
    get().loadGlobalLeaderboard();
    get().calculateRanks();
  },

  addOrUpdatePlayer: (entry) => {
    const now = new Date().toISOString();
    const newEntry: LeaderboardEntry = {
      ...entry,
      lastUpdated: now
    };

    const { localLeaderboard, globalLeaderboard } = get();

    // Update local leaderboard
    const existingLocalIndex = localLeaderboard.findIndex(e => e.id === entry.id);
    let updatedLocal;

    if (existingLocalIndex >= 0) {
      updatedLocal = [...localLeaderboard];
      updatedLocal[existingLocalIndex] = newEntry;
    } else {
      updatedLocal = [...localLeaderboard, newEntry];
    }

    // Sort and keep top 100
    updatedLocal.sort((a, b) => {
      if (b.wpm !== a.wpm) return b.wpm - a.wpm;
      return b.accuracy - a.accuracy;
    });
    updatedLocal = updatedLocal.slice(0, 100);

    // Update global leaderboard (local copy)
    const existingGlobalIndex = globalLeaderboard.findIndex(e => e.id === entry.id);
    let updatedGlobal;

    if (existingGlobalIndex >= 0) {
      updatedGlobal = [...globalLeaderboard];
      updatedGlobal[existingGlobalIndex] = newEntry;
    } else {
      updatedGlobal = [...globalLeaderboard, newEntry];
    }

    // Sort and keep top 100
    updatedGlobal.sort((a, b) => {
      if (b.wpm !== a.wpm) return b.wpm - a.wpm;
      return b.accuracy - a.accuracy;
    });
    updatedGlobal = updatedGlobal.slice(0, 100);

    set({
      localLeaderboard: updatedLocal,
      globalLeaderboard: updatedGlobal
    });

    // Save to localStorage
    localStorage.setItem('dificult-local-leaderboard', JSON.stringify(updatedLocal));

    // Try to save to global leaderboard
    get().saveToGlobalLeaderboard(newEntry);
    get().calculateRanks();
  },

  loadGlobalLeaderboard: async () => {
    set({ isLoading: true });

    try {
      const res = await fetch('/api/leaderboard');
      if (res.ok) {
        const data = await res.json();

        const mappedWpm = (data.topWpm || []).map((entry: any, index: number) => ({
          id: entry.id,
          name: entry.display_name || entry.email?.split('@')[0] || 'Unknown',
          wpm: entry.best_wpm,
          accuracy: entry.best_accuracy,
          avatar: entry.avatar || '🎯',
          level: entry.level || 1,
          lastUpdated: new Date().toISOString(),
          rank: index + 1
        }));

        set({ globalLeaderboard: mappedWpm });
      }
    } catch (error) {
      console.error('Failed to load global leaderboard:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  saveToGlobalLeaderboard: async (entry) => {
    // This is now purely handled via the API backend (/api/stats) when users finish a test.
    // Kept here for potential optimistic updates if needed, though redundant.
  },

  calculateRanks: () => {
    const { globalLeaderboard } = get();

    const rankedLeaderboard = globalLeaderboard.map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));

    set({ globalLeaderboard: rankedLeaderboard });
  },

  getPlayerRank: (playerId) => {
    const { globalLeaderboard } = get();
    const playerEntry = globalLeaderboard.find(entry => entry.id === playerId);
    return playerEntry ? playerEntry.rank || null : null;
  }
}));