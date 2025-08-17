import { GameStats } from './TypeWarriorGame';

interface StatsPanelProps {
  stats: GameStats;
}

export default function StatsPanel({ stats }: StatsPanelProps) {
  const statItems = [
    { label: 'Words Per Minute', value: stats.wpm, icon: '⚡', color: 'text-yellow-400' },
    { label: 'Accuracy', value: `${stats.accuracy.toFixed(1)}%`, icon: '🎯', color: 'text-green-400' },
    { label: 'Current Streak', value: stats.streak, icon: '🔥', color: 'text-orange-400' },
    { label: 'Combo Multiplier', value: `${stats.combo}x`, icon: '💫', color: 'text-purple-400' },
  ];

  return (
    <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
      <h3 className="text-lg font-semibold mb-4 text-center">📊 Performance Stats</h3>
      
      <div className="space-y-4">
        {statItems.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
            <div className="flex items-center gap-3">
              <span className={`text-2xl ${item.color}`}>{item.icon}</span>
              <span className="text-sm text-gray-300">{item.label}</span>
            </div>
            <span className="font-bold text-lg">{item.value}</span>
          </div>
        ))}
      </div>

      {/* Level Progress */}
      <div className="mt-6 p-4 bg-blue-900/20 rounded-xl border border-blue-500/30">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-300">Level Progress</span>
          <span className="text-sm font-semibold">Level {stats.level}</span>
        </div>
        <div className="w-full bg-gray-600 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${(stats.xp % 1000) / 10}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>{stats.xp} XP</span>
          <span>{stats.level * 1000} XP</span>
        </div>
      </div>

      {/* Daily Goal */}
      <div className="mt-4 p-4 bg-green-900/20 rounded-xl border border-green-500/30">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-300">Daily Goal</span>
          <span className="text-sm font-semibold">3/5 tests</span>
        </div>
        <div className="w-full bg-gray-600 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-500"
            style={{ width: '60%' }}
          ></div>
        </div>
        <p className="text-xs text-gray-400 mt-1">Complete 2 more tests to earn bonus XP!</p>
      </div>
    </div>
  );
}