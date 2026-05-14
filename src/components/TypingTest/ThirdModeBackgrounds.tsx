'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { DifficultyLevel } from '@/hooks/useTypingEngine';

type MediaItem = {
  id: string;
  type: 'gif' | 'video';
  src: string;
};

const mediaItems: MediaItem[] = [
  {
    id: 'gif-neon-city',
    type: 'gif',
    src: 'https://media.giphy.com/media/l0HlNaQ6gWfllcjDO/giphy.gif',
  },
  {
    id: 'video-rainy-neon',
    type: 'video',
    src: 'https://cdn.coverr.co/videos/coverr-rain-over-a-neon-city-1579/1080p.mp4',
  },
  {
    id: 'gif-retro-wave',
    type: 'gif',
    src: 'https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif',
  },
];

interface ThirdModeBackgroundsProps {
  difficulty: DifficultyLevel;
}

export function ThirdModeBackgrounds({ difficulty }: ThirdModeBackgroundsProps) {
  const [index, setIndex] = useState(0);
  const isThirdMode = difficulty === 'insane';

  useEffect(() => {
    if (!isThirdMode) {
      return;
    }

    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % mediaItems.length);
    }, 12000);

    return () => window.clearInterval(timer);
  }, [isThirdMode]);

  useEffect(() => {
    if (!isThirdMode) {
      setIndex(0);
    }
  }, [isThirdMode]);

  const activeMedia = useMemo(() => mediaItems[index], [index]);

  if (!isThirdMode) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeMedia.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.32 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          {activeMedia.type === 'video' ? (
            <video
              className="w-full h-full object-cover"
              src={activeMedia.src}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
          ) : (
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${activeMedia.src})` }}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <motion.div
        className="absolute inset-0"
        animate={{
          opacity: [0.15, 0.3, 0.15],
          background: [
            'radial-gradient(circle at 15% 20%, rgba(255,0,102,0.18), transparent 48%)',
            'radial-gradient(circle at 80% 30%, rgba(0,255,255,0.2), transparent 52%)',
            'radial-gradient(circle at 40% 78%, rgba(255,255,0,0.16), transparent 50%)',
          ],
        }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}
