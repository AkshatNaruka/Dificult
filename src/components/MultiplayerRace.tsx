'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRaceStore, Player, RaceRoom } from '@/store/raceStore';
import { useSocket } from '@/hooks/useSocket';

interface MultiplayerRaceProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function MultiplayerRace({ isVisible, onClose }: MultiplayerRaceProps) {
  const { currentRoom, currentPlayer } = useRaceStore();
  const { updateProgress, markReady, leaveRoom, socket } = useSocket();
  
  const [typedText, setTypedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Get current room data or fallback
  const players = currentRoom?.players || [];
  const raceText = currentRoom?.text || "Speed through the winding course of letters. Navigate the challenging turns of punctuation and acceleration zones of common words. Cross the finish line first by maintaining both speed and accuracy.";
  const raceStarted = currentRoom?.isStarted || false;

  // Socket event handlers
  useEffect(() => {
    if (!socket) return;

    const handleCountdown = (data: { countdown: number }) => {
      setCountdown(data.countdown);
    };

    const handleRaceStart = () => {
      setStartTime(Date.now());
      setCountdown(0);
    };

    const handleRaceFinished = (data: { room: RaceRoom; winner: Player }) => {
      console.log('Race finished!', data);
    };

    socket.on('race:countdown', handleCountdown);
    socket.on('race:start', handleRaceStart);
    socket.on('race:finished', handleRaceFinished);

    return () => {
      socket.off('race:countdown', handleCountdown);
      socket.off('race:start', handleRaceStart);
      socket.off('race:finished', handleRaceFinished);
    };
  }, [socket]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleStartRace = () => {
    if (!isReady) {
      setIsReady(true);
      markReady();
    }
  };

  const handleCloseRace = () => {
    leaveRoom();
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!raceStarted || countdown > 0) return;
    
    const value = (e.target as HTMLInputElement).value;
    const lastChar = value[value.length - 1];
    
    if (lastChar === raceText[currentIndex]) {
      setCurrentIndex(prev => prev + 1);
      setTypedText(value);
      
      // Calculate progress and WPM
      const progress = (currentIndex + 1) / raceText.length * 100;
      const timeElapsed = startTime ? (Date.now() - startTime) / 1000 / 60 : 0; // minutes
      const wordsTyped = value.split(' ').length;
      const wmp = timeElapsed > 0 ? Math.round(wordsTyped / timeElapsed) : 0;
      
      // Send progress to server
      updateProgress(progress, wmp, 99.5);
      
      // Check if race is complete
      if (currentIndex + 1 >= raceText.length) {
        console.log('Race complete for current player!');
      }
    }
  };

  const getCharacterClass = (index: number) => {
    if (index < currentIndex) {
      return 'text-green-400';
    } else if (index === currentIndex && raceStarted && countdown === 0) {
      return 'bg-blue-400 text-black animate-pulse';
    } else {
      return 'text-gray-400';
    }
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-800 rounded-2xl p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">🏎️ Type Racing - Multiplayer</h2>
          <button
            onClick={handleCloseRace}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Countdown */}
        {countdown > 0 && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-10">
            <motion.div
              key={countdown}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              className="text-8xl font-bold text-white"
            >
              {countdown}
            </motion.div>
          </div>
        )}

        {/* Race Track */}
        <div className="mb-6 bg-gray-900 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">🏁 Race Progress</h3>
          <div className="space-y-3">
            {players.map((player) => (
              <div key={player.id} className="flex items-center gap-4">
                <div className="w-20 text-sm font-medium">
                  #{player.position} {player.name}
                  {player.id === currentPlayer?.id && ' (You)'}
                </div>
                <div className="flex-1 relative bg-gray-700 rounded-full h-8">
                  <div 
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-300"
                    style={{ width: `${player.progress}%` }}
                  />
                  <div 
                    className="absolute top-1/2 transform -translate-y-1/2 text-2xl transition-all duration-300"
                    style={{ left: `${Math.max(0, player.progress - 2)}%` }}
                  >
                    {player.avatar}
                  </div>
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    🏁
                  </div>
                </div>
                <div className="w-16 text-sm text-gray-300">
                  {player.wpm} WPM
                </div>
                {player.isFinished && (
                  <div className="text-yellow-400 font-bold">FINISHED!</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Text Display */}
        <div className="mb-6 p-6 bg-gray-900 rounded-xl">
          <div className="text-lg leading-relaxed font-mono">
            {raceText.split('').map((char, index) => (
              <span
                key={index}
                className={`${getCharacterClass(index)} transition-colors duration-100`}
              >
                {char}
              </span>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="mb-6">
          <input
            type="text"
            value={typedText}
            onChange={() => {}} // Controlled by onKeyDown
            onKeyDown={handleKeyPress}
            disabled={!raceStarted || countdown > 0}
            placeholder={raceStarted ? "Type the text above..." : "Click 'Start Race' to begin"}
            className="w-full p-4 bg-gray-700 border border-gray-600 rounded-xl text-lg font-mono 
                       focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                       disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-300">
              Progress: {currentPlayer?.progress?.toFixed(1) || 0}%
            </div>
            <div className="text-sm text-gray-300">
              WPM: {currentPlayer?.wpm || 0}
            </div>
            <div className="text-sm text-gray-300">
              Position: #{currentPlayer?.position || 1}
            </div>
          </div>
          
          {!raceStarted && !isReady && (
            <button
              onClick={handleStartRace}
              className="btn-primary"
            >
              🏁 Ready to Race
            </button>
          )}
          
          {!raceStarted && isReady && (
            <div className="text-lg font-bold text-yellow-400">
              ⏳ Waiting for other players...
            </div>
          )}
          
          {raceStarted && currentPlayer?.isFinished && (
            <div className="text-xl font-bold text-yellow-400">
              🏆 Race Complete! Position: #{currentPlayer.position}
            </div>
          )}
        </div>

        {/* Players List */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {players.map((player) => (
            <div key={player.id} className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{player.avatar}</span>
                <span className="font-semibold">{player.name}</span>
                {player.id === currentPlayer?.id && (
                  <span className="text-xs bg-blue-500 px-2 py-1 rounded">YOU</span>
                )}
              </div>
              <div className="text-sm space-y-1">
                <div>Position: #{player.position}</div>
                <div>Progress: {player.progress.toFixed(1)}%</div>
                <div>WPM: {player.wpm}</div>
                <div>Accuracy: {player.accuracy.toFixed(1)}%</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}