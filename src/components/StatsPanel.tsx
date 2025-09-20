import { GameStats } from './TypeWarriorGame';

interface StatsPanelProps {
  stats: GameStats;
}

export default function StatsPanel({ stats }: StatsPanelProps) {
  const statItems = [
    { label: 'Words Per Minute', value: stats.wpm, icon: '⚡', color: 'text-orange-500' },
    { label: 'Accuracy', value: `${stats.accuracy.toFixed(1)}%`, icon: '🎯', color: 'text-green-600' },
    { label: 'Current Streak', value: stats.streak, icon: '🔥', color: 'text-red-500' },
    { label: 'Combo Multiplier', value: `${stats.combo}x`, icon: '💫', color: 'text-purple-600' },
  ];

  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-6 text-gray-900 text-center">📊 Performance Stats</h3>
      
      <div className="space-y-4">
        {statItems.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center gap-3">
              <span className={`text-2xl ${item.color}`}>{item.icon}</span>
              <span className="text-sm text-gray-700 font-medium">{item.label}</span>
            </div>
            <span className="font-bold text-xl text-gray-900">{item.value}</span>
          </div>
        ))}
      </div>

      {/* Level Progress */}
      <div className="mt-8 p-5 bg-blue-50 rounded-xl border border-blue-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-700 font-medium">Level Progress</span>
          <span className="text-sm font-bold text-gray-900">Level {stats.level}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div 
            className="bg-gradient-to-r from-gray-800 to-gray-600 h-4 rounded-full transition-all duration-500"
            style={{ width: `${(stats.xp % 1000) / 10}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-600 mt-2 font-medium">
          <span>{stats.xp} XP</span>
          <span>{stats.level * 1000} XP</span>
        </div>
      </div>

      {/* Daily Goal */}
      <div className="mt-6 p-5 bg-green-50 rounded-xl border border-green-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-700 font-medium">Daily Goal</span>
          <span className="text-sm font-bold text-gray-900">3/5 tests</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-green-500 h-3 rounded-full transition-all duration-500"
            style={{ width: '60%' }}
          ></div>
        </div>
        <p className="text-xs text-gray-600 mt-2 font-medium">Complete 2 more tests to earn bonus XP!</p>
      </div>
    </div>
  );
}