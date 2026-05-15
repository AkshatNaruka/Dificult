'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useBackgroundStore } from '@/store/backgroundStore';

/**
 * Full-screen background overlay that renders the user's selected background
 * (video or gif) behind the typing test with a subtle opacity.
 *
 * Defers rendering until after hydration to avoid SSR mismatch since
 * the background store is persisted in localStorage.
 */
export function TypingBackground() {
  const [mounted, setMounted] = useState(false);
  const bg = useBackgroundStore((s) => s.getActiveBackground());
  const videoRef = useRef<HTMLVideoElement>(null);

  // Only render after hydration to avoid SSR mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset video when background changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [bg.id]);

  if (!mounted || bg.type === 'none') return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={bg.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.22 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.4, ease: 'easeInOut' }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 0,
          overflow: 'hidden',
        }}
        aria-hidden="true"
      >
        {bg.type === 'video' ? (
          <video
            ref={videoRef}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
            src={bg.src}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        ) : (
          <img
            src={bg.src}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        )}

        {/* Dark vignette overlay so text stays legible */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.65) 100%)',
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
