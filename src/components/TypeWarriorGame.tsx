'use client';

import { useState, useEffect } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { useThemeStore } from '@/store/themeStore';
import { usePlayerStore } from '@/store/playerStore';
import { useLeaderboardStore } from '@/store/leaderboardStore';
import Header from './Header';
import GameModeSelector from './GameModeSelector';
import TypingArea from './TypingArea';
import StatsPanel from './StatsPanel';
import Leaderboard from './Leaderboard';
import AchievementsPanel from './AchievementsPanel';
import Settings from './Settings';
import DailyChallenges from './DailyChallenges';

export type GameMode = 'story' | 'challenge' | 'racing' | 'vowels' | 'numbers' | 'mixed' | 'symbols';

export interface GameStats {
  wpm: number;
  accuracy: number;
  level: number;
  xp: number;
  streak: number;
  combo: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export default function TypeWarriorGame() {
  // Initialize socket connection
  useSocket();
  
  // Initialize stores
  const { applyTheme } = useThemeStore();
  const { player, initializePlayer, updateStats, addTestResult } = usePlayerStore();
  const { addOrUpdatePlayer } = useLeaderboardStore();
  
  useEffect(() => {
    // Apply theme on component mount
    applyTheme();
    // Initialize player data
    initializePlayer();
  }, [applyTheme, initializePlayer]);
  
  const [gameMode, setGameMode] = useState<GameMode>('story');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Use player stats from store, with fallback
  const stats: GameStats = player ? {
    wpm: player.stats.wpm,
    accuracy: player.stats.accuracy,
    level: player.stats.level,
    xp: player.stats.xp,
    streak: player.stats.streak,
    combo: player.stats.combo,
  } : {
    wpm: 0,
    accuracy: 100,
    level: 1,
    xp: 0,
    streak: 0,
    combo: 1,
  };
  
  const [achievements] = useState<Achievement[]>([
    { id: 'first_steps', name: 'First Steps', description: 'Complete your first test', icon: '🐣', unlocked: false },
    { id: 'speed_demon', name: 'Speed Demon', description: 'Type 60+ WPM', icon: '⚡', unlocked: false },
    { id: 'accuracy_ace', name: 'Accuracy Ace', description: 'Achieve 98%+ accuracy', icon: '🎯', unlocked: false },
    { id: 'combo_master', name: 'Combo Master', description: 'Reach 10x combo multiplier', icon: '🔥', unlocked: false },
  ]);

  const handleModeChange = (mode: GameMode) => {
    setGameMode(mode);
    setIsPlaying(false);
  };

  const handleGameStart = () => {
    setIsPlaying(true);
  };

  const handleGameEnd = (wpm: number, accuracy: number, charactersTyped = 0, duration = 60) => {
    setIsPlaying(false);
    
    if (!player) return;
    
    // Calculate XP based on performance
    const xpGained = Math.round(wpm * (accuracy / 100) * stats.combo);
    
    // Update player stats
    const newStreak = accuracy > 95 ? stats.streak + 1 : 0;
    updateStats({
      wpm,
      accuracy,
      streak: newStreak,
      xp: stats.xp + xpGained,
    });
    
    // Add to test history
    addTestResult({
      wpm,
      accuracy,
      mode: gameMode,
      duration,
      charactersTyped: charactersTyped || Math.floor(wpm * 5 * (duration / 60)), // Estimate if not provided
      xpGained,
    });
    
    // Update leaderboard if this is a good score
    if (wpm >= player.stats.bestWpm * 0.8) { // Update if within 80% of best
      const leaderboardEntry = {
        id: player.id,
        name: player.name,
        wpm: Math.max(wpm, player.stats.bestWpm),
        accuracy: Math.max(accuracy, player.stats.bestAccuracy),
        avatar: player.avatar,
        level: player.stats.level,
      };
      addOrUpdatePlayer(leaderboardEntry);
    }
  };

  const handleOpenSettings = () => {
    setShowSettings(true);
  };

  return (
    <div className="min-h-screen text-white">
      <div className="container mx-auto px-4 py-6">
        <Header stats={stats} onOpenSettings={handleOpenSettings} />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
          {/* Main Game Area */}
          <div className="lg:col-span-8">
            <GameModeSelector 
              currentMode={gameMode} 
              onModeChange={handleModeChange}
              isPlaying={isPlaying}
            />
            
            <TypingArea 
              gameMode={gameMode}
              isPlaying={isPlaying}
              onGameStart={handleGameStart}
              onGameEnd={handleGameEnd}
            />
          </div>
          
          {/* Side Panels */}
          <div className="lg:col-span-4 space-y-6">
            <StatsPanel stats={stats} />
            <DailyChallenges />
            <AchievementsPanel achievements={achievements} />
            <Leaderboard />
          </div>
        </div>

        {/* Modals */}
        <Settings
          isVisible={showSettings}
          onClose={() => setShowSettings(false)}
        />
      </div>
    </div>
  );
}