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
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">📅 Daily Challenge</h3>
        <div className="text-sm text-gray-600 font-medium bg-gray-100 px-3 py-1 rounded-full">
          {new Date().toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            weekday: 'short'
          })}
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Challenge Info */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border">
          <div className="text-4xl">{getModeIcon(todayChallenge.mode)}</div>
          <div className="flex-1">
            <div className="font-bold text-lg capitalize text-gray-900">
              {todayChallenge.mode} Challenge
            </div>
            <div className="text-sm text-gray-600">
              {getModeDescription(todayChallenge.mode)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
              +{todayChallenge.reward} XP
            </div>
            <div className="text-xs text-gray-500 mt-1 font-medium">Reward</div>
          </div>
        </div>
        
        {/* Target */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-700 font-medium">Target:</span>
            <span className="text-lg font-bold text-blue-700">
              {getTargetText(todayChallenge.mode, todayChallenge.target)}
            </span>
          </div>
          
          {todayChallenge.bestScore && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 font-medium">Your Best:</span>
              <span className="text-lg font-bold text-green-600">
                {getTargetText(todayChallenge.mode, todayChallenge.bestScore)}
              </span>
            </div>
          )}
        </div>
        
        {/* Challenge Text Preview */}
        <div className="bg-gray-50 rounded-lg p-4 border">
          <div className="text-sm text-gray-600 mb-2 font-medium">Challenge Text:</div>
          <div className="text-base text-gray-900 line-clamp-3 font-mono">
            {todayChallenge.text}
          </div>
        </div>
        
        {/* Action Button */}
        <div>
          {todayChallenge.completed ? (
            <div className="flex items-center justify-center gap-2 py-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              <span className="text-xl">✓</span>
              <span className="font-medium">Challenge Completed!</span>
            </div>
          ) : (
            <button 
              onClick={handleStartChallenge}
              className="btn-primary w-full"
            >
              Start Challenge
            </button>
          )}
        </div>
        
        {/* Stats */}
        {player && (
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span className="font-medium">Daily Challenges Completed</span>
              <span className="font-bold text-gray-900">{player.stats.dailyChallengesCompleted}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}