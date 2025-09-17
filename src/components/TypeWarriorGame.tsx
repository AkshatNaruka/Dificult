'use client';

import { useState, useEffect } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { useThemeStore } from '@/store/themeStore';
import Header from './Header';
import GameModeSelector from './GameModeSelector';
import TypingArea from './TypingArea';
import StatsPanel from './StatsPanel';
import Leaderboard from './Leaderboard';
import AchievementsPanel from './AchievementsPanel';
import RoomSelector from './RoomSelector';
import MultiplayerRace from './MultiplayerRace';
import Settings from './Settings';

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
  // Initialize socket connection
  useSocket();
  
  // Initialize theme store and apply theme on mount
  const { applyTheme } = useThemeStore();
  
  useEffect(() => {
    // Apply theme on component mount
    applyTheme();
  }, [applyTheme]);
  
  const [gameMode, setGameMode] = useState<GameMode>('story');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showRoomSelector, setShowRoomSelector] = useState(false);
  const [showMultiplayerRace, setShowMultiplayerRace] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
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

  const handleJoinRace = () => {
    setShowRoomSelector(true);
  };

  const handleCreateRoom = () => {
    setShowRoomSelector(true);
  };

  const handleStartMultiplayerRace = () => {
    setShowRoomSelector(false);
    setShowMultiplayerRace(true);
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
              onJoinRace={handleJoinRace}
              onCreateRoom={handleCreateRoom}
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

        {/* Modals */}
        <RoomSelector
          isVisible={showRoomSelector}
          onClose={() => setShowRoomSelector(false)}
          onJoinRace={handleStartMultiplayerRace}
        />
        
        <MultiplayerRace
          isVisible={showMultiplayerRace}
          onClose={() => setShowMultiplayerRace(false)}
        />
        
        <Settings
          isVisible={showSettings}
          onClose={() => setShowSettings(false)}
        />
      </div>
    </div>
  );
}