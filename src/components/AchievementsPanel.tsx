import { Achievement } from './TypeWarriorGame';

interface AchievementsPanelProps {
  achievements: Achievement[];
}

export default function AchievementsPanel({ achievements }: AchievementsPanelProps) {
  const recentAchievements = achievements.slice(-3);
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">🏆 Achievements</h3>
        <span className="text-sm text-gray-400">
          {unlockedCount}/{achievements.length}
        </span>
      </div>
      
      <div className="space-y-3">
        {recentAchievements.length > 0 ? (
          recentAchievements.map((achievement) => (
            <div 
              key={achievement.id}
              className={`
                p-3 rounded-lg border transition-all duration-300
                ${achievement.unlocked 
                  ? 'bg-yellow-900/20 border-yellow-500/30 text-yellow-200' 
                  : 'bg-gray-700/30 border-gray-600 text-gray-400'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{achievement.icon}</span>
                <div className="flex-1">
                  <div className="font-semibold text-sm">{achievement.name}</div>
                  <div className="text-xs opacity-80">{achievement.description}</div>
                </div>
                {achievement.unlocked && (
                  <span className="text-yellow-400 text-sm">✓</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-400">
            <div className="text-4xl mb-2">🎯</div>
            <div className="text-sm">Complete your first test to unlock achievements!</div>
          </div>
        )}
      </div>

      {/* Achievement Categories */}
      <div className="mt-6 space-y-2">
        <div className="text-sm font-semibold text-gray-300 mb-3">Categories</div>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-gray-700/30 rounded-lg text-center">
            <div className="text-xs text-gray-400">Speed</div>
            <div className="text-sm font-semibold">1/3</div>
          </div>
          <div className="p-2 bg-gray-700/30 rounded-lg text-center">
            <div className="text-xs text-gray-400">Accuracy</div>
            <div className="text-sm font-semibold">0/3</div>
          </div>
          <div className="p-2 bg-gray-700/30 rounded-lg text-center">
            <div className="text-xs text-gray-400">Combo</div>
            <div className="text-sm font-semibold">0/2</div>
          </div>
          <div className="p-2 bg-gray-700/30 rounded-lg text-center">
            <div className="text-xs text-gray-400">Special</div>
            <div className="text-sm font-semibold">0/4</div>
          </div>
        </div>
      </div>

      {/* Next Achievement */}
      <div className="mt-4 p-3 bg-purple-900/20 rounded-lg border border-purple-500/30">
        <div className="text-sm font-semibold text-purple-300 mb-1">Next Achievement</div>
        <div className="flex items-center gap-2">
          <span className="text-lg">⚡</span>
          <div className="flex-1">
            <div className="text-sm font-medium">Speed Demon</div>
            <div className="text-xs text-gray-400">Type 60+ WPM in a single test</div>
          </div>
        </div>
        <div className="mt-2 w-full bg-gray-600 rounded-full h-1">
          <div className="bg-purple-500 h-1 rounded-full" style={{ width: '45%' }}></div>
        </div>
        <div className="text-xs text-gray-400 mt-1">Progress: 45/60 WPM</div>
      </div>
    </div>
  );
}