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
  challenge: [
    "Today's challenge demands the precision of a surgeon and the speed of light. Ancient runes and mystical incantations test even the most skilled practitioners.",
    "Beware the cursed texts that twist tongues and tangle fingers. Only true masters can navigate these treacherous linguistic labyrinths.",
    "The daily ritual begins with words of power, each character charged with magical energy that grows stronger with perfect execution."
  ],
  racing: [
    "Start your engines! The race begins with these words. Every correct keystroke moves your car forward on the track.",
    "Speed through the winding course of letters. Navigate the challenging turns of punctuation and acceleration zones of common words.",
    "Cross the finish line first by maintaining both speed and accuracy. The checkered flag awaits the typing champion!"
  ],
  vowels: [
    "aeiou aeiou aeiou beautiful outstanding education awesome incredible mysterious adventurous courageous ambitious creative",
    "outstanding beautiful education curious mysterious adventurous courageous ambitious creative outstanding education",
    "awesome incredible outstanding beautiful curious mysterious adventurous courageous ambitious creative education"
  ],
  numbers: [
    "1234567890 1234567890 password123 user456 phone555-1234 code9876 year2024 date01-15-2024",
    "The year 2024 has been amazing with 365 days of progress and 52 weeks of learning new skills every day.",
    "Phone numbers like 555-1234 and codes like 9876 are common in everyday typing scenarios and data entry."
  ],
  mixed: [
    "Username: john_doe123 Password: Secure@2024! Email: user@domain.com Phone: (555) 123-4567",
    "Price: $29.99 Discount: 15% Code: SAVE2024 Expires: 12/31/2024 Contact: support@company.com",
    "Order #12345: 3 items @ $15.99 each = $47.97 + tax $3.84 = Total: $51.81 (Card ending 5678)"
  ],
  symbols: [
    "function(){} array[0] object.method() string = 'value' number += 10; boolean == true",
    "if (x > 0 && y < 10) { return x * y; } else { throw new Error('Invalid input'); }",
    "const obj = { key: 'value', num: 42, arr: [1, 2, 3] }; console.log(obj?.key ?? 'default');"
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
      return text[index] === typedText[index] ? 'text-green-600' : 'text-red-600 bg-red-100';
    } else if (index === currentIndex && isPlaying) {
      return 'bg-orange-500 text-white animate-pulse';
    } else {
      return 'text-gray-400';
    }
  };

  return (
    <div className="card">
      {/* Game Status */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-lg border">
            <span className="text-xl">⚡</span>
            <span className="text-sm text-gray-600 font-medium">WPM:</span>
            <span className="font-bold text-xl text-gray-900">{wpm}</span>
          </div>
          <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-lg border">
            <span className="text-xl">🎯</span>
            <span className="text-sm text-gray-600 font-medium">Accuracy:</span>
            <span className="font-bold text-xl text-gray-900">{accuracy.toFixed(1)}%</span>
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
      <div className="mb-8 p-8 bg-gray-50 rounded-xl border border-gray-200">
        <div className="text-xl leading-relaxed font-mono text-gray-900">
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
          className="w-full p-6 bg-white border-2 border-gray-200 rounded-xl text-lg font-mono text-gray-900
                     focus:outline-none focus:border-gray-900 focus:ring-4 focus:ring-gray-100
                     disabled:opacity-50 disabled:cursor-not-allowed placeholder-gray-400"
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
        <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg text-gray-900">🏁 Race Track</h3>
            <div className="text-sm text-gray-600 font-medium">Position: 1st</div>
          </div>
          <div className="relative bg-gray-200 rounded-lg h-12 overflow-hidden">
            <div className="absolute top-0 left-0 h-full bg-green-400/40 transition-all duration-300"
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