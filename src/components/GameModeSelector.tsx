import { GameMode } from './TypeWarriorGame';

interface GameModeSelectorProps {
  currentMode: GameMode;
  onModeChange: (mode: GameMode) => void;
  isPlaying: boolean;
}

export default function GameModeSelector({ currentMode, onModeChange, isPlaying }: GameModeSelectorProps) {
  const modes = [
    { id: 'story' as GameMode, name: 'Story Mode', icon: '📖', description: 'Progress through typing adventures' },
    { id: 'battle' as GameMode, name: 'Battle Royale', icon: '⚔️', description: 'Compete against other players' },
    { id: 'challenge' as GameMode, name: 'Daily Challenge', icon: '📅', description: 'Special daily typing challenges' },
    { id: 'racing' as GameMode, name: 'Type Racing', icon: '🏎️', description: 'Race cars with your typing speed' },
  ];

  return (
    <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-center">Choose Your Battle</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => !isPlaying && onModeChange(mode.id)}
            disabled={isPlaying}
            className={`
              p-4 rounded-xl border-2 transition-all duration-300 text-left
              ${currentMode === mode.id 
                ? 'border-blue-500 bg-blue-500/20 text-blue-300' 
                : 'border-gray-600 hover:border-gray-500 bg-gray-700/30'
              }
              ${isPlaying ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 cursor-pointer'}
            `}
          >
            <div className="text-3xl mb-2">{mode.icon}</div>
            <div className="font-semibold mb-1">{mode.name}</div>
            <div className="text-sm text-gray-400">{mode.description}</div>
            
            {currentMode === mode.id && (
              <div className="mt-2 text-xs text-blue-300 font-medium">
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
        
        {currentMode === 'battle' && (
          <div>
            <h3 className="font-semibold text-lg mb-2">⚔️ Battle Royale</h3>
            <p className="text-gray-300 text-sm mb-3">
              Join real-time battles with up to 10 players. Last typer standing wins!
            </p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span className="text-sm text-green-400">47 players online</span>
            </div>
          </div>
        )}
        
        {currentMode === 'challenge' && (
          <div>
            <h3 className="font-semibold text-lg mb-2">📅 Daily Challenge</h3>
            <p className="text-gray-300 text-sm mb-3">
              Today&apos;s challenge: &quot;Wizard&apos;s Vocabulary&quot; - Special magical words and phrases.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-yellow-400">💎 Reward: 500 XP + Rare Theme</span>
            </div>
          </div>
        )}
        
        {currentMode === 'racing' && (
          <div>
            <h3 className="font-semibold text-lg mb-2">🏎️ Type Racing</h3>
            <p className="text-gray-300 text-sm mb-3">
              Race against other players! Your car moves forward with each correct word.
            </p>
            <div className="flex items-center gap-4">
              <button className="btn-primary text-sm py-2 px-4">
                🚗 Join Race
              </button>
              <button className="btn-secondary text-sm py-2 px-4">
                🏁 Create Room
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}