// Utility functions for the TypeWarrior app

/**
 * Generate a unique room code
 */
export function generateRoomCode(): string {
  const adjectives = [
    'Swift', 'Quick', 'Fast', 'Rapid', 'Speedy', 'Lightning', 'Blazing', 'Turbo',
    'Ninja', 'Cyber', 'Digital', 'Quantum', 'Stellar', 'Cosmic', 'Phoenix', 'Thunder'
  ];
  
  const nouns = [
    'Typer', 'Fingers', 'Keys', 'Words', 'Text', 'Code', 'Script', 'Data',
    'Warrior', 'Master', 'Wizard', 'Hero', 'Champion', 'Elite', 'Pro', 'Ace'
  ];
  
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `${adjective}${noun}${number}`;
}

/**
 * Generate a shorter room code (6 characters)
 */
export function generateShortRoomCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Validate room code format
 */
export function isValidRoomCode(code: string): boolean {
  // Allow both formats: descriptive (SwiftTyper123) or short (ABC123)
  if (code.length === 6) {
    return /^[A-Z0-9]{6}$/.test(code);
  }
  return code.length >= 8 && code.length <= 20 && /^[A-Za-z0-9]+$/.test(code);
}

/**
 * Format WPM for display
 */
export function formatWPM(wpm: number): string {
  return Math.round(wpm).toString();
}

/**
 * Format accuracy percentage
 */
export function formatAccuracy(accuracy: number): string {
  return `${accuracy.toFixed(1)}%`;
}

/**
 * Get difficulty color class
 */
export function getDifficultyColor(difficulty: string): string {
  switch (difficulty.toLowerCase()) {
    case 'easy': return 'text-green-400';
    case 'medium': return 'text-yellow-400';
    case 'hard': return 'text-red-400';
    default: return 'text-gray-400';
  }
}

/**
 * Get status color class
 */
export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'waiting': return 'text-green-400';
    case 'in progress': return 'text-yellow-400';
    case 'finished': return 'text-gray-400';
    default: return 'text-gray-400';
  }
}

/**
 * Calculate typing speed in WPM
 */
export function calculateWPM(charactersTyped: number, timeInSeconds: number): number {
  if (timeInSeconds === 0) return 0;
  const wordsTyped = charactersTyped / 5; // Standard: 5 characters = 1 word
  const timeInMinutes = timeInSeconds / 60;
  return wordsTyped / timeInMinutes;
}

/**
 * Calculate accuracy percentage
 */
export function calculateAccuracy(correctChars: number, totalChars: number): number {
  if (totalChars === 0) return 100;
  return (correctChars / totalChars) * 100;
}