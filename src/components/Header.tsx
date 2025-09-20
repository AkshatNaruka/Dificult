import { GameStats } from './TypeWarriorGame';

interface HeaderProps {
  stats: GameStats;
  onOpenSettings: () => void;
}

export default function Header({ stats, onOpenSettings }: HeaderProps) {
  return (
    <header className="card mb-8 bg-white border-gray-200 shadow-sm">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gray-900 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-2xl text-white">⚡</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              TypeWarrior
            </h1>
            <p className="text-gray-600 text-sm">Battle Your Way to Typing Mastery</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
            <span className="text-xl">👑</span>
            <span className="text-sm text-gray-600 font-medium">Level</span>
            <span className="font-bold text-gray-900">{stats.level}</span>
          </div>
          
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
            <span className="text-xl">⭐</span>
            <span className="text-sm text-gray-600 font-medium">XP</span>
            <span className="font-bold text-gray-900">{stats.xp.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
            <span className="text-xl">🔥</span>
            <span className="text-sm text-gray-600 font-medium">Streak</span>
            <span className="font-bold text-gray-900">{stats.streak}</span>
          </div>

          <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
            <span className="text-xl">⚡</span>
            <span className="text-sm text-gray-600 font-medium">WPM</span>
            <span className="font-bold text-gray-900">{stats.wpm}</span>
          </div>

          <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
            <span className="text-xl">🎯</span>
            <span className="text-sm text-gray-600 font-medium">Accuracy</span>
            <span className="font-bold text-gray-900">{stats.accuracy.toFixed(1)}%</span>
          </div>
        </div>

        {/* Settings */}
        <div className="flex items-center gap-3">
          <button className="p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-300 border border-gray-200 hover:shadow-sm">
            <span className="text-xl">🎨</span>
          </button>
          <button className="p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-300 border border-gray-200 hover:shadow-sm">
            <span className="text-xl">🔊</span>
          </button>
          <button 
            onClick={onOpenSettings}
            className="p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-300 border border-gray-200 hover:shadow-sm"
          >
            <span className="text-xl">⚙️</span>
          </button>
        </div>
      </div>
    </header>
  );
}