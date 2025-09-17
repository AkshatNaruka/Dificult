'use client';

import { motion } from 'framer-motion';
import { useThemeStore } from '@/store/themeStore';

interface SettingsProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function Settings({ isVisible, onClose }: SettingsProps) {
  const {
    currentTheme,
    fontSize,
    fontFamily,
    smoothCaret,
    showKeyboard,
    availableThemes,
    setTheme,
    setFontSize,
    setFontFamily,
    setSmoothCaret,
    setShowKeyboard,
  } = useThemeStore();

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-800 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>⚙️ Settings</h2>
          <button
            onClick={onClose}
            className="text-2xl hover:opacity-70 transition-opacity"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Appearance */}
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text)' }}>🎨 Appearance</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                  Theme
                </label>
                <select
                  value={currentTheme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full p-3 rounded-lg border transition-colors focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: 'var(--color-background-secondary)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                >
                  {availableThemes.map((theme) => (
                    <option key={theme.id} value={theme.id}>
                      {theme.name} - {theme.description}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                  Font Family
                </label>
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className="w-full p-3 rounded-lg border transition-colors focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: 'var(--color-background-secondary)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                >
                  <option value="Inter">Inter</option>
                  <option value="Orbitron">Orbitron</option>
                  <option value="JetBrains Mono">JetBrains Mono</option>
                  <option value="Fira Code">Fira Code</option>
                  <option value="Monaco">Monaco</option>
                  <option value="Consolas">Consolas</option>
                  <option value="Ubuntu Mono">Ubuntu Mono</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                  Font Size: {fontSize}px
                </label>
                <input
                  type="range"
                  min="12"
                  max="32"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                  style={{
                    backgroundColor: 'var(--color-surface-secondary)',
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <span style={{ color: 'var(--color-text-secondary)' }}>Smooth Caret</span>
                <button
                  onClick={() => setSmoothCaret(!smoothCaret)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    smoothCaret ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      smoothCaret ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span style={{ color: 'var(--color-text-secondary)' }}>Show Virtual Keyboard</span>
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

          {/* Preview */}
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text)' }}>👀 Theme Preview</h3>
            
            <div 
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: 'var(--color-background-secondary)',
                borderColor: 'var(--color-border)',
              }}
            >
              <div className="mb-4">
                <h4 className="font-semibold mb-2" style={{ color: 'var(--color-text)' }}>Typing Preview</h4>
                <div className="typing-text">
                  <span style={{ color: 'var(--color-correct)' }}>The quick</span>
                  <span style={{ color: 'var(--color-incorrect)', backgroundColor: 'rgba(239, 68, 68, 0.2)' }}> brwon</span>
                  <span style={{ backgroundColor: 'var(--color-current)', color: 'var(--color-background)' }}> </span>
                  <span style={{ color: 'var(--color-untyped)' }}>fox jumps over</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div style={{ color: 'var(--color-text-secondary)' }}>
                  ✓ Correct: <span style={{ color: 'var(--color-correct)' }}>Green</span>
                </div>
                <div style={{ color: 'var(--color-text-secondary)' }}>
                  ✗ Incorrect: <span style={{ color: 'var(--color-incorrect)' }}>Red</span>
                </div>
                <div style={{ color: 'var(--color-text-secondary)' }}>
                  → Current: <span style={{ color: 'var(--color-current)' }}>Yellow</span>
                </div>
                <div style={{ color: 'var(--color-text-secondary)' }}>
                  ◯ Untyped: <span style={{ color: 'var(--color-untyped)' }}>Gray</span>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-semibold mb-2" style={{ color: 'var(--color-text)' }}>Quick Actions</h4>
              <div className="space-y-2">
                <button className="btn-primary w-full">Primary Button</button>
                <button className="btn-secondary w-full">Secondary Button</button>
              </div>
            </div>
          </div>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text)' }}>⌨️ Keyboard Shortcuts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { action: 'Start/Restart Test', key: 'Space' },
              { action: 'Switch Mode', key: 'Tab' },
              { action: 'Open Settings', key: 'Ctrl + ,' },
              { action: 'View Stats', key: 'Ctrl + S' },
              { action: 'Join Racing Room', key: 'Ctrl + R' },
              { action: 'Toggle Theme', key: 'Ctrl + T' },
            ].map(({ action, key }) => (
              <div key={action} className="flex items-center justify-between p-2 rounded" style={{ backgroundColor: 'var(--color-background-secondary)' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>{action}</span>
                <kbd className="px-2 py-1 text-xs rounded" style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}>
                  {key}
                </kbd>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t flex items-center justify-between" style={{ borderColor: 'var(--color-border)' }}>
          <div style={{ color: 'var(--color-text-dimmed)' }}>
            TypeWarrior v2.0 - Enhanced typing experience
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg transition-colors hover:opacity-80"
              style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              className="btn-primary"
            >
              Save Changes
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}