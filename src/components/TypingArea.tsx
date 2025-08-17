'use client';

import { useState, useEffect, useRef } from 'react';
import { GameMode } from './TypeWarriorGame';

interface TypingAreaProps {
  gameMode: GameMode;
  isPlaying: boolean;
  onGameStart: () => void;
  onGameEnd: (wpm: number, accuracy: number) => void;
}

const textSamples = {
  story: [
    "In the mystical realm of keyboards, young warriors learn the ancient art of rapid text transcription. Every keystroke echoes through the digital void, building strength and precision.",
    "As darkness falls upon the mechanical switches, only those with lightning-fast fingers can hope to survive the grueling trials ahead. Each letter demands perfect timing and unwavering focus.",
    "The ancient scrolls speak of legendary typists who could weave words at impossible speeds, their fingers dancing across keys like virtuoso pianists performing symphonies of text."
  ],
  battle: [
    "In the heat of battle, every keystroke counts. Warriors clash with words, each error a weakness to exploit. Only the fastest and most accurate will claim victory.",
    "The arena trembles as typing gladiators face off in epic combat. Fingers fly across keyboards like lightning, each word a weapon in this digital colosseum.",
    "Champions rise and fall with each passing second. In this realm, speed is power, accuracy is armor, and victory belongs to the swift."
  ],
  challenge: [
    "Today's challenge demands the precision of a surgeon and the speed of light. Ancient runes and mystical incantations test even the most skilled practitioners.",
    "Beware the cursed texts that twist tongues and tangle fingers. Only true masters can navigate these treacherous linguistic labyrinths.",
    "The daily ritual begins with words of power, each character charged with magical energy that grows stronger with perfect execution."
  ],
  racing: [
    "Start your engines! The race begins with these words. Every correct keystroke moves your car forward on the track.",
    "Speed through the winding course of letters. Navigate the challenging turns of punctuation and acceleration zones of common words.",
    "Cross the finish line first by maintaining both speed and accuracy. The checkered flag awaits the typing champion!"
  ]
};

export default function TypingArea({ gameMode, isPlaying, onGameStart, onGameEnd }: TypingAreaProps) {
  const [text, setText] = useState('');
  const [typedText, setTypedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [errors, setErrors] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Set text based on game mode
    const samples = textSamples[gameMode];
    setText(samples[Math.floor(Math.random() * samples.length)]);
    resetGame();
  }, [gameMode]);

  const resetGame = () => {
    setTypedText('');
    setCurrentIndex(0);
    setStartTime(null);
    setErrors(0);
    setWpm(0);
    setAccuracy(100);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isPlaying) return;
    
    const value = (e.target as HTMLInputElement).value;
    const lastChar = value[value.length - 1];
    
    if (!startTime) {
      setStartTime(Date.now());
    }

    if (lastChar === text[currentIndex]) {
      setCurrentIndex(prev => prev + 1);
      setTypedText(value);
      
      // Calculate WPM and accuracy
      const timeElapsed = (Date.now() - (startTime || Date.now())) / 1000 / 60; // minutes
      const wordsTyped = value.split(' ').length;
      const currentWpm = Math.round(wordsTyped / timeElapsed) || 0;
      const currentAccuracy = ((currentIndex + 1 - errors) / (currentIndex + 1)) * 100;
      
      setWpm(currentWpm);
      setAccuracy(currentAccuracy);
      
      // Check if game is complete
      if (currentIndex + 1 >= text.length) {
        onGameEnd(currentWpm, currentAccuracy);
        setTypedText(text);
      }
    } else {
      setErrors(prev => prev + 1);
    }
  };

  const handleStart = () => {
    resetGame();
    onGameStart();
    inputRef.current?.focus();
  };

  const getCharacterClass = (index: number) => {
    if (index < currentIndex) {
      return text[index] === typedText[index] ? 'text-green-400' : 'text-red-400 bg-red-400/20';
    } else if (index === currentIndex && isPlaying) {
      return 'bg-blue-400 text-black animate-pulse';
    } else {
      return 'text-gray-400';
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700">
      {/* Game Status */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-green-400">⚡</span>
            <span className="text-sm text-gray-300">WPM:</span>
            <span className="font-bold text-lg">{wpm}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-400">🎯</span>
            <span className="text-sm text-gray-300">Accuracy:</span>
            <span className="font-bold text-lg">{accuracy.toFixed(1)}%</span>
          </div>
        </div>
        
        {!isPlaying && (
          <button
            onClick={handleStart}
            className="btn-primary"
          >
            🚀 Start Test
          </button>
        )}
      </div>

      {/* Text Display */}
      <div className="mb-6 p-6 bg-gray-900/50 rounded-xl border border-gray-600">
        <div className="text-lg leading-relaxed font-mono">
          {text.split('').map((char, index) => (
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
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={typedText}
          onChange={() => {}} // Controlled by onKeyDown
          onKeyDown={handleKeyPress}
          disabled={!isPlaying}
          placeholder={isPlaying ? "Start typing..." : "Click 'Start Test' to begin"}
          className="w-full p-4 bg-gray-700/50 border border-gray-600 rounded-xl text-lg font-mono 
                     focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                     disabled:opacity-50 disabled:cursor-not-allowed"
        />
        
        {isPlaying && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>Progress:</span>
              <span className="font-mono">
                {currentIndex}/{text.length}
              </span>
              <div className="w-20 bg-gray-600 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentIndex / text.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Racing Mode Specific */}
      {gameMode === 'racing' && (
        <div className="mt-6 p-4 bg-blue-900/20 rounded-xl border border-blue-500/30">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">🏁 Race Track</h3>
            <div className="text-sm text-gray-300">Position: 1st</div>
          </div>
          <div className="relative bg-gray-700 rounded-lg h-12 overflow-hidden">
            <div className="absolute top-0 left-0 h-full bg-green-500/20 transition-all duration-300"
                 style={{ width: `${(currentIndex / text.length) * 100}%` }}>
            </div>
            <div className="absolute top-1/2 transform -translate-y-1/2 transition-all duration-300"
                 style={{ left: `${(currentIndex / text.length) * 100}%` }}>
              🏎️
            </div>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              🏁
            </div>
          </div>
        </div>
      )}
    </div>
  );
}