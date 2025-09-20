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
    const savedLeaderboard = localStorage.getItem('typewarrior-local-leaderboard');
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
    localStorage.setItem('typewarrior-local-leaderboard', JSON.stringify(updatedLocal));
    
    // Try to save to global leaderboard
    get().saveToGlobalLeaderboard(newEntry);
    get().calculateRanks();
  },
  
  loadGlobalLeaderboard: async () => {
    set({ isLoading: true });
    
    try {
      // Try to fetch from GitHub Pages (if deployed)
      // For now, we'll simulate this with localStorage for the global data
      const globalData = localStorage.getItem('typewarrior-global-leaderboard');
      if (globalData) {
        const parsed = JSON.parse(globalData);
        const mergedData = [...defaultLeaderboard];
        
        // Merge with existing data
        parsed.forEach((entry: LeaderboardEntry) => {
          const existingIndex = mergedData.findIndex(e => e.id === entry.id);
          if (existingIndex >= 0) {
            mergedData[existingIndex] = entry;
          } else {
            mergedData.push(entry);
          }
        });
        
        // Sort and keep top 100
        mergedData.sort((a, b) => {
          if (b.wpm !== a.wpm) return b.wpm - a.wpm;
          return b.accuracy - a.accuracy;
        });
        
        set({ globalLeaderboard: mergedData.slice(0, 100) });
      }
    } catch (error) {
      console.error('Failed to load global leaderboard:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  
  saveToGlobalLeaderboard: async (entry) => {
    try {
      // For GitHub Pages deployment, this would submit to a serverless function or GitHub API
      // For now, we'll save to localStorage as a simulation
      const existingData = localStorage.getItem('typewarrior-global-leaderboard');
      let globalData = [];
      
      if (existingData) {
        globalData = JSON.parse(existingData);
      }
      
      const existingIndex = globalData.findIndex((e: LeaderboardEntry) => e.id === entry.id);
      if (existingIndex >= 0) {
        globalData[existingIndex] = entry;
      } else {
        globalData.push(entry);
      }
      
      // Sort and keep top 100
      globalData.sort((a: LeaderboardEntry, b: LeaderboardEntry) => {
        if (b.wpm !== a.wpm) return b.wpm - a.wpm;
        return b.accuracy - a.accuracy;
      });
      globalData = globalData.slice(0, 100);
      
      localStorage.setItem('typewarrior-global-leaderboard', JSON.stringify(globalData));
      
      // In a real deployment, this would make an HTTP request to update the shared data
      // Example: await fetch('/api/leaderboard', { method: 'POST', body: JSON.stringify(entry) });
      
    } catch (error) {
      console.error('Failed to save to global leaderboard:', error);
    }
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