import { useEffect } from 'react';
import { useLeaderboardStore } from '@/store/leaderboardStore';
import { usePlayerStore } from '@/store/playerStore';

export default function Leaderboard() {
  const { 
    globalLeaderboard, 
    initializeLeaderboard, 
    getPlayerRank, 
    isLoading 
  } = useLeaderboardStore();
  
  const { player, getLeaderboardEntry } = usePlayerStore();
  
  useEffect(() => {
    initializeLeaderboard();
  }, [initializeLeaderboard]);
  
  const leaderboardData = globalLeaderboard.slice(0, 5); // Top 5 for display
  const playerEntry = getLeaderboardEntry();
  const playerRank = player ? getPlayerRank(player.id) : null;

  const getRankDisplay = (rank: number) => {
    switch (rank) {
      case 1: return { icon: '🥇', class: 'text-yellow-600' };
      case 2: return { icon: '🥈', class: 'text-gray-500' };
      case 3: return { icon: '🥉', class: 'text-amber-600' };
      default: return { icon: `#${rank}`, class: 'text-gray-600' };
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">🏅 Global Leaderboard</h3>
        <button className="btn-secondary text-sm py-2 px-4">
          View All
        </button>
      </div>
      
      <div className="space-y-3">
        {isLoading ? (
          <div className="text-center text-gray-600 py-6">Loading leaderboard...</div>
        ) : (
          leaderboardData.map((entry) => {
            const rankDisplay = getRankDisplay(entry.rank || 0);
            return (
              <div 
                key={entry.id}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
              >
                {/* Rank */}
                <div className={`text-lg font-bold min-w-[2rem] text-center ${rankDisplay.class}`}>
                  {rankDisplay.icon}
                </div>
                
                {/* Avatar */}
                <div className="text-2xl">{entry.avatar}</div>
                
                {/* Player Info */}
                <div className="flex-1">
                  <div className="font-semibold text-base text-gray-900">{entry.name}</div>
                  <div className="text-sm text-gray-600">
                    {entry.wpm} WPM • {entry.accuracy}% ACC • Lv.{entry.level}
                  </div>
                </div>
                
                {/* Stats */}
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">{entry.wpm}</div>
                  <div className="text-sm text-gray-500 font-medium">WPM</div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Current User Position */}
      {playerEntry && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="font-bold text-gray-900 mb-3">Your Position</div>
          <div className="flex items-center gap-4">
            <div className="text-xl font-bold text-gray-600">
              #{playerRank || '?'}
            </div>
            <div className="text-3xl">{playerEntry.avatar}</div>
            <div className="flex-1">
              <div className="font-semibold text-base text-gray-900">{playerEntry.name}</div>
              <div className="text-sm text-gray-600">
                {playerRank ? 'Keep climbing!' : 'Play more to get ranked!'}
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">{playerEntry.wpm}</div>
              <div className="text-sm text-gray-500 font-medium">WPM</div>
            </div>
          </div>
        </div>
      )}

      {/* Competition Info */}
      <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
        <div className="font-bold text-gray-900 mb-1">Weekly Competition</div>
        <div className="text-sm text-gray-600 mb-3">Ends in 3 days</div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-base font-medium text-gray-700">🏆 Prize Pool</span>
          <span className="text-lg font-bold text-orange-600">2500 XP</span>
        </div>
        <div>
          <button className="btn-primary w-full">
            Join Competition
          </button>
        </div>
      </div>
    </div>
  );
}