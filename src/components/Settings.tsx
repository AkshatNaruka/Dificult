'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface SettingsProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function Settings({ isVisible, onClose }: SettingsProps) {
  const [theme, setTheme] = useState('dark');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoSwitchMode, setAutoSwitchMode] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [difficulty, setDifficulty] = useState('medium');
  const [testLength, setTestLength] = useState('60');
  const [fontFamily, setFontFamily] = useState('Inter');
  const [fontSize, setFontSize] = useState('16');

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-800 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">⚙️ Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Appearance */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">🎨 Appearance</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Theme
                </label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                >
                  <option value="dark">Dark Mode</option>
                  <option value="light">Light Mode</option>
                  <option value="cyberpunk">Cyberpunk</option>
                  <option value="forest">Forest</option>
                  <option value="ocean">Ocean</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Font Family
                </label>
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                >
                  <option value="Inter">Inter</option>
                  <option value="Orbitron">Orbitron</option>
                  <option value="JetBrains Mono">JetBrains Mono</option>
                  <option value="Fira Code">Fira Code</option>
                  <option value="Monaco">Monaco</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Font Size: {fontSize}px
                </label>
                <input
                  type="range"
                  min="12"
                  max="24"
                  value={fontSize}
                  onChange={(e) => setFontSize(e.target.value)}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-300">Show Virtual Keyboard</span>
                <button
                  onClick={() => setShowKeyboard(!showKeyboard)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    showKeyboard ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      showKeyboard ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Audio & Behavior */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">🔊 Audio & Behavior</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-300">Sound Effects</span>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    soundEnabled ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      soundEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-300">Auto-switch Mode</span>
                <button
                  onClick={() => setAutoSwitchMode(!autoSwitchMode)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    autoSwitchMode ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      autoSwitchMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Default Test Length
                </label>
                <select
                  value={testLength}
                  onChange={(e) => setTestLength(e.target.value)}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                >
                  <option value="15">15 seconds</option>
                  <option value="30">30 seconds</option>
                  <option value="60">60 seconds</option>
                  <option value="120">2 minutes</option>
                  <option value="300">5 minutes</option>
                  <option value="custom">Custom length</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Difficulty Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['easy', 'medium', 'hard'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level)}
                      className={`p-2 rounded-lg border font-medium transition-colors capitalize ${
                        difficulty === level
                          ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                          : 'border-gray-600 hover:border-gray-500 text-gray-300'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">⌨️ Keyboard Shortcuts</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Start/Restart Test</span>
                <span className="bg-gray-700 px-2 py-1 rounded">Space</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Switch Mode</span>
                <span className="bg-gray-700 px-2 py-1 rounded">Tab</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Open Settings</span>
                <span className="bg-gray-700 px-2 py-1 rounded">Ctrl + ,</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">View Stats</span>
                <span className="bg-gray-700 px-2 py-1 rounded">Ctrl + S</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Join Racing Room</span>
                <span className="bg-gray-700 px-2 py-1 rounded">Ctrl + R</span>
              </div>
            </div>
          </div>

          {/* Account & Data */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">👤 Account & Data</h3>
            
            <div className="space-y-4">
              <button className="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                📊 Export Statistics
              </button>
              
              <button className="w-full p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
                💾 Backup Settings
              </button>
              
              <button className="w-full p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors">
                👥 Connect Social Account
              </button>
              
              <button className="w-full p-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors">
                🗑️ Reset All Data
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              TypeWarrior v2.0 - Enhanced typing experience
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}