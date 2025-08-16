import { GameStats } from './TypeWarriorGame';

interface HeaderProps {
  stats: GameStats;
}

export default function Header({ stats }: HeaderProps) {
  return (
    <header className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700 card-glow">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-2xl">⚡</span>
          </div>
          <div>
            <h1 className="text-3xl font-orbitron font-bold gradient-text">
              TypeWarrior
            </h1>
            <p className="text-gray-400 text-sm">Battle Your Way to Typing Mastery</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2 bg-gray-700/50 rounded-lg px-4 py-2">
            <span className="text-yellow-400">👑</span>
            <span className="text-sm text-gray-300">Level</span>
            <span className="font-bold">{stats.level}</span>
          </div>
          
          <div className="flex items-center gap-2 bg-gray-700/50 rounded-lg px-4 py-2">
            <span className="text-blue-400">⭐</span>
            <span className="text-sm text-gray-300">XP</span>
            <span className="font-bold">{stats.xp.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center gap-2 bg-gray-700/50 rounded-lg px-4 py-2">
            <span className="text-orange-400">🔥</span>
            <span className="text-sm text-gray-300">Streak</span>
            <span className="font-bold">{stats.streak}</span>
          </div>

          <div className="flex items-center gap-2 bg-gray-700/50 rounded-lg px-4 py-2">
            <span className="text-green-400">⚡</span>
            <span className="text-sm text-gray-300">WPM</span>
            <span className="font-bold">{stats.wpm}</span>
          </div>

          <div className="flex items-center gap-2 bg-gray-700/50 rounded-lg px-4 py-2">
            <span className="text-purple-400">🎯</span>
            <span className="text-sm text-gray-300">Accuracy</span>
            <span className="font-bold">{stats.accuracy.toFixed(1)}%</span>
          </div>
        </div>

        {/* Settings */}
        <div className="flex items-center gap-3">
          <button className="p-3 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors">
            <span className="text-xl">🎨</span>
          </button>
          <button className="p-3 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors">
            <span className="text-xl">🔊</span>
          </button>
          <button className="p-3 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors">
            <span className="text-xl">⚙️</span>
          </button>
        </div>
      </div>
    </header>
  );
}