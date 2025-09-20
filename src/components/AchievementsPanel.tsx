import { Achievement } from './TypeWarriorGame';

interface AchievementsPanelProps {
  achievements: Achievement[];
}

export default function AchievementsPanel({ achievements }: AchievementsPanelProps) {
  const recentAchievements = achievements.slice(-3);
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">🏆 Achievements</h3>
        <span className="text-sm text-gray-600 font-semibold bg-gray-100 px-3 py-1 rounded-full">
          {unlockedCount}/{achievements.length}
        </span>
      </div>
      
      <div className="space-y-4">
        {recentAchievements.length > 0 ? (
          recentAchievements.map((achievement) => (
            <div 
              key={achievement.id}
              className={`
                p-4 rounded-lg border transition-all duration-300
                ${achievement.unlocked 
                  ? 'bg-yellow-50 border-yellow-200 text-yellow-800' 
                  : 'bg-gray-50 border-gray-200 text-gray-600'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{achievement.icon}</span>
                <div className="flex-1">
                  <div className="font-semibold text-base text-gray-900">{achievement.name}</div>
                  <div className="text-sm text-gray-600">{achievement.description}</div>
                </div>
                {achievement.unlocked && (
                  <span className="text-yellow-600 text-lg">✓</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-5xl mb-3">🎯</div>
            <div className="font-medium">Complete your first test to unlock achievements!</div>
          </div>
        )}
      </div>

      {/* Achievement Categories */}
      <div className="mt-8 space-y-4">
        <div className="text-base font-bold text-gray-900 mb-4">Categories</div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-gray-50 rounded-lg text-center border">
            <div className="text-sm text-gray-600 font-medium">Speed</div>
            <div className="text-lg font-bold text-gray-900">1/3</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg text-center border">
            <div className="text-sm text-gray-600 font-medium">Accuracy</div>
            <div className="text-lg font-bold text-gray-900">0/3</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg text-center border">
            <div className="text-sm text-gray-600 font-medium">Combo</div>
            <div className="text-lg font-bold text-gray-900">0/2</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg text-center border">
            <div className="text-sm text-gray-600 font-medium">Special</div>
            <div className="text-lg font-bold text-gray-900">0/4</div>
          </div>
        </div>
      </div>

      {/* Next Achievement */}
      <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
        <div className="font-bold text-gray-900 mb-2">Next Achievement</div>
        <div className="flex items-center gap-3">
          <span className="text-2xl">⚡</span>
          <div className="flex-1">
            <div className="font-semibold text-gray-900">Speed Demon</div>
            <div className="text-sm text-gray-600">Type 60+ WPM in a single test</div>
          </div>
        </div>
        <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
          <div className="bg-purple-500 h-2 rounded-full" style={{ width: '45%' }}></div>
        </div>
        <div className="text-sm text-gray-600 mt-2 font-medium">Progress: 45/60 WPM</div>
      </div>
    </div>
  );
}