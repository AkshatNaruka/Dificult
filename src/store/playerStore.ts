import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PlayerStats {
  wpm: number;
  accuracy: number;
  level: number;
  xp: number;
  streak: number;
  combo: number;
  totalTests: number;
  totalTime: number; // in seconds
  bestWpm: number;
  bestAccuracy: number;
  longestStreak: number;
  gamesPlayed: number;
  charactersTyped: number;
  wordsTyped: number;
  dailyChallengesCompleted: number;
  lastPlayedDate: string;
}

export interface TestHistory {
  id: string;
  date: string;
  wpm: number;
  accuracy: number;
  mode: string;
  duration: number;
  charactersTyped: number;
  xpGained: number;
}

export interface DailyChallenge {
  date: string;
  mode: string;
  text: string;
  target: number; // target WPM or accuracy
  reward: number; // XP reward
  completed: boolean;
  bestScore?: number;
}

export interface Player {
  id: string;
  name: string;
  avatar: string;
  createdAt: string;
  stats: PlayerStats;
  testHistory: TestHistory[];
  achievements: string[]; // Array of achievement IDs
  dailyChallenges: DailyChallenge[];
  preferences: {
    preferredMode: string;
    notifications: boolean;
    autoSave: boolean;
  };
}

interface PlayerState {
  player: Player | null;
  
  // Actions
  initializePlayer: () => void;
  updateStats: (newStats: Partial<PlayerStats>) => void;
  addTestResult: (result: Omit<TestHistory, 'id' | 'date'>) => void;
  unlockAchievement: (achievementId: string) => void;
  completeDailyChallenge: (score: number) => void;
  generateTodayChallenge: () => void;
  updatePreferences: (preferences: Partial<Player['preferences']>) => void;
  
  // Getters
  getLeaderboardEntry: () => { name: string; wpm: number; accuracy: number; avatar: string; level: number; } | null;
  getTodayChallenge: () => DailyChallenge | null;
}

// Generate unique player ID based on browser fingerprint and timestamp
function generatePlayerId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  const navigator_info = typeof navigator !== 'undefined' ? 
    (navigator.userAgent + navigator.language + screen.width + screen.height).length.toString(36) : 
    'default';
  return `player_${navigator_info}_${timestamp}_${random}`;
}

// Generate random player name
function generatePlayerName(): string {
  const adjectives = [
    'Swift', 'Quick', 'Fast', 'Rapid', 'Speedy', 'Lightning', 'Blazing', 'Turbo',
    'Ninja', 'Cyber', 'Digital', 'Quantum', 'Stellar', 'Cosmic', 'Phoenix', 'Thunder',
    'Shadow', 'Mystic', 'Elite', 'Alpha', 'Prime', 'Ultra', 'Hyper', 'Master'
  ];
  
  const nouns = [
    'Typer', 'Fingers', 'Keys', 'Words', 'Text', 'Code', 'Script', 'Data',
    'Warrior', 'Master', 'Wizard', 'Hero', 'Champion', 'Elite', 'Pro', 'Ace',
    'Legend', 'Storm', 'Blade', 'Force', 'Spirit', 'Ghost', 'Phantom', 'Viper'
  ];
  
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 999) + 1;
  
  return `${adjective}${noun}${number}`;
}

// Generate random avatar emoji
function generateAvatar(): string {
  const avatars = [
    '🎯', '⚡', '🚀', '🔥', '💎', '🌟', '⭐', '🎮', '🏆', '👑',
    '🥷', '🤖', '👨‍💻', '👩‍💻', '🦸‍♂️', '🦸‍♀️', '🧙‍♂️', '🧙‍♀️', '🎪', '🎨'
  ];
  return avatars[Math.floor(Math.random() * avatars.length)];
}

// Daily challenge texts and modes
const challengeTexts = {
  speed: [
    "The quick brown fox jumps over the lazy dog with remarkable speed and precision.",
    "Programming languages like JavaScript, Python, and TypeScript enable developers to build amazing applications.",
    "Artificial intelligence and machine learning are transforming the way we interact with technology.",
    "The future of typing lies in the perfect balance between speed and accuracy.",
    "Quantum computing promises to solve complex problems that classical computers cannot handle."
  ],
  accuracy: [
    "Precision is more important than speed when it comes to professional typing.",
    "Every character matters when you're writing code or important documents.",
    "The difference between good and great typists is their attention to detail.",
    "Careful typing prevents errors and saves time in the long run.",
    "Quality over quantity - this principle applies to typing as much as anything else."
  ],
  vowels: [
    "aeiou aeiou aeiou beautiful outstanding education",
    "awesome incredible outstanding beautiful curious",
    "mysterious adventurous courageous ambitious creative"
  ],
  numbers: [
    "1234567890 1234567890 1234567890 password123 user456",
    "The year 2024 has been amazing with 365 days of progress",
    "Phone numbers like 555-1234 and codes like 9876 are common"
  ]
};

function generateDailyChallenge(): DailyChallenge {
  const today = new Date().toISOString().split('T')[0];
  const modes = ['speed', 'accuracy', 'vowels', 'numbers'];
  const mode = modes[Math.floor(Math.random() * modes.length)];
  const texts = challengeTexts[mode as keyof typeof challengeTexts];
  const text = texts[Math.floor(Math.random() * texts.length)];
  
  let target = 60; // default WPM target
  let reward = 100; // default XP reward
  
  switch (mode) {
    case 'speed':
      target = 80;
      reward = 150;
      break;
    case 'accuracy':
      target = 95; // 95% accuracy target
      reward = 120;
      break;
    case 'vowels':
      target = 50;
      reward = 200;
      break;
    case 'numbers':
      target = 40;
      reward = 180;
      break;
  }
  
  return {
    date: today,
    mode,
    text,
    target,
    reward,
    completed: false
  };
}

const defaultStats: PlayerStats = {
  wpm: 0,
  accuracy: 100,
  level: 1,
  xp: 0,
  streak: 0,
  combo: 1,
  totalTests: 0,
  totalTime: 0,
  bestWpm: 0,
  bestAccuracy: 100,
  longestStreak: 0,
  gamesPlayed: 0,
  charactersTyped: 0,
  wordsTyped: 0,
  dailyChallengesCompleted: 0,
  lastPlayedDate: new Date().toISOString().split('T')[0]
};

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      player: null,
      
      initializePlayer: () => {
        const existingPlayer = get().player;
        if (!existingPlayer) {
          const newPlayer: Player = {
            id: generatePlayerId(),
            name: generatePlayerName(),
            avatar: generateAvatar(),
            createdAt: new Date().toISOString(),
            stats: { ...defaultStats },
            testHistory: [],
            achievements: [],
            dailyChallenges: [],
            preferences: {
              preferredMode: 'story',
              notifications: true,
              autoSave: true
            }
          };
          set({ player: newPlayer });
          get().generateTodayChallenge();
        } else {
          // Check if we need to generate today's challenge
          const todayChallenge = get().getTodayChallenge();
          if (!todayChallenge) {
            get().generateTodayChallenge();
          }
        }
      },
      
      updateStats: (newStats) => {
        const { player } = get();
        if (!player) return;
        
        const updatedStats = { ...player.stats, ...newStats };
        
        // Update best scores
        if (newStats.wpm && newStats.wpm > updatedStats.bestWpm) {
          updatedStats.bestWpm = newStats.wpm;
        }
        if (newStats.accuracy && newStats.accuracy > updatedStats.bestAccuracy) {
          updatedStats.bestAccuracy = newStats.accuracy;
        }
        if (newStats.streak && newStats.streak > updatedStats.longestStreak) {
          updatedStats.longestStreak = newStats.streak;
        }
        
        // Calculate level based on XP
        const newLevel = Math.floor(updatedStats.xp / 1000) + 1;
        updatedStats.level = newLevel;
        
        // Update last played date
        updatedStats.lastPlayedDate = new Date().toISOString().split('T')[0];
        
        set({
          player: {
            ...player,
            stats: updatedStats
          }
        });
      },
      
      addTestResult: (result) => {
        const { player } = get();
        if (!player) return;
        
        const testResult: TestHistory = {
          ...result,
          id: `test_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          date: new Date().toISOString()
        };
        
        const updatedHistory = [testResult, ...player.testHistory].slice(0, 50); // Keep last 50
        
        // Update stats based on this test
        const statsUpdate: Partial<PlayerStats> = {
          totalTests: player.stats.totalTests + 1,
          totalTime: player.stats.totalTime + result.duration,
          gamesPlayed: player.stats.gamesPlayed + 1,
          charactersTyped: player.stats.charactersTyped + result.charactersTyped,
          wordsTyped: player.stats.wordsTyped + Math.floor(result.charactersTyped / 5),
          wpm: result.wpm,
          accuracy: result.accuracy,
          xp: player.stats.xp + result.xpGained
        };
        
        set({
          player: {
            ...player,
            testHistory: updatedHistory
          }
        });
        
        get().updateStats(statsUpdate);
      },
      
      unlockAchievement: (achievementId) => {
        const { player } = get();
        if (!player || player.achievements.includes(achievementId)) return;
        
        set({
          player: {
            ...player,
            achievements: [...player.achievements, achievementId]
          }
        });
      },
      
      completeDailyChallenge: (score) => {
        const { player } = get();
        if (!player) return;
        
        const today = new Date().toISOString().split('T')[0];
        const challengeIndex = player.dailyChallenges.findIndex(c => c.date === today);
        
        if (challengeIndex >= 0) {
          const challenge = player.dailyChallenges[challengeIndex];
          const updatedChallenge = {
            ...challenge,
            completed: true,
            bestScore: Math.max(challenge.bestScore || 0, score)
          };
          
          const updatedChallenges = [...player.dailyChallenges];
          updatedChallenges[challengeIndex] = updatedChallenge;
          
          set({
            player: {
              ...player,
              dailyChallenges: updatedChallenges
            }
          });
          
          // Award XP
          get().updateStats({
            xp: player.stats.xp + challenge.reward,
            dailyChallengesCompleted: player.stats.dailyChallengesCompleted + 1
          });
        }
      },
      
      generateTodayChallenge: () => {
        const { player } = get();
        if (!player) return;
        
        const today = new Date().toISOString().split('T')[0];
        const existingChallenge = player.dailyChallenges.find(c => c.date === today);
        
        if (!existingChallenge) {
          const newChallenge = generateDailyChallenge();
          set({
            player: {
              ...player,
              dailyChallenges: [...player.dailyChallenges, newChallenge].slice(-30) // Keep last 30 days
            }
          });
        }
      },
      
      updatePreferences: (preferences) => {
        const { player } = get();
        if (!player) return;
        
        set({
          player: {
            ...player,
            preferences: { ...player.preferences, ...preferences }
          }
        });
      },
      
      getLeaderboardEntry: () => {
        const { player } = get();
        if (!player) return null;
        
        return {
          name: player.name,
          wpm: Math.round(player.stats.bestWpm),
          accuracy: Math.round(player.stats.bestAccuracy * 10) / 10,
          avatar: player.avatar,
          level: player.stats.level
        };
      },
      
      getTodayChallenge: () => {
        const { player } = get();
        if (!player) return null;
        
        const today = new Date().toISOString().split('T')[0];
        return player.dailyChallenges.find(c => c.date === today) || null;
      }
    }),
    {
      name: 'typewarrior-player',
      partialize: (state) => ({ player: state.player }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Ensure player is initialized after rehydration
          setTimeout(() => {
            if (!state.player) {
              state.initializePlayer();
            }
          }, 0);
        }
      }
    }
  )
);