'use client';

import { useState } from 'react';
import Header from './Header';
import GameModeSelector from './GameModeSelector';
import TypingArea from './TypingArea';
import StatsPanel from './StatsPanel';
import Leaderboard from './Leaderboard';
import AchievementsPanel from './AchievementsPanel';

export type GameMode = 'story' | 'battle' | 'challenge' | 'racing';

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
  const [gameMode, setGameMode] = useState<GameMode>('story');
  const [isPlaying, setIsPlaying] = useState(false);
  const [stats, setStats] = useState<GameStats>({
    wpm: 0,
    accuracy: 100,
    level: 1,
    xp: 0,
    streak: 0,
    combo: 1,
  });
  
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

  const handleGameEnd = (wpm: number, accuracy: number) => {
    setIsPlaying(false);
    setStats(prev => ({
      ...prev,
      wpm,
      accuracy,
      streak: accuracy > 95 ? prev.streak + 1 : 0,
      xp: prev.xp + Math.round(wpm * (accuracy / 100)),
    }));
  };

  return (
    <div className="min-h-screen text-white">
      <div className="container mx-auto px-4 py-6">
        <Header stats={stats} />
        
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
            <AchievementsPanel achievements={achievements} />
            <Leaderboard />
          </div>
        </div>
      </div>
    </div>
  );
}