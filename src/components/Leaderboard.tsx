export default function Leaderboard() {
  const leaderboardData = [
    { rank: 1, name: 'TypeMaster', wpm: 156, accuracy: 98.5, avatar: '👑' },
    { rank: 2, name: 'SpeedDemon', wpm: 142, accuracy: 97.2, avatar: '⚡' },
    { rank: 3, name: 'KeyboardNinja', wpm: 138, accuracy: 99.1, avatar: '🥷' },
    { rank: 4, name: 'FingerFlash', wpm: 134, accuracy: 96.8, avatar: '💨' },
    { rank: 5, name: 'TextTornado', wpm: 129, accuracy: 98.3, avatar: '🌪️' },
  ];

  const getRankDisplay = (rank: number) => {
    switch (rank) {
      case 1: return { icon: '🥇', class: 'text-yellow-400' };
      case 2: return { icon: '🥈', class: 'text-gray-300' };
      case 3: return { icon: '🥉', class: 'text-amber-600' };
      default: return { icon: `#${rank}`, class: 'text-gray-400' };
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">🏅 Global Leaderboard</h3>
        <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
          View All
        </button>
      </div>
      
      <div className="space-y-3">
        {leaderboardData.map((player) => {
          const rankDisplay = getRankDisplay(player.rank);
          return (
            <div 
              key={player.rank}
              className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors"
            >
              {/* Rank */}
              <div className={`text-lg font-bold min-w-[2rem] text-center ${rankDisplay.class}`}>
                {rankDisplay.icon}
              </div>
              
              {/* Avatar */}
              <div className="text-2xl">{player.avatar}</div>
              
              {/* Player Info */}
              <div className="flex-1">
                <div className="font-semibold text-sm">{player.name}</div>
                <div className="text-xs text-gray-400">
                  {player.wpm} WPM • {player.accuracy}% ACC
                </div>
              </div>
              
              {/* Stats */}
              <div className="text-right">
                <div className="text-sm font-bold text-green-400">{player.wpm}</div>
                <div className="text-xs text-gray-400">WPM</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Current User Position */}
      <div className="mt-4 p-3 bg-blue-900/20 rounded-lg border border-blue-500/30">
        <div className="text-sm font-semibold text-blue-300 mb-2">Your Position</div>
        <div className="flex items-center gap-3">
          <div className="text-lg font-bold text-gray-400">#47</div>
          <div className="text-2xl">🎯</div>
          <div className="flex-1">
            <div className="font-semibold text-sm">You</div>
            <div className="text-xs text-gray-400">Keep practicing to climb!</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-blue-400">85</div>
            <div className="text-xs text-gray-400">WPM</div>
          </div>
        </div>
      </div>

      {/* Competition Info */}
      <div className="mt-4 p-3 bg-purple-900/20 rounded-lg border border-purple-500/30">
        <div className="text-sm font-semibold text-purple-300 mb-1">Weekly Competition</div>
        <div className="text-xs text-gray-400 mb-2">Ends in 3 days</div>
        <div className="flex items-center justify-between">
          <span className="text-sm">🏆 Prize Pool</span>
          <span className="text-sm font-bold text-yellow-400">2500 XP</span>
        </div>
        <div className="mt-2">
          <button className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors">
            Join Competition
          </button>
        </div>
      </div>
    </div>
  );
}