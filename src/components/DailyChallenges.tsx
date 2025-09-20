import { useEffect, useState } from 'react';
import { usePlayerStore } from '@/store/playerStore';

export default function DailyChallenges() {
  const { player, getTodayChallenge, generateTodayChallenge, completeDailyChallenge } = usePlayerStore();
  const [todayChallenge, setTodayChallenge] = useState(getTodayChallenge());
  
  useEffect(() => {
    generateTodayChallenge();
    setTodayChallenge(getTodayChallenge());
  }, [generateTodayChallenge, getTodayChallenge]);
  
  if (!todayChallenge) return null;
  
  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'speed': return '⚡';
      case 'accuracy': return '🎯';
      case 'vowels': return '🅰️';
      case 'numbers': return '🔢';
      default: return '📝';
    }
  };
  
  const getModeDescription = (mode: string) => {
    switch (mode) {
      case 'speed': return 'Focus on typing speed';
      case 'accuracy': return 'Focus on accuracy';
      case 'vowels': return 'Only vowels and common words';
      case 'numbers': return 'Numbers and mixed text';
      default: return 'Standard typing';
    }
  };
  
  const getTargetText = (mode: string, target: number) => {
    switch (mode) {
      case 'speed': return `${target} WPM`;
      case 'accuracy': return `${target}% accuracy`;
      case 'vowels': return `${target} WPM`;
      case 'numbers': return `${target} WPM`;
      default: return `${target} WPM`;
    }
  };
  
  const handleStartChallenge = () => {
    // This would typically trigger the typing area to load the challenge text
    // For now, we'll simulate completion for demo purposes
    const simulatedScore = Math.floor(Math.random() * (todayChallenge.target * 1.2)) + 20;
    
    if (simulatedScore >= todayChallenge.target) {
      completeDailyChallenge(simulatedScore);
      setTodayChallenge(getTodayChallenge());
    }
  };
  
  return (
    <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">📅 Daily Challenge</h3>
        <div className="text-xs text-gray-400">
          {new Date().toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            weekday: 'short'
          })}
        </div>
      </div>
      
      <div className="space-y-4">
        {/* Challenge Info */}
        <div className="flex items-center gap-3">
          <div className="text-3xl">{getModeIcon(todayChallenge.mode)}</div>
          <div className="flex-1">
            <div className="font-semibold text-sm capitalize">
              {todayChallenge.mode} Challenge
            </div>
            <div className="text-xs text-gray-400">
              {getModeDescription(todayChallenge.mode)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-yellow-400">
              +{todayChallenge.reward} XP
            </div>
            <div className="text-xs text-gray-400">Reward</div>
          </div>
        </div>
        
        {/* Target */}
        <div className="bg-gray-700/30 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-300">Target:</span>
            <span className="text-sm font-bold text-blue-400">
              {getTargetText(todayChallenge.mode, todayChallenge.target)}
            </span>
          </div>
          
          {todayChallenge.bestScore && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Your Best:</span>
              <span className="text-sm font-bold text-green-400">
                {getTargetText(todayChallenge.mode, todayChallenge.bestScore)}
              </span>
            </div>
          )}
        </div>
        
        {/* Challenge Text Preview */}
        <div className="bg-gray-700/30 rounded-lg p-3">
          <div className="text-xs text-gray-400 mb-2">Challenge Text:</div>
          <div className="text-sm text-gray-200 line-clamp-3">
            {todayChallenge.text}
          </div>
        </div>
        
        {/* Action Button */}
        <div>
          {todayChallenge.completed ? (
            <div className="flex items-center justify-center gap-2 py-3 bg-green-900/20 border border-green-500/30 rounded-lg text-green-400">
              <span className="text-lg">✓</span>
              <span className="text-sm font-medium">Challenge Completed!</span>
            </div>
          ) : (
            <button 
              onClick={handleStartChallenge}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
            >
              Start Challenge
            </button>
          )}
        </div>
        
        {/* Stats */}
        {player && (
          <div className="pt-2 border-t border-gray-600">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Daily Challenges Completed</span>
              <span className="font-bold">{player.stats.dailyChallengesCompleted}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}