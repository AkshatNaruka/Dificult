import { GameMode } from './TypeWarriorGame';

interface GameModeSelectorProps {
  currentMode: GameMode;
  onModeChange: (mode: GameMode) => void;
  isPlaying: boolean;
}

export default function GameModeSelector({ currentMode, onModeChange, isPlaying }: GameModeSelectorProps) {
  const modes = [
    { id: 'story' as GameMode, name: 'Story Mode', icon: '📖', description: 'Progress through typing adventures' },
    { id: 'challenge' as GameMode, name: 'Daily Challenge', icon: '📅', description: 'Special daily typing challenges' },
    { id: 'racing' as GameMode, name: 'Type Racing', icon: '🏎️', description: 'Race cars with your typing speed' },
    { id: 'vowels' as GameMode, name: 'Vowels Only', icon: '🅰️', description: 'Focus on vowels and common words' },
    { id: 'numbers' as GameMode, name: 'Numbers Mix', icon: '🔢', description: 'Numbers and alphanumeric text' },
    { id: 'mixed' as GameMode, name: 'Mixed Mode', icon: '🎯', description: 'Letters, numbers, and symbols' },
    { id: 'symbols' as GameMode, name: 'Symbol Master', icon: '⚡', description: 'Special characters and coding symbols' },
  ];

  return (
    <div className="card mb-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">Choose Your Battle</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => !isPlaying && onModeChange(mode.id)}
            disabled={isPlaying}
            className={`
              p-5 rounded-xl border-2 transition-all duration-300 text-left min-h-[140px]
              ${currentMode === mode.id 
                ? 'border-gray-900 bg-gray-50 text-gray-900 shadow-md' 
                : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
              }
              ${isPlaying ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg hover:transform hover:scale-105 cursor-pointer'}
            `}
          >
            <div className="text-4xl mb-3">{mode.icon}</div>
            <div className="font-semibold mb-2 text-lg text-gray-900">{mode.name}</div>
            <div className="text-sm text-gray-600 leading-relaxed">{mode.description}</div>
            
            {currentMode === mode.id && (
              <div className="mt-3 text-xs text-gray-900 font-bold bg-gray-200 px-2 py-1 rounded-full inline-block">
                ✓ SELECTED
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Mode-specific info */}
      <div className="mt-6 p-4 bg-gray-700/30 rounded-xl">
        {currentMode === 'story' && (
          <div>
            <h3 className="font-semibold text-lg mb-2">📖 Story Mode: Chapter 1</h3>
            <p className="text-gray-300 text-sm mb-3">
              Begin your journey as a typing apprentice. Master the basics and unlock new chapters.
            </p>
            <div className="w-full bg-gray-600 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '25%' }}></div>
            </div>
            <p className="text-xs text-gray-400 mt-1">Progress: 25% - The Typing Apprentice</p>
          </div>
        )}
        
        {currentMode === 'challenge' && (
          <div>
            <h3 className="font-semibold text-lg mb-2">📅 Daily Challenge</h3>
            <p className="text-gray-300 text-sm mb-3">
              Complete today&apos;s special challenge for bonus XP and achievements!
            </p>
            <div className="flex items-center gap-4">
              <span className="text-yellow-400">💎 Reward: Bonus XP + Streak Boost</span>
            </div>
          </div>
        )}
        
        {currentMode === 'racing' && (
          <div>
            <h3 className="font-semibold text-lg mb-2">🏎️ Type Racing</h3>
            <p className="text-gray-300 text-sm mb-3">
              Race against the clock! Speed through challenging texts and beat your personal records.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-green-400">🏆 Best Time: Personal Records</span>
            </div>
          </div>
        )}
        
        {currentMode === 'vowels' && (
          <div>
            <h3 className="font-semibold text-lg mb-2">🅰️ Vowels Only</h3>
            <p className="text-gray-300 text-sm mb-3">
              Focus on vowel-heavy words and improve your vowel key accuracy. Great for building finger strength!
            </p>
            <div className="text-sm text-blue-400">
              Targets: A, E, I, O, U and common vowel combinations
            </div>
          </div>
        )}
        
        {currentMode === 'numbers' && (
          <div>
            <h3 className="font-semibold text-lg mb-2">🔢 Numbers Mix</h3>
            <p className="text-gray-300 text-sm mb-3">
              Practice typing numbers, dates, and alphanumeric combinations. Essential for data entry!
            </p>
            <div className="text-sm text-blue-400">
              Includes: 0-9, dates, phone numbers, and mixed text
            </div>
          </div>
        )}
        
        {currentMode === 'mixed' && (
          <div>
            <h3 className="font-semibold text-lg mb-2">🎯 Mixed Mode</h3>
            <p className="text-gray-300 text-sm mb-3">
              The ultimate challenge! Letters, numbers, and basic symbols in realistic text scenarios.
            </p>
            <div className="text-sm text-orange-400">
              Advanced difficulty - recommended for experienced typists
            </div>
          </div>
        )}
        
        {currentMode === 'symbols' && (
          <div>
            <h3 className="font-semibold text-lg mb-2">⚡ Symbol Master</h3>
            <p className="text-gray-300 text-sm mb-3">
              Master programming symbols and special characters. Perfect for developers and coders!
            </p>
            <div className="text-sm text-purple-400">
              Includes: {}, [], (), &lt;&gt;, @#$%^&*, and more
            </div>
          </div>
        )}
      </div>
    </div>
  );
}